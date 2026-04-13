"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/lib/types";
import { AnswerButtons } from "./AnswerButtons";
import { AnswerCheckboxes } from "./AnswerCheckboxes";
import { AnswerReorder } from "./AnswerReorder";
import { AnswerRange } from "./AnswerRange";
import { TimerBar } from "./TimerBar";

interface QuestionPanelProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  timeLeftMs: number;
  totalTimeMs: number;
  onAnswer: (payload: unknown) => void;
  disabled: boolean;
  showCorrect: boolean;
  selectedAnswer?: unknown;
  lastScore?: number;
  lastIsCorrect?: boolean;
}

export function QuestionPanel({
  question,
  questionNumber,
  totalQuestions,
  timeLeftMs,
  totalTimeMs,
  onAnswer,
  disabled,
  showCorrect,
  selectedAnswer,
  lastScore,
  lastIsCorrect,
}: QuestionPanelProps) {
  const renderAnswerComponent = () => {
    switch (question.type) {
      case "buttons":
        return (
          <AnswerButtons
            options={question.buttons!.options}
            correctIndex={question.buttons!.correctIndex}
            onSelect={(index) => onAnswer({ selectedIndex: index })}
            selectedIndex={
              selectedAnswer !== null && selectedAnswer !== undefined
                ? (selectedAnswer as { selectedIndex: number }).selectedIndex
                : null
            }
            disabled={disabled}
            showCorrect={showCorrect}
          />
        );
      case "checkboxes":
        return (
          <AnswerCheckboxes
            options={question.checkboxes!.options}
            correctIndexes={question.checkboxes!.correctIndexes}
            onSubmit={(selectedIndexes) =>
              onAnswer({ selectedIndexes })
            }
            disabled={disabled}
            showCorrect={showCorrect}
            submittedIndexes={
              selectedAnswer
                ? (selectedAnswer as { selectedIndexes: number[] }).selectedIndexes
                : undefined
            }
          />
        );
      case "reorder":
        return (
          <AnswerReorder
            items={question.reorder!.items}
            correctOrder={question.reorder!.correctOrder}
            onSubmit={(order) => onAnswer({ submittedOrder: order })}
            disabled={disabled}
            showCorrect={showCorrect}
            submittedOrder={
              selectedAnswer
                ? (selectedAnswer as { submittedOrder: string[] }).submittedOrder
                : undefined
            }
          />
        );
      case "range":
        return (
          <AnswerRange
            min={question.range!.min}
            max={question.range!.max}
            step={question.range!.step}
            unit={question.range!.unit}
            correctValue={question.range!.correctValue}
            onSubmit={(value) => onAnswer({ playerValue: value })}
            disabled={disabled}
            showCorrect={showCorrect}
            submittedValue={
              selectedAnswer
                ? (selectedAnswer as { playerValue: number }).playerValue
                : undefined
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {/* Question type badge */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "var(--color-text-soft-cream)",
            fontFamily: "var(--font-display)",
          }}
        >
          {question.type === "buttons" && "Trắc nghiệm"}
          {question.type === "checkboxes" && "Chọn nhiều"}
          {question.type === "reorder" && "Sắp xếp"}
          {question.type === "range" && "Đoán giá trị"}
        </span>
      </div>

      {/* Question text */}
      <motion.h2
        className="text-xl md:text-2xl font-bold leading-snug text-outlined"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text-cream)",
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {question.prompt}
      </motion.h2>

      {/* Answer area */}
      <div className="mt-2">
        {renderAnswerComponent()}
      </div>

      {/* Timer */}
      <div className="mt-2">
        <TimerBar
          timeLeftMs={timeLeftMs}
          totalTimeMs={totalTimeMs}
          score={disabled ? lastScore : undefined}
        />
      </div>

      {/* Result feedback */}
      <AnimatePresence>
        {showCorrect && lastIsCorrect !== undefined && (
          <motion.div
            className="text-center py-2"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {lastIsCorrect ? (
              <div>
                <span
                  className="text-3xl font-bold text-accent-mint"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  ✓ Correct!
                </span>
                <p className="text-accent-lime text-lg font-bold mt-1">
                  +{lastScore} points
                </p>
              </div>
            ) : (
              <div>
                <span
                  className="text-3xl font-bold text-accent-pink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  ✗ Wrong!
                </span>
                <p className="text-text-soft-cream text-sm mt-1">
                  +0 points
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      {showCorrect && question.explanation && (
        <motion.div
          className="mt-2 p-4 rounded-2xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "2px solid rgba(255,255,255,0.1)",
          }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-text-soft-cream text-sm leading-relaxed">
            💡 {question.explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
}
