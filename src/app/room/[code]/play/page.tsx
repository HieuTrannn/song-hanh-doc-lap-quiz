"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { TopStrip } from "@/components/shell/TopStrip";
import { QuestionPanel } from "@/components/quiz/QuestionPanel";
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
    nextQuestion,
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
      import("@/lib/adapters/local-room-adapter").then(({ getLocalRoomAdapter }) => {
        const adapter = getLocalRoomAdapter();
        adapter.getRoom(roomCode).then((snap) => {
          if (snap) {
            useGameStore.setState({ roomSnapshot: snap });
            const q = hcm202Quiz.questions[snap.currentQuestionIndex];
            if (q && snap.status === "question") {
              const totalMs = snap.questionState!.endsAt - snap.questionState!.startedAt;
              const leftMs = Math.max(0, snap.questionState!.endsAt - Date.now());
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
      useGameStore.getState().showResult();
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

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
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
              className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Left panel - Question */}
              <div className="w-full lg:w-5/12">
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

              {/* Right panel - Image / Placeholder */}
              <div className="w-full lg:w-7/12 flex items-center justify-center">
                <motion.div
                  className="w-full aspect-video rounded-3xl flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.15)",
                    border: "3px solid var(--color-ink)",
                    boxShadow: "var(--shadow-chunky)",
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                >
                  {question.imageUrl ? (
                    <img
                      src={question.imageUrl}
                      alt={question.prompt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <span className="text-6xl mb-4 block">
                        {question.type === "buttons" && "🎯"}
                        {question.type === "checkboxes" && "☑️"}
                        {question.type === "reorder" && "🔢"}
                        {question.type === "range" && "📏"}
                      </span>
                      <p
                        className="text-text-soft-cream/50 text-sm"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Câu {questionIndex + 1} / {totalQuestions}
                      </p>
                      <p className="text-text-soft-cream/30 text-xs mt-1">
                        {question.type === "buttons" && "Chọn 1 đáp án đúng"}
                        {question.type === "checkboxes" && "Chọn tất cả đáp án đúng"}
                        {question.type === "reorder" && "Kéo thả sắp xếp đúng thứ tự"}
                        {question.type === "range" && "Đoán giá trị chính xác"}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
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
