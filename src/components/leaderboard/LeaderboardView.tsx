"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { LeaderboardEntry } from "@/lib/types";

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  currentPlayerId?: string;
  isFinal?: boolean;
  totalQuestions?: number;
}

// Generate avatar color from seed
function getAvatarColor(seed: string): string {
  const colors = [
    "#F95985", "#00D188", "#E8D27A", "#C6EA84",
    "#F48AA0", "#B2F5EA", "#C4B5FD", "#FED7AA",
    "#A5F3FC", "#FECACA",
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

// Medal emoji for top 3
function getMedal(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
}

export function LeaderboardView({
  entries,
  currentPlayerId,
  isFinal = false,
  totalQuestions,
}: LeaderboardViewProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Title */}
      <motion.h2
        className="text-3xl font-bold text-center mb-6 text-outlined"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text-cream)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isFinal ? "🏆 Final Results" : "📊 Leaderboard"}
      </motion.h2>

      {/* Top 3 Podium (only for final results) */}
      {isFinal && entries.length >= 3 && (
        <div className="flex items-end justify-center gap-3 mb-8">
          {/* 2nd place */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="w-16 h-16 rounded-full border-3 border-ink flex items-center justify-center text-2xl font-bold mb-2"
              style={{
                backgroundColor: getAvatarColor(entries[1].avatarSeed),
                border: "3px solid #111414",
              }}
            >
              {entries[1].displayName.charAt(0).toUpperCase()}
            </div>
            <p className="text-text-cream font-bold text-sm truncate max-w-[100px]">
              {entries[1].displayName}
            </p>
            <p className="text-accent-yellow font-bold text-lg">{entries[1].totalScore}</p>
            <div
              className="w-24 rounded-t-lg flex items-center justify-center"
              style={{
                height: "80px",
                backgroundColor: "rgba(192,192,192,0.3)",
                border: "2px solid rgba(192,192,192,0.4)",
              }}
            >
              <span className="text-3xl">🥈</span>
            </div>
          </motion.div>

          {/* 1st place */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className="w-20 h-20 rounded-full border-3 border-ink flex items-center justify-center text-3xl font-bold mb-2 animate-pulse-scale"
              style={{
                backgroundColor: getAvatarColor(entries[0].avatarSeed),
                border: "4px solid #E8D27A",
                boxShadow: "0 0 20px rgba(232, 210, 122, 0.4)",
              }}
            >
              {entries[0].displayName.charAt(0).toUpperCase()}
            </div>
            <p className="text-text-cream font-bold text-base truncate max-w-[120px]">
              {entries[0].displayName}
            </p>
            <p className="text-accent-lime font-bold text-xl">{entries[0].totalScore}</p>
            <div
              className="w-28 rounded-t-lg flex items-center justify-center"
              style={{
                height: "110px",
                backgroundColor: "rgba(232, 210, 122, 0.3)",
                border: "2px solid rgba(232, 210, 122, 0.4)",
              }}
            >
              <span className="text-4xl">🥇</span>
            </div>
          </motion.div>

          {/* 3rd place */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className="w-14 h-14 rounded-full border-3 border-ink flex items-center justify-center text-xl font-bold mb-2"
              style={{
                backgroundColor: getAvatarColor(entries[2].avatarSeed),
                border: "3px solid #111414",
              }}
            >
              {entries[2].displayName.charAt(0).toUpperCase()}
            </div>
            <p className="text-text-cream font-bold text-sm truncate max-w-[90px]">
              {entries[2].displayName}
            </p>
            <p className="text-accent-yellow font-bold text-lg">{entries[2].totalScore}</p>
            <div
              className="w-20 rounded-t-lg flex items-center justify-center"
              style={{
                height: "60px",
                backgroundColor: "rgba(205, 127, 50, 0.3)",
                border: "2px solid rgba(205, 127, 50, 0.4)",
              }}
            >
              <span className="text-2xl">🥉</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Full ranking list */}
      <div className="flex flex-col gap-2">
        {entries.map((entry, index) => {
          const isCurrentPlayer = entry.playerId === currentPlayerId;
          return (
            <motion.div
              key={entry.playerId}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{
                backgroundColor: isCurrentPlayer
                  ? "rgba(198, 234, 132, 0.15)"
                  : "rgba(255,255,255,0.06)",
                border: isCurrentPlayer
                  ? "2px solid rgba(198, 234, 132, 0.3)"
                  : "2px solid transparent",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Rank */}
              <span
                className="w-8 text-center font-bold text-lg"
                style={{
                  fontFamily: "var(--font-display)",
                  color: entry.rank <= 3 ? "#E8D27A" : "var(--color-text-soft-cream)",
                }}
              >
                {getMedal(entry.rank) || `#${entry.rank}`}
              </span>

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-ink flex-shrink-0"
                style={{
                  backgroundColor: getAvatarColor(entry.avatarSeed),
                  border: "2px solid #111414",
                }}
              >
                {entry.displayName.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-text-cream font-semibold text-sm truncate">
                  {entry.displayName}
                  {entry.isHost && (
                    <span className="ml-2 text-xs bg-accent-yellow/20 text-accent-yellow px-2 py-0.5 rounded-full">
                      HOST
                    </span>
                  )}
                </p>
                <p className="text-text-soft-cream text-xs">
                  {entry.totalCorrect}{totalQuestions ? `/${totalQuestions}` : ""} correct
                </p>
              </div>

              {/* Score */}
              <motion.span
                className="font-bold text-lg"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-accent-lime)",
                }}
                key={entry.totalScore}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {entry.totalScore}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
