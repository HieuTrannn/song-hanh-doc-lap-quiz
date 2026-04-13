"use client";

import { motion } from "framer-motion";

interface TimerBarProps {
  timeLeftMs: number;
  totalTimeMs: number;
  score?: number;
}

export function TimerBar({ timeLeftMs, totalTimeMs, score }: TimerBarProps) {
  const progress = totalTimeMs > 0 ? Math.max(0, Math.min(1, timeLeftMs / totalTimeMs)) : 0;
  const seconds = Math.ceil(timeLeftMs / 1000);

  return (
    <div className="w-full">
      <div
        className="relative h-6 rounded-full overflow-hidden border-2 border-ink"
        style={{ background: "#1a1a1a" }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 timer-gradient rounded-full"
          style={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.05, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-end pr-2">
          <span
            className="text-sm font-bold text-text-cream text-outlined-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {score !== undefined ? score : seconds}
          </span>
        </div>
      </div>
    </div>
  );
}
