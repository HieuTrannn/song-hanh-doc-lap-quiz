import type {
  RoomAdapter,
  RoomSnapshot,
  CreateRoomInput,
  JoinPlayerInput,
  AnswerSubmission,
  PlayerState,
} from "@/lib/types";

const STORAGE_PREFIX = "quiz_clone.room.";
const ROOM_INDEX_KEY = "quiz_clone.room_index";
const BROADCAST_CHANNEL = "quiz_clone_room_sync";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoid ambiguous chars
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function generatePlayerId(): string {
  return crypto.randomUUID();
}

function generateAvatarSeed(): string {
  return Math.random().toString(36).substring(2, 8);
}

function getSnapshotKey(roomCode: string): string {
  return `${STORAGE_PREFIX}${roomCode}.snapshot`;
}

function loadSnapshot(roomCode: string): RoomSnapshot | null {
  try {
    const raw = localStorage.getItem(getSnapshotKey(roomCode));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data as RoomSnapshot;
  } catch {
    return null;
  }
}

function saveSnapshot(snapshot: RoomSnapshot): void {
  const key = getSnapshotKey(snapshot.roomCode);
  localStorage.setItem(key, JSON.stringify({ version: 1, data: snapshot }));
}

function addToRoomIndex(roomCode: string): void {
  try {
    const raw = localStorage.getItem(ROOM_INDEX_KEY);
    const index: string[] = raw ? JSON.parse(raw) : [];
    if (!index.includes(roomCode)) {
      index.push(roomCode);
      localStorage.setItem(ROOM_INDEX_KEY, JSON.stringify(index));
    }
  } catch {
    localStorage.setItem(ROOM_INDEX_KEY, JSON.stringify([roomCode]));
  }
}

export class LocalRoomAdapter implements RoomAdapter {
  private channels: Map<string, BroadcastChannel> = new Map();
  private listeners: Map<string, Set<(snapshot: RoomSnapshot) => void>> = new Map();

  async createRoom(input: CreateRoomInput): Promise<RoomSnapshot> {
    const roomCode = generateRoomCode();
    const playerId = generatePlayerId();

    const host: PlayerState = {
      playerId,
      displayName: input.hostName,
      avatarSeed: generateAvatarSeed(),
      joinedAt: Date.now(),
      isHost: true,
      totalScore: 0,
      totalCorrect: 0,
      avgResponseMs: null,
      lastSeenAt: Date.now(),
    };

    const snapshot: RoomSnapshot = {
      roomCode,
      hostPlayerId: playerId,
      status: "lobby",
      currentQuestionIndex: 0,
      quizSetId: input.quizSetId,
      players: [host],
      leaderboard: [],
      updatedAt: Date.now(),
    };

    saveSnapshot(snapshot);
    addToRoomIndex(roomCode);
    this.broadcast(roomCode, snapshot);

    // Store current player ID
    sessionStorage.setItem("quiz_clone.currentPlayerId", playerId);
    sessionStorage.setItem("quiz_clone.currentRoomCode", roomCode);

    return snapshot;
  }

  async joinRoom(roomCode: string, player: JoinPlayerInput): Promise<RoomSnapshot> {
    const snapshot = loadSnapshot(roomCode);
    if (!snapshot) {
      throw new Error("Room not found in this browser context");
    }

    if (snapshot.status !== "lobby") {
      throw new Error("Game already started");
    }

    const playerId = generatePlayerId();
    const newPlayer: PlayerState = {
      playerId,
      displayName: player.displayName,
      avatarSeed: player.avatarSeed || generateAvatarSeed(),
      joinedAt: Date.now(),
      isHost: false,
      totalScore: 0,
      totalCorrect: 0,
      avgResponseMs: null,
      lastSeenAt: Date.now(),
    };

    snapshot.players.push(newPlayer);
    snapshot.updatedAt = Date.now();

    saveSnapshot(snapshot);
    this.broadcast(roomCode, snapshot);

    sessionStorage.setItem("quiz_clone.currentPlayerId", playerId);
    sessionStorage.setItem("quiz_clone.currentRoomCode", roomCode);

    return snapshot;
  }

  async getRoom(roomCode: string): Promise<RoomSnapshot | null> {
    return loadSnapshot(roomCode);
  }

