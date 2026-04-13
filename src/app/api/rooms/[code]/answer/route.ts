import { NextRequest, NextResponse } from "next/server";
import { getRoom, saveRoom } from "@/lib/adapters/room-store";
import type { AnswerSubmission } from "@/lib/types";

// POST /api/rooms/[code]/answer  → submit answer
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const roomCode = code.toUpperCase();
    const body = await req.json();
    const answer: AnswerSubmission = body.answer;

    if (!answer) {
      return NextResponse.json({ error: "Missing answer" }, { status: 400 });
    }

    const snapshot = await getRoom(roomCode);
    if (!snapshot) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    if (!snapshot.questionState) {
      return NextResponse.json({ error: "No active question" }, { status: 400 });
    }

    // Check if already submitted
    if (snapshot.questionState.lockedPlayers.includes(answer.playerId)) {
      return NextResponse.json({ snapshot });
    }

    // Check if time is up
    if (Date.now() > snapshot.questionState.endsAt) {
      return NextResponse.json({ snapshot });
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
    await saveRoom(snapshot);

    return NextResponse.json({ snapshot });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
