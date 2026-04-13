"use client";

import { create } from "zustand";
import type {
  RoomSnapshot,
  QuizQuestion,
  LeaderboardEntry,
  AnswerSubmission,
  QuestionRuntimeState,
} from "@/lib/types";
import { getServerRoomAdapter } from "@/lib/adapters/server-room-adapter";
import { scoreAnswer } from "@/lib/game/scoring";
import { hcm202Quiz } from "@/data/quizzes/hcm202";

// ─── Game Phase (local UI state) ───
export type GamePhase =
  | "idle"
  | "lobby"
  | "countdown"
  | "question_active"
  | "question_locked"
  | "result_reveal"
  | "leaderboard_transition"
  | "final_results";

// ─── Store State ───
interface GameState {
  // Room
  roomSnapshot: RoomSnapshot | null;
  currentPlayerId: string | null;
  
  // Game phase
  phase: GamePhase;
  
  // Timer
  timeLeftMs: number;
  totalTimeMs: number;
  timerInterval: ReturnType<typeof setInterval> | null;
  
  // Current question
  currentQuestion: QuizQuestion | null;
  
  // Player's answer state
  selectedAnswer: unknown | null;
  answerSubmitted: boolean;
  lastScore: number;
  lastIsCorrect: boolean;
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];

  // Unsubscribe function
  unsubscribe: (() => void) | null;

  // ─── Actions ───
  createRoom: (hostName: string) => Promise<string>;
  joinRoom: (roomCode: string, displayName: string) => Promise<void>;
  startGame: () => Promise<void>;
  nextQuestion: () => Promise<void>;
  submitAnswer: (payload: unknown) => Promise<void>;
  setPhase: (phase: GamePhase) => void;
  updateTimer: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  showResult: () => void;
  showLeaderboard: () => void;
  goToFinalResults: () => void;
  syncSnapshot: (snapshot: RoomSnapshot) => void;
  subscribeToRoom: (roomCode: string) => void;
  cleanup: () => void;
  getCurrentQuestion: () => QuizQuestion | null;
  getQuizQuestions: () => QuizQuestion[];
  calculateLeaderboard: () => LeaderboardEntry[];
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  roomSnapshot: null,
  currentPlayerId: null,
  phase: "idle",
  timeLeftMs: 0,
  totalTimeMs: 0,
  timerInterval: null,
  currentQuestion: null,
  selectedAnswer: null,
  answerSubmitted: false,
  lastScore: 0,
  lastIsCorrect: false,
  leaderboard: [],
  unsubscribe: null,

  // ─── Get quiz questions ───
  getQuizQuestions: () => {
    return hcm202Quiz.questions;
  },

  // ─── Get current question ───
  getCurrentQuestion: () => {
    const { roomSnapshot } = get();
    if (!roomSnapshot) return null;
    const questions = hcm202Quiz.questions;
    const idx = roomSnapshot.currentQuestionIndex;
    return idx < questions.length ? questions[idx] : null;
  },

  // ─── Create room ───
  createRoom: async (hostName: string) => {
    const adapter = getServerRoomAdapter();
    const { snapshot, playerId } = await adapter.createRoom({
      hostName,
      quizSetId: hcm202Quiz.id,
    });

    // Store player ID in sessionStorage for page reloads
    sessionStorage.setItem("quiz_clone.currentPlayerId", playerId);
    sessionStorage.setItem("quiz_clone.currentRoomCode", snapshot.roomCode);

    set({
      roomSnapshot: snapshot,
      currentPlayerId: playerId,
      phase: "lobby",
    });

    get().subscribeToRoom(snapshot.roomCode);
    return snapshot.roomCode;
  },

  // ─── Join room ───
  joinRoom: async (roomCode: string, displayName: string) => {
    const adapter = getServerRoomAdapter();
    const { snapshot, playerId } = await adapter.joinRoom(roomCode, { displayName });

    // Store player ID in sessionStorage for page reloads
    sessionStorage.setItem("quiz_clone.currentPlayerId", playerId);
    sessionStorage.setItem("quiz_clone.currentRoomCode", roomCode);

    set({
      roomSnapshot: snapshot,
      currentPlayerId: playerId,
      phase: "lobby",
    });

    get().subscribeToRoom(roomCode);
  },

  // ─── Subscribe to room updates ───
  subscribeToRoom: (roomCode: string) => {
    const { unsubscribe: oldUnsub } = get();
    if (oldUnsub) oldUnsub();

    const adapter = getServerRoomAdapter();
    const unsub = adapter.subscribe(roomCode, (snapshot) => {
      get().syncSnapshot(snapshot);
    });

    set({ unsubscribe: unsub });
  },

  // ─── Sync snapshot from server polling ───
  syncSnapshot: (snapshot: RoomSnapshot) => {
    const { phase, currentPlayerId } = get();
    
    set({ roomSnapshot: snapshot });

    // Update phase based on room status
    if (snapshot.status === "lobby" && phase !== "lobby") {
      set({ phase: "lobby" });
    }
    if (snapshot.status === "countdown" && phase !== "countdown") {
      set({ phase: "countdown" });
    }
    if (snapshot.status === "question") {
      const question = get().getCurrentQuestion();
      if (question && phase !== "question_active" && phase !== "question_locked" && phase !== "result_reveal") {
        set({
          currentQuestion: question,
          phase: "question_active",
          selectedAnswer: null,
          answerSubmitted: false,
        });
        // Start timer for all players based on server timestamps
        if (snapshot.questionState) {
          const totalMs = snapshot.questionState.endsAt - snapshot.questionState.startedAt;
          const leftMs = Math.max(0, snapshot.questionState.endsAt - Date.now());
          set({ totalTimeMs: totalMs, timeLeftMs: leftMs });
          get().startTimer();
        }
      }
      // Check if this player already answered
      if (snapshot.questionState?.lockedPlayers.includes(currentPlayerId || "")) {
        if (phase === "question_active") {
          set({ answerSubmitted: true, phase: "question_locked" });
        }
      }
    }
    if (snapshot.status === "result") {
      if (phase !== "result_reveal" && phase !== "leaderboard_transition") {
        get().stopTimer();
        set({ phase: "result_reveal" });
      }
    }
    if (snapshot.status === "finished") {
      get().stopTimer();
      set({
        phase: "final_results",
        leaderboard: get().calculateLeaderboard(),
      });
    }
  },

  // ─── Start game (host only) ───
  startGame: async () => {
    const { roomSnapshot, currentPlayerId } = get();
    if (!roomSnapshot) return;
    if (roomSnapshot.hostPlayerId !== currentPlayerId) return;

    const adapter = getServerRoomAdapter();

    // Countdown phase
    set({ phase: "countdown" });
    roomSnapshot.status = "countdown";
    await adapter.saveRoom(roomSnapshot);

    // Wait 3 seconds for countdown
    await new Promise((r) => setTimeout(r, 3000));

    // Start first question
    await get().nextQuestion();
  },

  // ─── Move to next question ───
  nextQuestion: async () => {
    const { roomSnapshot, currentPlayerId } = get();
    if (!roomSnapshot) return;
    if (roomSnapshot.hostPlayerId !== currentPlayerId) return;

    const adapter = getServerRoomAdapter();
    const questions = hcm202Quiz.questions;
    const idx = roomSnapshot.currentQuestionIndex;

    if (idx >= questions.length) {
      // Game over
      roomSnapshot.status = "finished";
      roomSnapshot.leaderboard = get().calculateLeaderboard();
      await adapter.saveRoom(roomSnapshot);
      set({
        phase: "final_results",
        leaderboard: roomSnapshot.leaderboard,
      });
      return;
    }

    const question = questions[idx];
    const now = Date.now();
    const durationMs = question.durationSec * 1000;

    const questionState: QuestionRuntimeState = {
      questionId: question.id,
      startedAt: now,
      endsAt: now + durationMs,
      revealProgress: 0,
      lockedPlayers: [],
      answerLog: [],
    };

    roomSnapshot.status = "question";
    roomSnapshot.questionState = questionState;
    await adapter.saveRoom(roomSnapshot);

    set({
      roomSnapshot: { ...roomSnapshot },
      currentQuestion: question,
      phase: "question_active",
      selectedAnswer: null,
      answerSubmitted: false,
      timeLeftMs: durationMs,
      totalTimeMs: durationMs,
      lastScore: 0,
      lastIsCorrect: false,
    });

    get().startTimer();
  },

  // ─── Submit answer ───
  submitAnswer: async (payload: unknown) => {
    const { roomSnapshot, currentPlayerId, currentQuestion, timeLeftMs, totalTimeMs, answerSubmitted } = get();
    if (!roomSnapshot || !currentPlayerId || !currentQuestion || answerSubmitted) return;

    // Calculate score
    let correctData: unknown;
    switch (currentQuestion.type) {
      case "buttons":
        correctData = { correctIndex: currentQuestion.buttons!.correctIndex };
        break;
      case "checkboxes":
        correctData = { correctIndexes: currentQuestion.checkboxes!.correctIndexes };
        break;
      case "reorder":
        correctData = { correctOrder: currentQuestion.reorder!.correctOrder };
        break;
      case "range":
        correctData = {
          correctValue: currentQuestion.range!.correctValue,
          min: currentQuestion.range!.min,
          max: currentQuestion.range!.max,
        };
        break;
    }

    const { score, isCorrect } = scoreAnswer(
      currentQuestion.type,
      payload,
      correctData,
      timeLeftMs,
      totalTimeMs,
      currentQuestion.maxScore
    );

    const submission: AnswerSubmission = {
      playerId: currentPlayerId,
      submittedAt: Date.now(),
      payload,
      scoreAwarded: score,
      isCorrect,
    };

    const adapter = getServerRoomAdapter();
    const updatedSnapshot = await adapter.submitAnswer(roomSnapshot.roomCode, submission);

    set({
      roomSnapshot: updatedSnapshot,
      answerSubmitted: true,
      selectedAnswer: payload,
      lastScore: score,
      lastIsCorrect: isCorrect,
      phase: "question_locked",
    });
  },

  // ─── Timer ───
  startTimer: () => {
    const { timerInterval } = get();
    if (timerInterval) clearInterval(timerInterval);

    const interval = setInterval(() => {
      get().updateTimer();
    }, 50);

    set({ timerInterval: interval });
  },

  updateTimer: () => {
    const { roomSnapshot, currentPlayerId } = get();
    if (!roomSnapshot?.questionState) return;

    const newTimeLeft = Math.max(0, roomSnapshot.questionState.endsAt - Date.now());
    set({ timeLeftMs: newTimeLeft });

    // Time's up
    if (newTimeLeft <= 0) {
      get().stopTimer();
      
      // Host transitions to result after brief delay
      const isHost = roomSnapshot.hostPlayerId === currentPlayerId;
      if (isHost) {
        setTimeout(() => get().showResult(), 500);
      }
    }
  },

  stopTimer: () => {
    const { timerInterval } = get();
    if (timerInterval) {
      clearInterval(timerInterval);
      set({ timerInterval: null });
    }
  },

  // ─── Show result (host only) ───
  showResult: async () => {
    const { roomSnapshot, currentPlayerId } = get();
    if (!roomSnapshot) return;
    if (roomSnapshot.hostPlayerId !== currentPlayerId) return;

    const adapter = getServerRoomAdapter();
    roomSnapshot.status = "result";
    roomSnapshot.leaderboard = get().calculateLeaderboard();
    await adapter.saveRoom(roomSnapshot);

    set({
      roomSnapshot: { ...roomSnapshot },
      phase: "result_reveal",
      leaderboard: roomSnapshot.leaderboard,
    });

    // After 4 seconds, move to next question or final
    setTimeout(() => {
      get().showLeaderboard();
    }, 4000);
  },

  // ─── Show leaderboard transition ───
  showLeaderboard: async () => {
    const { roomSnapshot, currentPlayerId } = get();
    if (!roomSnapshot) return;
    if (roomSnapshot.hostPlayerId !== currentPlayerId) return;

    set({ phase: "leaderboard_transition" });

    // After 3 seconds, go to next question
    setTimeout(async () => {
      const { roomSnapshot: snap } = get();
      if (!snap) return;

      snap.currentQuestionIndex += 1;
      const adapter = getServerRoomAdapter();
      
      if (snap.currentQuestionIndex >= hcm202Quiz.questions.length) {
        get().goToFinalResults();
      } else {
        await adapter.saveRoom(snap);
        set({ roomSnapshot: { ...snap } });
        await get().nextQuestion();
      }
    }, 3000);
  },

  // ─── Final results ───
  goToFinalResults: async () => {
    const { roomSnapshot } = get();
    if (!roomSnapshot) return;

    const adapter = getServerRoomAdapter();
    roomSnapshot.status = "finished";
    roomSnapshot.leaderboard = get().calculateLeaderboard();
    await adapter.saveRoom(roomSnapshot);

    set({
      roomSnapshot: { ...roomSnapshot },
      phase: "final_results",
      leaderboard: roomSnapshot.leaderboard,
    });
  },

  // ─── Set phase ───
  setPhase: (phase: GamePhase) => set({ phase }),

  // ─── Calculate leaderboard ───
  calculateLeaderboard: (): LeaderboardEntry[] => {
    const { roomSnapshot } = get();
    if (!roomSnapshot) return [];

    const entries: LeaderboardEntry[] = roomSnapshot.players
      .map((p) => ({
        playerId: p.playerId,
        displayName: p.displayName,
        avatarSeed: p.avatarSeed,
        totalScore: p.totalScore,
        totalCorrect: p.totalCorrect,
        avgResponseMs: p.avgResponseMs,
        rank: 0,
        isHost: p.isHost,
      }))
      .sort((a, b) => {
        // Sort by score DESC
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        // Tie-break: totalCorrect DESC
        if (b.totalCorrect !== a.totalCorrect) return b.totalCorrect - a.totalCorrect;
        // Tie-break: avgResponseMs ASC
        const aMs = a.avgResponseMs ?? Infinity;
        const bMs = b.avgResponseMs ?? Infinity;
        return aMs - bMs;
      });

    entries.forEach((e, i) => {
      e.rank = i + 1;
    });

    return entries;
  },

  // ─── Cleanup ───
  cleanup: () => {
    const { timerInterval, unsubscribe } = get();
    if (timerInterval) clearInterval(timerInterval);
    if (unsubscribe) unsubscribe();
    set({
      roomSnapshot: null,
      currentPlayerId: null,
      phase: "idle",
      timeLeftMs: 0,
      totalTimeMs: 0,
      timerInterval: null,
      currentQuestion: null,
      selectedAnswer: null,
      answerSubmitted: false,
      lastScore: 0,
      lastIsCorrect: false,
      leaderboard: [],
      unsubscribe: null,
    });
  },
}));
