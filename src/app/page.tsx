"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { useGameStore } from "@/store/game-store";

export default function HomePage() {
  const router = useRouter();
  const [hostName, setHostName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState<"idle" | "create" | "join">("idle");
  const [error, setError] = useState("");
  const { createRoom } = useGameStore();

  const handleCreate = async () => {
    if (!hostName.trim()) {
      setError("Vui lòng nhập tên hiển thị");
      return;
    }
    try {
      const roomCode = await createRoom(hostName.trim());
      router.push(`/room/${roomCode}/lobby`);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const handleJoin = () => {
    if (!joinCode.trim()) {
      setError("Vui lòng nhập mã phòng");
      return;
    }
    router.push(`/join?code=${joinCode.trim().toUpperCase()}`);
  };

  return (
    <AppShell bg="#19444A" themeIndex={0}>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <h1
            className="text-6xl md:text-8xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-accent-pink">Q</span>
            <span className="text-accent-yellow">U</span>
            <span className="text-accent-lime">I</span>
            <span className="text-accent-coral">Z</span>
          </h1>
          <p
            className="text-text-soft-cream text-lg md:text-xl mt-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            HCM202 — Tư tưởng Hồ Chí Minh
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="w-full max-w-md card-chunky p-8"
          style={{
            backgroundColor: "var(--color-surface-teal)",
          }}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {mode === "idle" && (
            <div className="flex flex-col gap-4">
              {/* Join Game Section */}
              <div className="mb-4">
                <label className="text-text-soft-cream text-sm font-semibold mb-2 block"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Join Game? Enter PIN:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => {
                      setJoinCode(e.target.value.toUpperCase());
                      setError("");
                    }}
                    placeholder="ABC123"
                    maxLength={6}
                    className="flex-1 px-4 py-3 rounded-full text-lg font-bold text-center tracking-widest outline-none"
                    style={{
                      backgroundColor: "var(--color-panel-ivory)",
                      color: "var(--color-ink)",
                      border: "3px solid var(--color-ink)",
                      fontFamily: "var(--font-display)",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  />
                  <motion.button
                    onClick={handleJoin}
                    className="pill-button px-6"
                    style={{
                      backgroundColor: "var(--color-accent-mint)",
                      color: "#fff",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-text-soft-cream text-sm">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Create Room */}
              <motion.button
                onClick={() => setMode("create")}
                className="pill-button w-full py-4 text-xl"
                style={{
                  backgroundColor: "var(--color-accent-lime)",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-display)",
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                🎮 Create Room
              </motion.button>
            </div>
          )}

          {mode === "create" && (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => { setMode("idle"); setError(""); }}
                className="text-text-soft-cream text-sm hover:text-text-cream transition-colors self-start"
              >
                ← Back
              </button>

              <h2
                className="text-2xl font-bold text-text-cream"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Create a Room
              </h2>

              <div>
                <label className="text-text-soft-cream text-sm font-semibold mb-1 block">
                  Your display name
                </label>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => {
                    setHostName(e.target.value);
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
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-accent-pink text-sm font-semibold">{error}</p>
              )}

              <motion.button
                onClick={handleCreate}
                className="pill-button w-full py-4 text-xl"
                style={{
                  backgroundColor: "var(--color-accent-lime)",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-display)",
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Room 🚀
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Quiz info */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-text-soft-cream text-sm">
            17 câu hỏi • 4 dạng: Trắc nghiệm, Chọn nhiều, Sắp xếp, Đoán giá trị
          </p>
          <p className="text-muted-sage text-xs mt-2">
            Same-browser multiplayer • Mở nhiều tab để chơi cùng
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
}
