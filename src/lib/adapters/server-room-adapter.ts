/**
 * Server Room Adapter
 * Replaces LocalRoomAdapter — all data goes through API routes
 * so that different devices/browsers can share the same room.
 *
 * Uses polling (every 1s) instead of BroadcastChannel for sync.
 */

import type {
  RoomAdapter,
  RoomSnapshot,
  CreateRoomInput,
  JoinPlayerInput,
  AnswerSubmission,
} from "@/lib/types";

export class ServerRoomAdapter implements RoomAdapter {
  private pollIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private listeners: Map<string, Set<(snapshot: RoomSnapshot) => void>> = new Map();
  private lastUpdatedAt: Map<string, number> = new Map();

  async createRoom(input: CreateRoomInput): Promise<{ snapshot: RoomSnapshot; playerId: string }> {
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostName: input.hostName, quizSetId: input.quizSetId }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create room");
    }

    const data = await res.json();
    return { snapshot: data.snapshot, playerId: data.playerId };
  }

  async joinRoom(roomCode: string, player: JoinPlayerInput): Promise<{ snapshot: RoomSnapshot; playerId: string }> {
    const res = await fetch(`/api/rooms/${roomCode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: player.displayName }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to join room");
    }

    const data = await res.json();
    return { snapshot: data.snapshot, playerId: data.playerId };
  }

  async getRoom(roomCode: string): Promise<RoomSnapshot | null> {
    const res = await fetch(`/api/rooms/${roomCode}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.snapshot;
  }

  async saveRoom(snapshot: RoomSnapshot): Promise<void> {
    await fetch(`/api/rooms/${snapshot.roomCode}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ snapshot }),
    });
  }

  async submitAnswer(roomCode: string, answer: AnswerSubmission): Promise<RoomSnapshot> {
    const res = await fetch(`/api/rooms/${roomCode}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    if (!res.ok) {
      throw new Error("Failed to submit answer");
    }

    const data = await res.json();
    return data.snapshot;
  }

  async leaveRoom(_roomCode: string, _playerId: string): Promise<void> {
    // Optional: could call a DELETE endpoint. Not critical for now.
  }

  subscribe(roomCode: string, onChange: (snapshot: RoomSnapshot) => void): () => void {
    // Setup listener set
    if (!this.listeners.has(roomCode)) {
      this.listeners.set(roomCode, new Set());
    }
    this.listeners.get(roomCode)!.add(onChange);

    // Start polling if not already
    if (!this.pollIntervals.has(roomCode)) {
      const interval = setInterval(async () => {
        try {
          const snapshot = await this.getRoom(roomCode);
          if (snapshot) {
            const lastUpdate = this.lastUpdatedAt.get(roomCode) || 0;
            if (snapshot.updatedAt > lastUpdate) {
              this.lastUpdatedAt.set(roomCode, snapshot.updatedAt);
              const callbacks = this.listeners.get(roomCode);
              if (callbacks) {
                callbacks.forEach((cb) => cb(snapshot));
              }
            }
          }
        } catch {
          // Silently ignore fetch errors during polling
        }
      }, 1000); // poll every 1 second

      this.pollIntervals.set(roomCode, interval);
    }

    // Return unsubscribe function
    return () => {
      this.listeners.get(roomCode)?.delete(onChange);

      if (this.listeners.get(roomCode)?.size === 0) {
        const interval = this.pollIntervals.get(roomCode);
        if (interval) clearInterval(interval);
        this.pollIntervals.delete(roomCode);
        this.listeners.delete(roomCode);
        this.lastUpdatedAt.delete(roomCode);
      }
    };
  }
}

// Singleton
let adapterInstance: ServerRoomAdapter | null = null;

export function getServerRoomAdapter(): ServerRoomAdapter {
  if (!adapterInstance) {
    adapterInstance = new ServerRoomAdapter();
  }
  return adapterInstance;
}
