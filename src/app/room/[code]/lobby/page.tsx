"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { TopStrip } from "@/components/shell/TopStrip";
import { useGameStore } from "@/store/game-store";
import { hcm202Quiz } from "@/data/quizzes/hcm202";
import { QRCodeSVG } from "qrcode.react";

// Generate avatar color from seed
function getAvatarColor(seed: string): string {
  const colors = ["#F95985", "#00D188", "#E8D27A", "#C6EA84", "#F48AA0", "#B2F5EA", "#C4B5FD", "#FED7AA"];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params.code as string).toUpperCase();
  const {
    roomSnapshot,
    currentPlayerId,
    phase,
    startGame,
    subscribeToRoom,
  } = useGameStore();

  const [mounted, setMounted] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");

  useEffect(() => {
    setMounted(true);
    setJoinUrl(`${window.location.origin}/join?code=${roomCode}`);
    // If we don't have a snapshot, try to load from adapter
    if (!roomSnapshot || roomSnapshot.roomCode !== roomCode) {
      const playerId = sessionStorage.getItem("quiz_clone.currentPlayerId");
      if (playerId) {
        useGameStore.setState({ currentPlayerId: playerId });
      }
      // Subscribe to room
      subscribeToRoom(roomCode);

      // Try loading room
      import("@/lib/adapters/server-room-adapter").then(({ getServerRoomAdapter }) => {
        const adapter = getServerRoomAdapter();
        adapter.getRoom(roomCode).then((snap) => {
          if (snap) {
            useGameStore.setState({ roomSnapshot: snap, phase: "lobby" });
          }
        });
      });
    }
  }, [roomCode]);

  // Watch for game start
  useEffect(() => {
    if (roomSnapshot?.status === "question" || roomSnapshot?.status === "countdown") {
      router.push(`/room/${roomCode}/play`);
    }
  }, [roomSnapshot?.status, roomCode, router]);

  const isHost = roomSnapshot?.hostPlayerId === currentPlayerId;
  const players = roomSnapshot?.players || [];

  const handleStart = async () => {
    await startGame();
    router.push(`/room/${roomCode}/play`);
  };

  if (!mounted) return null;

  return (
    <AppShell bg="#19444A" themeIndex={0}>
      <TopStrip
        roomCode={roomCode}
        playerCount={players.length}
        onFullscreen={() => document.documentElement.requestFullscreen?.()}
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 items-start justify-center">
        {/* Left panel - Room info */}
        <motion.div
          className="w-full lg:w-1/2 max-w-lg card-chunky p-8"
          style={{ backgroundColor: "var(--color-surface-teal)" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Join info */}
          <div className="text-center mb-6">
            <p className="text-text-soft-cream text-sm mb-1">Join at:</p>
            <h2
              className="text-2xl font-bold text-text-cream mb-1 flex items-center justify-center gap-1.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-accent-pink">Song</span>
              <span className="text-accent-yellow">Hành</span>
              <span className="text-accent-lime">Độc</span>
              <span className="text-accent-coral">Lập</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
              {joinUrl && (
                <div className="p-2 bg-white rounded-xl shadow-lg" style={{ border: "3px solid var(--color-ink)", boxShadow: "var(--shadow-chunky)" }}>
                  <QRCodeSVG value={joinUrl} size={110} bgColor="#ffffff" fgColor="#111414" />
                </div>
              )}
              <div className="flex flex-col items-center sm:items-start">
                <p className="text-text-soft-cream text-sm mb-1">...hoặc nhập PIN:</p>
                <p
                  className="text-5xl md:text-6xl font-bold text-accent-lime tracking-wider"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {roomCode.slice(0, 3)} {roomCode.slice(3)}
                </p>
              </div>
            </div>
          </div>

          {/* Player count */}
          <p
            className="text-center text-xl font-bold text-text-cream mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {players.length === 0 ? "Waiting for players" : `${players.length} of 300 players:`}
          </p>

          {/* Player list */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {players.map((player) => (
              <motion.div
                key={player.playerId}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold relative"
                  style={{
                    backgroundColor: getAvatarColor(player.avatarSeed),
                    border: "3px solid #111414",
                  }}
                >
                  {player.displayName.charAt(0).toUpperCase()}
                  {player.isHost && (
                    <span className="absolute -bottom-1 -right-1 text-xs bg-accent-mint rounded-full w-5 h-5 flex items-center justify-center border border-ink">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-text-cream text-xs mt-1 font-semibold max-w-[60px] truncate text-center">
                  {player.displayName}
                </p>
                {player.isHost && (
                  <span className="text-[10px] text-accent-yellow font-bold">HOST</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Join link for other tabs */}
          {!isHost && (
            <p className="text-center text-text-soft-cream text-sm mb-4">
              ⏳ Waiting for host to start...
            </p>
          )}

          {/* Start button (host only) */}
          {isHost && (
            <motion.button
              onClick={handleStart}
              className="pill-button w-full py-4 text-xl"
              style={{
                backgroundColor: "#C6EA84",
                color: "var(--color-ink)",
                fontFamily: "var(--font-display)",
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start game
            </motion.button>
          )}
        </motion.div>

        {/* Right panel - Quiz info */}
        <motion.div
          className="w-full lg:w-80 card-chunky p-6"
          style={{ backgroundColor: "var(--color-surface-teal)" }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3
            className="text-xl font-bold text-text-cream mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {hcm202Quiz.title}
          </h3>
          <p className="text-text-soft-cream text-sm mb-4">
            {hcm202Quiz.questions.length} slides
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-answer-green/20 text-answer-green font-semibold">
              Buttons
            </span>
            <span className="px-3 py-1 rounded-full bg-answer-yellow/20 text-answer-yellow font-semibold">
              Checkboxes
            </span>
            <span className="px-3 py-1 rounded-full bg-answer-orange/20 text-answer-orange font-semibold">
              Reorder
            </span>
            <span className="px-3 py-1 rounded-full bg-answer-pink/20 text-answer-pink font-semibold">
              Range
            </span>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
