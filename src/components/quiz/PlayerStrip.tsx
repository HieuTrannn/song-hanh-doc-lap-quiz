"use client";

import { motion } from "framer-motion";
import type { PlayerState } from "@/lib/types";

interface PlayerStripProps {
  players: PlayerState[];
  lockedPlayerIds: string[];
  currentPlayerId?: string;
}

// Generate avatar color from seed (same as lobby)
function getAvatarColor(seed: string): string {
  const colors = ["#F95985", "#00D188", "#E8D27A", "#C6EA84", "#F48AA0", "#B2F5EA", "#C4B5FD", "#FED7AA"];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

export function PlayerStrip({ players, lockedPlayerIds, currentPlayerId }: PlayerStripProps) {
  const answeredCount = lockedPlayerIds.length;
  const totalCount = players.length;

  return (
    <div className="w-full max-w-5xl mx-auto mt-4">
      {/* Answer count */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span
          className="text-text-cream text-sm font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {answeredCount}/{totalCount} đã trả lời
        </span>
      </div>

      {/* Player avatars */}
      <div className="flex flex-wrap justify-center gap-3">
        {players.map((player) => {
          const hasAnswered = lockedPlayerIds.includes(player.playerId);
          const isMe = player.playerId === currentPlayerId;

          return (
            <motion.div
              key={player.playerId}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Avatar circle */}
              <div className="relative">
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{
                    backgroundColor: getAvatarColor(player.avatarSeed),
                    border: isMe ? "3px solid #fff" : "3px solid #111414",
                    opacity: hasAnswered ? 1 : 0.4,
                    filter: hasAnswered ? "none" : "grayscale(0.5)",
                  }}
                  animate={hasAnswered ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {player.displayName.charAt(0).toUpperCase()}
                </motion.div>

                {/* Answered checkmark */}
                {hasAnswered && (
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                    style={{ border: "2px solid #111414" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}

                {/* Host badge */}
                {player.isHost && (
                  <span className="absolute -top-1 -left-1 text-[10px] bg-accent-yellow rounded-full w-4 h-4 flex items-center justify-center"
                    style={{ border: "1.5px solid #111414" }}
                  >
                    ★
                  </span>
                )}
              </div>

              {/* Name */}
              <p className="text-text-cream text-[10px] mt-1 font-semibold max-w-[56px] truncate text-center">
                {player.displayName}
              </p>

              {/* Score */}
              <p
                className="text-accent-lime text-[10px] font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {player.totalScore.toLocaleString()}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
