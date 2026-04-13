"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface AnswerRangeProps {
  min: number;
  max: number;
  step?: number;
  unit?: string;
  correctValue: number;
  onSubmit: (value: number) => void;
  disabled: boolean;
  showCorrect: boolean;
  submittedValue?: number;
}

export function AnswerRange({
  min,
  max,
  step = 1,
  unit = "",
  correctValue,
  onSubmit,
  disabled,
  showCorrect,
  submittedValue,
}: AnswerRangeProps) {
  const midPoint = Math.round((min + max) / 2);
  const [value, setValue] = useState(midPoint);

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit(value);
  };

  const displayValue = showCorrect && submittedValue !== undefined ? submittedValue : value;
  const distance = showCorrect ? Math.abs((submittedValue ?? value) - correctValue) : 0;

  // Calculate thumb position percentage
  const thumbPercent = ((displayValue - min) / (max - min)) * 100;
  const correctPercent = ((correctValue - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Value display speech bubble */}
      <div className="relative flex justify-center">
        <motion.div
          className="relative px-6 py-3 rounded-2xl font-bold text-2xl text-center"
          style={{
            fontFamily: "var(--font-display)",
            backgroundColor: showCorrect
              ? distance === 0
                ? "#10B981"
                : "#F59E0B"
              : "#F1EBDD",
            color: showCorrect ? "#fff" : "#111414",
            border: "3px solid",
            borderColor: showCorrect
              ? distance === 0
                ? "#059669"
                : "#D97706"
              : "#D5CFC0",
            boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
          key={displayValue}
        >
          {displayValue}
          {unit && <span className="text-lg ml-1 opacity-70">{unit}</span>}

          {/* Speech bubble arrow */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
            style={{
              backgroundColor: showCorrect
                ? distance === 0
                  ? "#10B981"
                  : "#F59E0B"
                : "#F1EBDD",
              borderRight: "3px solid",
              borderBottom: "3px solid",
              borderColor: showCorrect
                ? distance === 0
                  ? "#059669"
                  : "#D97706"
                : "#D5CFC0",
            }}
          />
        </motion.div>
      </div>

      {/* Slider */}
      <div className="relative pt-4 pb-2">
        {/* Track */}
        <div
          className="relative h-4 rounded-full"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Filled track */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${thumbPercent}%`,
              background: "linear-gradient(90deg, #10B981, #C6EA84, #E8D27A)",
            }}
          />

          {/* Correct value marker (shown when revealing) */}
          {showCorrect && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-8 rounded-sm bg-white border-2 border-ink z-10"
              style={{ left: `${correctPercent}%`, transform: `translateX(-50%) translateY(-50%)` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          )}
        </div>

        {/* Actual range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={(e) => !disabled && setValue(Number(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: "100%", cursor: disabled ? "default" : "pointer" }}
        />

        {/* Custom thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${thumbPercent}%`, transform: `translateX(-50%) translateY(-50%)` }}
        >
          <div
            className="w-7 h-7 rounded-full border-3 border-ink"
            style={{
              backgroundColor: showCorrect
                ? distance === 0 ? "#10B981" : "#F59E0B"
                : "#E8D27A",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              border: "3px solid #111414",
            }}
          />
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between mt-2">
          <span className="text-text-soft-cream text-sm font-semibold">
            {min}{unit && ` ${unit}`}
          </span>
          <span className="text-text-soft-cream text-sm font-semibold">
            {max}{unit && ` ${unit}`}
          </span>
        </div>
      </div>

      {/* Distance info (when showing results) */}
      {showCorrect && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {distance === 0 ? (
            <span className="text-accent-mint font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
              🎯 Chính xác!
            </span>
          ) : (
            <div>
              <span className="text-accent-yellow font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
                Đáp án: {correctValue}{unit && ` ${unit}`}
              </span>
              <p className="text-text-soft-cream text-sm mt-1">
                Lệch {distance} {unit}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Submit button */}
      {!disabled && !showCorrect && (
        <motion.button
          onClick={handleSubmit}
          className="w-full py-3 rounded-full font-bold text-lg text-white transition-all"
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
    </div>
  );
}
