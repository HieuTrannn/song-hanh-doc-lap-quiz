import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/adapters/room-store";
import type { PlayerState } from "@/lib/types";

function generatePlayerId(): string {
  return crypto.randomUUID();
}

function generateAvatarSeed(): string {
  return Math.random().toString(36).substring(2, 8);
}

// GET /api/rooms/[code]  → get room snapshot
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const roomCode = code.toUpperCase();
  const snapshot = roomStore.get(roomCode);

  if (!snapshot) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({ snapshot });
}

// POST /api/rooms/[code]  → join room
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const roomCode = code.toUpperCase();
    const body = await req.json();
    const { displayName } = body;

    if (!displayName) {
      return NextResponse.json({ error: "Missing displayName" }, { status: 400 });
    }

    const snapshot = roomStore.get(roomCode);
    if (!snapshot) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (snapshot.status !== "lobby") {
      return NextResponse.json({ error: "Game already started" }, { status: 400 });
    }

    const playerId = generatePlayerId();
    const newPlayer: PlayerState = {
      playerId,
      displayName,
      avatarSeed: generateAvatarSeed(),
      joinedAt: Date.now(),
      isHost: false,
      totalScore: 0,
      totalCorrect: 0,
      avgResponseMs: null,
      lastSeenAt: Date.now(),
    };

    snapshot.players.push(newPlayer);
    snapshot.updatedAt = Date.now();
    roomStore.set(roomCode, snapshot);

    return NextResponse.json({ snapshot, playerId });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// PUT /api/rooms/[code]  → update room (save snapshot)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const roomCode = code.toUpperCase();
    const body = await req.json();
    const { snapshot } = body;

    if (!snapshot) {
      return NextResponse.json({ error: "Missing snapshot" }, { status: 400 });
    }

    snapshot.updatedAt = Date.now();
    roomStore.set(roomCode, snapshot);

    return NextResponse.json({ snapshot });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
