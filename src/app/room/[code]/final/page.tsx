"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { TopStrip } from "@/components/shell/TopStrip";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";
import { useGameStore } from "@/store/game-store";
import { hcm202Quiz } from "@/data/quizzes/hcm202";

export default function FinalPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params.code as string).toUpperCase();

  const {
    roomSnapshot,
    currentPlayerId,
    leaderboard,
    calculateLeaderboard,
    subscribeToRoom,
    cleanup,
  } = useGameStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const playerId = sessionStorage.getItem("quiz_clone.currentPlayerId");
    if (playerId && !currentPlayerId) {
      useGameStore.setState({ currentPlayerId: playerId });
    }

    if (!roomSnapshot || roomSnapshot.roomCode !== roomCode) {
      subscribeToRoom(roomCode);
      import("@/lib/adapters/server-room-adapter").then(({ getServerRoomAdapter }) => {
        const adapter = getServerRoomAdapter();
        adapter.getRoom(roomCode).then((snap) => {
          if (snap) {
            useGameStore.setState({
              roomSnapshot: snap,
              phase: "final_results",
              leaderboard: snap.leaderboard || [],
            });
          }
        });
      });
    }
  }, [roomCode]);

  if (!mounted) return null;

  const entries = leaderboard.length > 0 ? leaderboard : calculateLeaderboard();
  const isHost = roomSnapshot?.hostPlayerId === currentPlayerId;

  const handlePlayAgain = () => {
    cleanup();
    router.push("/");
  };

  const handleBackToLobby = () => {
    if (roomSnapshot) {
      import("@/lib/adapters/server-room-adapter").then(async ({ getServerRoomAdapter }) => {
        const adapter = getServerRoomAdapter();
        const snap = { ...roomSnapshot };
        snap.status = "lobby";
        snap.currentQuestionIndex = 0;
        snap.questionState = undefined;
        snap.players = snap.players.map((p) => ({
          ...p,
          totalScore: 0,
          totalCorrect: 0,
          avgResponseMs: null,
        }));
        snap.leaderboard = [];
        await adapter.saveRoom(snap);
        useGameStore.setState({ roomSnapshot: snap, phase: "lobby", leaderboard: [] });
        router.push(`/room/${roomCode}/lobby`);
      });
    }
  };

  return (
    <AppShell bg="#19444A" themeIndex={0}>
      <TopStrip
        roomCode={roomCode}
        quizTitle={hcm202Quiz.title}
        playerCount={roomSnapshot?.players.length || 0}
        onFullscreen={() => document.documentElement.requestFullscreen?.()}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Confetti-like header */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-text-soft-cream text-sm mb-2">
            {hcm202Quiz.title}
          </p>
        </motion.div>

        {/* Leaderboard */}
        <LeaderboardView
          entries={entries}
          currentPlayerId={currentPlayerId || undefined}
          isFinal={true}
          totalQuestions={hcm202Quiz.questions.length}
        />

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isHost && (
            <motion.button
              onClick={handleBackToLobby}
              className="pill-button px-8 py-3"
              style={{
                backgroundColor: "var(--color-accent-lime)",
                color: "var(--color-ink)",
                fontFamily: "var(--font-display)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Play Again
            </motion.button>
          )}

          <motion.button
            onClick={handlePlayAgain}
            className="pill-button px-8 py-3"
            style={{
              backgroundColor: "var(--color-surface-teal)",
              color: "var(--color-text-cream)",
              fontFamily: "var(--font-display)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏠 Back to Home
          </motion.button>
        </motion.div>
      </div>
    </AppShell>
  );
}