  async saveRoom(snapshot: RoomSnapshot): Promise<void> {
    snapshot.updatedAt = Date.now();
    saveSnapshot(snapshot);
    this.broadcast(snapshot.roomCode, snapshot);
  }

  async submitAnswer(roomCode: string, answer: AnswerSubmission): Promise<RoomSnapshot> {
    const snapshot = loadSnapshot(roomCode);
    if (!snapshot) throw new Error("Room not found");
    if (!snapshot.questionState) throw new Error("No active question");

    // Check if already submitted
    if (snapshot.questionState.lockedPlayers.includes(answer.playerId)) {
      return snapshot;
    }

    // Check if time is up
    if (Date.now() > snapshot.questionState.endsAt) {
      return snapshot;
    }

    snapshot.questionState.answerLog.push(answer);
    snapshot.questionState.lockedPlayers.push(answer.playerId);

    // Update player score
    const player = snapshot.players.find((p) => p.playerId === answer.playerId);
    if (player) {
      player.totalScore += answer.scoreAwarded;
      if (answer.isCorrect) {
        player.totalCorrect += 1;
      }
      // Update average response time
      const responseMs = answer.submittedAt - snapshot.questionState.startedAt;
      if (player.avgResponseMs === null) {
        player.avgResponseMs = responseMs;
      } else {
        player.avgResponseMs =
          (player.avgResponseMs * (player.totalCorrect + (answer.isCorrect ? 0 : 1) - 1) + responseMs) /
          (player.totalCorrect + (answer.isCorrect ? 0 : 1));
      }
    }

    snapshot.updatedAt = Date.now();
    saveSnapshot(snapshot);
    this.broadcast(roomCode, snapshot);

    return snapshot;
  }

  async leaveRoom(roomCode: string, playerId: string): Promise<void> {
    const snapshot = loadSnapshot(roomCode);
    if (!snapshot) return;

    snapshot.players = snapshot.players.filter((p) => p.playerId !== playerId);
    snapshot.updatedAt = Date.now();

    if (snapshot.players.length === 0) {
      localStorage.removeItem(getSnapshotKey(roomCode));
    } else {
      saveSnapshot(snapshot);
      this.broadcast(roomCode, snapshot);
    }
  }

  subscribe(roomCode: string, onChange: (snapshot: RoomSnapshot) => void): () => void {
    // Setup BroadcastChannel
    if (!this.channels.has(roomCode)) {
      const channel = new BroadcastChannel(`${BROADCAST_CHANNEL}_${roomCode}`);
      channel.onmessage = (event) => {
        const snapshot = event.data as RoomSnapshot;
        const callbacks = this.listeners.get(roomCode);
        if (callbacks) {
          callbacks.forEach((cb) => cb(snapshot));
        }
      };
      this.channels.set(roomCode, channel);
    }

    // Setup listener set
    if (!this.listeners.has(roomCode)) {
      this.listeners.set(roomCode, new Set());
    }
    this.listeners.get(roomCode)!.add(onChange);

    // Also listen to storage events (for other tabs)
    const storageHandler = (event: StorageEvent) => {
      if (event.key === getSnapshotKey(roomCode) && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          onChange(parsed.data as RoomSnapshot);
        } catch {
          // ignore parse errors
        }
      }
    };
    window.addEventListener("storage", storageHandler);

    // Return unsubscribe function
    return () => {
      this.listeners.get(roomCode)?.delete(onChange);
      window.removeEventListener("storage", storageHandler);

      if (this.listeners.get(roomCode)?.size === 0) {
        this.channels.get(roomCode)?.close();
        this.channels.delete(roomCode);
        this.listeners.delete(roomCode);
      }
    };
  }

  private broadcast(roomCode: string, snapshot: RoomSnapshot): void {
    const channel = this.channels.get(roomCode);
    if (channel) {
      channel.postMessage(snapshot);
    }
    // Also try to broadcast via a temporary channel for other tabs that subscribed independently
    try {
      const tempChannel = new BroadcastChannel(`${BROADCAST_CHANNEL}_${roomCode}`);
      tempChannel.postMessage(snapshot);
      tempChannel.close();
    } catch {
      // BroadcastChannel not supported
    }
  }
}

// Singleton
let adapterInstance: LocalRoomAdapter | null = null;

export function getLocalRoomAdapter(): LocalRoomAdapter {
  if (!adapterInstance) {
    adapterInstance = new LocalRoomAdapter();
  }
  return adapterInstance;
}
