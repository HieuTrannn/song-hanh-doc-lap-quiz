"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface AnswerCheckboxesProps {
  options: string[];
  correctIndexes: number[];
  onSubmit: (selectedIndexes: number[]) => void;
  disabled: boolean;
  showCorrect: boolean;
  submittedIndexes?: number[];
}

export function AnswerCheckboxes({
  options,
  correctIndexes,
  onSubmit,
  disabled,
  showCorrect,
  submittedIndexes,
}: AnswerCheckboxesProps) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleOption = (index: number) => {
    if (disabled) return;
    setSelected((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0 || disabled) return;
    onSubmit(selected);
  };

  const getItemState = (index: number) => {
    if (!showCorrect) {
      return selected.includes(index) ? "selected" : "default";
    }
    const wasSelected = submittedIndexes?.includes(index) || selected.includes(index);
    const isCorrect = correctIndexes.includes(index);
    if (isCorrect && wasSelected) return "correct";
    if (isCorrect && !wasSelected) return "missed";
    if (!isCorrect && wasSelected) return "wrong";
    return "default";
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {options.map((option, index) => {
        const state = getItemState(index);
        const isChecked = selected.includes(index) || submittedIndexes?.includes(index);

        return (
          <motion.button
            key={index}
            onClick={() => toggleOption(index)}
            disabled={disabled}
            className="relative w-full text-left px-5 py-4 rounded-2xl font-semibold text-base flex items-center gap-3 transition-all"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor:
                state === "correct"
                  ? "#10B981"
                  : state === "wrong"
                  ? "#EF4444"
                  : state === "missed"
                  ? "rgba(16, 185, 129, 0.3)"
                  : state === "selected"
                  ? "#E8D27A"
                  : "#F1EBDD",
              color:
                state === "correct" || state === "wrong"
                  ? "#fff"
                  : "#111414",
              border: `3px solid ${
                state === "correct"
                  ? "#059669"
                  : state === "wrong"
                  ? "#DC2626"
                  : state === "missed"
                  ? "#10B981"
                  : state === "selected"
                  ? "#B8A93A"
                  : "#D5CFC0"
              }`,
              boxShadow: "0 2px 0 rgba(0,0,0,0.15)",
              cursor: disabled ? "default" : "pointer",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.25 }}
            whileHover={!disabled ? { scale: 1.01 } : {}}
          >
            {/* Checkbox */}
            <div
              className="w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                borderColor:
                  state === "correct" || state === "wrong"
                    ? "rgba(255,255,255,0.6)"
                    : isChecked
                    ? "#111414"
                    : "#999",
                backgroundColor: isChecked
                  ? state === "correct"
                    ? "#fff"
                    : state === "wrong"
                    ? "#fff"
                    : "#111414"
                  : "transparent",
              }}
            >
              {isChecked && (
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={
                    state === "correct"
                      ? "#10B981"
                      : state === "wrong"
                      ? "#EF4444"
                      : "#fff"
                  }
                  strokeWidth={3}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              )}
            </div>

            <span className="flex-1">{option}</span>
          </motion.button>
        );
      })}

      {/* Submit button */}
      {!disabled && !showCorrect && (
        <motion.button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="mt-2 w-full py-3 rounded-full font-bold text-lg transition-all"
          style={{
            fontFamily: "var(--font-display)",
            backgroundColor:
              selected.length > 0 ? "#10B981" : "#F95985",
            color: "#fff",
            border: "3px solid",
            borderColor:
              selected.length > 0 ? "#059669" : "#E04070",
            boxShadow: "0 4px 0 rgba(0,0,0,0.35)",
            cursor: selected.length > 0 ? "pointer" : "default",
            opacity: selected.length > 0 ? 1 : 0.8,
          }}
          whileHover={selected.length > 0 ? { scale: 1.02, y: -2 } : {}}
          whileTap={selected.length > 0 ? { scale: 0.98 } : {}}
        >
          {selected.length > 0 ? "Submit answer" : "Select one or more"}
        </motion.button>
      )}
    </div>
  );
}
