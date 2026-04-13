import { NextRequest, NextResponse } from "next/server";
import { saveRoom } from "@/lib/adapters/room-store";
import type { RoomSnapshot, PlayerState } from "@/lib/types";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
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

// POST /api/rooms  → create room
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hostName, quizSetId } = body;

    if (!hostName || !quizSetId) {
      return NextResponse.json({ error: "Missing hostName or quizSetId" }, { status: 400 });
    }

    const roomCode = generateRoomCode();
    const playerId = generatePlayerId();

    const host: PlayerState = {
      playerId,
      displayName: hostName,
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
      quizSetId,
      players: [host],
      leaderboard: [],
      updatedAt: Date.now(),
    };

    await saveRoom(snapshot);

    return NextResponse.json({ snapshot, playerId });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
