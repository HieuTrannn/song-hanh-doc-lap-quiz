"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { TopStrip } from "@/components/shell/TopStrip";
import { QuestionPanel } from "@/components/quiz/QuestionPanel";
import { PlayerStrip } from "@/components/quiz/PlayerStrip";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";
import { useGameStore } from "@/store/game-store";
import { hcm202Quiz } from "@/data/quizzes/hcm202";
import { SLIDE_THEMES } from "@/lib/types";

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params.code as string).toUpperCase();

  const {
    roomSnapshot,
    currentPlayerId,
    phase,
    timeLeftMs,
    totalTimeMs,
    currentQuestion,
    selectedAnswer,
    answerSubmitted,
    lastScore,
    lastIsCorrect,
    leaderboard,
    submitAnswer,
    subscribeToRoom,
    startTimer,
    skipQuestion,
    calculateLeaderboard,
    getCurrentQuestion,
  } = useGameStore();

  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Mount & sync
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
            useGameStore.setState({ roomSnapshot: snap });
            const q = hcm202Quiz.questions[snap.currentQuestionIndex];
            if (q && snap.status === "question") {
              const totalMs = snap.questionState!.endsAt - snap.questionState!.startedAt;
              // Clamp leftMs to [0, totalMs] to handle clock skew between devices
              const leftMs = Math.min(totalMs, Math.max(0, snap.questionState!.endsAt - Date.now()));
              useGameStore.setState({
                currentQuestion: q,
                phase: "question_active",
                timeLeftMs: leftMs,
                totalTimeMs: totalMs,
              });
              startTimer();
            }
          }
        });
      });
    }
  }, [roomCode]);

  // Countdown animation
  useEffect(() => {
    if (phase === "countdown") {
      setCountdown(3);
      const iv = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(iv);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(iv);
    }
  }, [phase]);

  // Redirect to final when game finishes
  useEffect(() => {
    if (phase === "final_results" || roomSnapshot?.status === "finished") {
      router.push(`/room/${roomCode}/final`);
    }
  }, [phase, roomSnapshot?.status, roomCode, router]);

  // Auto-skip to result when ALL players have answered
  useEffect(() => {
    const hostCheck = roomSnapshot?.hostPlayerId === currentPlayerId;
    // Verify the questionState actually belongs to the CURRENT question
    // to prevent stale polling data from triggering a false auto-skip
    const questionStateMatchesCurrent =
      roomSnapshot?.questionState?.questionId === currentQuestion?.id;

    if (
      (phase === "question_active" || phase === "question_locked") &&
      hostCheck &&
      questionStateMatchesCurrent &&
      roomSnapshot?.questionState &&
      roomSnapshot.players.length > 0 &&
      roomSnapshot.questionState.lockedPlayers.length >= roomSnapshot.players.length
    ) {
      // Small delay so the last player sees their selection animation
      const timeout = setTimeout(() => {
        useGameStore.getState().showResult();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [
    phase,
    roomSnapshot?.hostPlayerId,
    currentPlayerId,
    roomSnapshot?.questionState?.lockedPlayers.length,
    roomSnapshot?.questionState?.questionId,
    roomSnapshot?.players.length,
    currentQuestion?.id,
  ]);

  if (!mounted) return null;

  const questionIndex = roomSnapshot?.currentQuestionIndex ?? 0;
  const totalQuestions = hcm202Quiz.questions.length;
  const question = currentQuestion || getCurrentQuestion();
  const themeIndex = questionIndex % SLIDE_THEMES.length;
  const isHost = roomSnapshot?.hostPlayerId === currentPlayerId;

  const handleAnswer = async (payload: unknown) => {
    await submitAnswer(payload);
  };

  const handleSkip = () => {
    if (isHost) {
      skipQuestion();
    }
  };

  return (
    <AppShell themeIndex={themeIndex}>
      <TopStrip
        roomCode={roomCode}
        quizTitle={hcm202Quiz.title}
        playerCount={roomSnapshot?.players.length || 0}
        currentSlide={questionIndex + 1}
        totalSlides={totalQuestions}
        onSkip={isHost ? handleSkip : undefined}
        onFullscreen={() => document.documentElement.requestFullscreen?.()}
      />

      <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Countdown */}
          {phase === "countdown" && (
            <motion.div
              key="countdown"
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.span
                className="text-9xl font-bold text-text-cream text-outlined"
                style={{ fontFamily: "var(--font-display)" }}
                key={countdown}
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {countdown || "GO!"}
              </motion.span>
            </motion.div>
          )}

          {/* Question Active / Locked / Result */}
          {(phase === "question_active" || phase === "question_locked" || phase === "result_reveal") && question && (
            <motion.div
              key={`question-${question.id}`}
              className="w-full max-w-5xl flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`flex flex-col lg:flex-row gap-6 items-center ${question.imageUrl ? "" : "justify-center"}`}>
                {/* Left panel - Question */}
                <div className={question.imageUrl ? "w-full lg:w-5/12" : "w-full max-w-2xl"}>
                  <QuestionPanel
                    question={question}
                    questionNumber={questionIndex + 1}
                    totalQuestions={totalQuestions}
                    timeLeftMs={timeLeftMs}
                    totalTimeMs={totalTimeMs}
                    onAnswer={handleAnswer}
                    disabled={answerSubmitted || phase === "result_reveal"}
                    showCorrect={phase === "result_reveal"}
                    selectedAnswer={selectedAnswer}
                    lastScore={lastScore}
                    lastIsCorrect={lastIsCorrect}
                  />
                </div>

                {/* Right panel - Image (only when available) */}
                {question.imageUrl && (
                  <div className="w-full lg:w-7/12 flex items-center justify-center">
                    <motion.div
                      className="w-full rounded-3xl flex items-center justify-center overflow-hidden"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.15)",
                        border: "3px solid var(--color-ink)",
                        boxShadow: "var(--shadow-chunky)",
                        maxHeight: "50vh",
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                    >
                      <img
                        src={question.imageUrl}
                        alt={question.prompt}
                        className="w-full h-full object-contain"
                        style={{ maxHeight: "50vh" }}
                      />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Player strip - show who answered */}
              {roomSnapshot && roomSnapshot.players.length > 1 && (
                <PlayerStrip
                  players={roomSnapshot.players}
                  lockedPlayerIds={roomSnapshot.questionState?.lockedPlayers || []}
                  currentPlayerId={currentPlayerId || undefined}
                />
              )}
            </motion.div>
          )}

          {/* Leaderboard transition */}
          {phase === "leaderboard_transition" && (
            <motion.div
              key="leaderboard"
              className="w-full max-w-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <LeaderboardView
                entries={leaderboard.length > 0 ? leaderboard : calculateLeaderboard()}
                currentPlayerId={currentPlayerId || undefined}
                totalQuestions={totalQuestions}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
