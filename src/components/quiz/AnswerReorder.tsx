"use client";

import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ANSWER_COLORS } from "@/lib/types";

interface AnswerReorderProps {
  items: string[];
  correctOrder: string[];
  onSubmit: (order: string[]) => void;
  disabled: boolean;
  showCorrect: boolean;
  submittedOrder?: string[];
}

export function AnswerReorder({
  items,
  correctOrder,
  onSubmit,
  disabled,
  showCorrect,
  submittedOrder,
}: AnswerReorderProps) {
  const [order, setOrder] = useState<string[]>([...items]);

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit(order);
  };

  const getItemState = (item: string, index: number) => {
    if (!showCorrect) return "default";
    const displayOrder = submittedOrder || order;
    const correctIndex = correctOrder.indexOf(item);
    const submittedIndex = displayOrder.indexOf(item);
    if (submittedIndex === correctIndex) return "correct";
    return "wrong";
  };

  const displayOrder = showCorrect && submittedOrder ? submittedOrder : order;

  return (
    <div className="flex flex-col gap-3 w-full">
      {showCorrect ? (
        // Static display when showing results
        <div className="flex flex-col gap-2">
          {displayOrder.map((item, index) => {
            const state = getItemState(item, index);
            const color = ANSWER_COLORS[index % ANSWER_COLORS.length];
            return (
              <motion.div
                key={item}
                className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-base"
                style={{
                  fontFamily: "var(--font-display)",
                  backgroundColor:
                    state === "correct" ? "#10B981" : "#EF4444",
                  color: "#fff",
                  border: `3px solid ${
                    state === "correct" ? "#059669" : "#DC2626"
                  }`,
                  boxShadow: "0 3px 0 rgba(0,0,0,0.25)",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="flex-1">{item}</span>
                {state === "correct" ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </motion.div>
            );
          })}
          
          {/* Show correct order */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-text-soft-cream text-sm font-semibold mb-2">Đáp án đúng:</p>
            {correctOrder.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-cream"
              >
                <span className="w-5 h-5 rounded-full bg-accent-mint/30 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Draggable list during gameplay
        <>
          <Reorder.Group
            axis="y"
            values={order}
            onReorder={disabled ? () => {} : setOrder}
            className="flex flex-col gap-2"
          >
            {order.map((item, index) => {
              const color = ANSWER_COLORS[index % ANSWER_COLORS.length];
              return (
                <Reorder.Item
                  key={item}
                  value={item}
                  className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-base select-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    backgroundColor: color.bg,
                    color: color.text,
                    border: `3px solid ${color.border}`,
                    boxShadow: "0 3px 0 rgba(0,0,0,0.25)",
                    cursor: disabled ? "default" : "grab",
                  }}
                  whileDrag={{
                    scale: 1.05,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                    cursor: "grabbing",
                  }}
                >
                  <span className="flex-1">{item}</span>
                  {!disabled && (
                    <span className="text-ink/40 text-xl font-bold">≡</span>
                  )}
                </Reorder.Item>
              );
            })}
          </Reorder.Group>

          {/* Submit button */}
          {!disabled && (
            <motion.button
              onClick={handleSubmit}
              className="mt-2 w-full py-3 rounded-full font-bold text-lg text-white transition-all"
              style={{
                fontFamily: "var(--font-display)",
                backgroundColor: "#10B981",
                border: "3px solid #059669",
                boxShadow: "0 4px 0 rgba(0,0,0,0.35)",
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit answer
            </motion.button>
          )}
        </>
      )}
    </div>
  );
}
