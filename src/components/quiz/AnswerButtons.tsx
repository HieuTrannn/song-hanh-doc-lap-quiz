"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ANSWER_COLORS } from "@/lib/types";

interface AnswerButtonsProps {
  options: string[];
  correctIndex: number;
  onSelect: (index: number) => void;
  selectedIndex: number | null;
  disabled: boolean;
  showCorrect: boolean;
}

export function AnswerButtons({
  options,
  correctIndex,
  onSelect,
  selectedIndex,
  disabled,
  showCorrect,
}: AnswerButtonsProps) {
  const getButtonState = (index: number) => {
    if (!showCorrect && selectedIndex === null) return "default";
    if (!showCorrect && selectedIndex === index) return "selected";
    if (showCorrect && index === correctIndex) return "correct";
    if (showCorrect && selectedIndex === index && index !== correctIndex) return "wrong";
    if (showCorrect) return "dimmed";
    return "default";
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {options.map((option, index) => {
        const state = getButtonState(index);
        const color = ANSWER_COLORS[index % ANSWER_COLORS.length];

        return (
          <motion.button
            key={index}
            onClick={() => !disabled && onSelect(index)}
            disabled={disabled}
            className="relative w-full text-left px-6 py-4 rounded-full font-bold text-base transition-all"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor:
                state === "correct"
                  ? "#10B981"
                  : state === "wrong"
                  ? "#EF4444"
                  : state === "dimmed"
                  ? "rgba(255,255,255,0.1)"
                  : color.bg,
              color:
                state === "correct" || state === "wrong"
                  ? "#fff"
                  : state === "dimmed"
                  ? "rgba(255,255,255,0.4)"
                  : color.text,
              border: `3px solid ${
                state === "correct"
                  ? "#059669"
                  : state === "wrong"
                  ? "#DC2626"
                  : state === "dimmed"
                  ? "rgba(255,255,255,0.05)"
                  : color.border
              }`,
              boxShadow:
                state === "dimmed"
                  ? "none"
                  : "0 4px 0 rgba(0,0,0,0.35)",
              cursor: disabled ? "default" : "pointer",
              opacity: state === "dimmed" ? 0.5 : 1,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: state === "dimmed" ? 0.5 : 1, x: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.25,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            whileHover={
              !disabled
                ? { scale: 1.02, y: -2 }
                : {}
            }
            whileTap={
              !disabled
                ? { scale: 0.98, y: 1 }
                : {}
            }
          >
            <span className="relative z-10">{option}</span>
            
            {/* Correct check icon */}
            {state === "correct" && (
              <motion.span
                className="absolute right-4 top-1/2 -translate-y-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.span>
            )}

            {/* Wrong X icon */}
            {state === "wrong" && (
              <motion.span
                className="absolute right-4 top-1/2 -translate-y-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
