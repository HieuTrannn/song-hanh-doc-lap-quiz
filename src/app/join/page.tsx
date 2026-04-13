"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { useGameStore } from "@/store/game-store";

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledCode = searchParams.get("code") || "";

  const [roomCode, setRoomCode] = useState(prefilledCode);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { joinRoom } = useGameStore();

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      setError("Vui lòng nhập mã phòng");
      return;
    }
    if (!displayName.trim()) {
      setError("Vui lòng nhập tên hiển thị");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await joinRoom(roomCode.trim().toUpperCase(), displayName.trim());
      router.push(`/room/${roomCode.trim().toUpperCase()}/lobby`);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell bg="#19444A" themeIndex={0}>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.h1
          className="text-4xl font-bold mb-8"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-accent-pink">Q</span>
          <span className="text-accent-yellow">U</span>
          <span className="text-accent-lime">I</span>
          <span className="text-accent-coral">Z</span>
          <span className="text-text-cream">.party</span>
        </motion.h1>

        <motion.div
          className="w-full max-w-sm card-chunky p-8"
          style={{ backgroundColor: "var(--color-surface-teal)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2
            className="text-2xl font-bold text-text-cream mb-6 text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Join Game
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-text-soft-cream text-sm font-semibold mb-1 block">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="ABC123"
                maxLength={6}
                className="w-full px-4 py-3 rounded-2xl text-xl font-bold text-center tracking-widest outline-none"
                style={{
                  backgroundColor: "var(--color-panel-ivory)",
                  color: "var(--color-ink)",
                  border: "3px solid var(--color-ink)",
                  fontFamily: "var(--font-display)",
                }}
                autoFocus
              />
            </div>

            <div>
              <label className="text-text-soft-cream text-sm font-semibold mb-1 block">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setError("");
                }}
                placeholder="Enter your name"
                maxLength={20}
                className="w-full px-4 py-3 rounded-2xl text-lg font-semibold outline-none"
                style={{
                  backgroundColor: "var(--color-panel-ivory)",
                  color: "var(--color-ink)",
                  border: "3px solid var(--color-ink)",
                  fontFamily: "var(--font-body)",
                }}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
            </div>

            {error && (
              <motion.p
                className="text-accent-pink text-sm font-semibold text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              onClick={handleJoin}
              disabled={loading}
              className="pill-button w-full py-4 text-xl mt-2"
              style={{
                backgroundColor: "var(--color-accent-mint)",
                color: "#fff",
                fontFamily: "var(--font-display)",
                opacity: loading ? 0.7 : 1,
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Joining..." : "Join Room 🎉"}
            </motion.button>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-4 text-text-soft-cream text-sm hover:text-text-cream transition-colors block text-center w-full"
          >
            ← Back to home
          </button>
        </motion.div>
      </div>
    </AppShell>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <AppShell bg="#19444A">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-cream">Loading...</p>
        </div>
      </AppShell>
    }>
      <JoinForm />
    </Suspense>
  );
}
