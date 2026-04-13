/* ========================================
   Core Types for Quiz Clone
   ======================================== */

// ─── Question Types ───
export type QuestionType = "buttons" | "checkboxes" | "reorder" | "range";

export type MediaRevealMode =
  | "none"
  | "random-squares"
  | "sequential-squares"
  | "time-lapse"
  | "blur-reveal";

export type QuizQuestion = {
  id: string;
  type: QuestionType;
  prompt: string;
  description?: string;
  imageUrl?: string;
  revealMode?: MediaRevealMode;
  revealTiles?: 12 | 24 | 48;
  durationSec: number;
  maxScore: number;
  minScore?: number;
  explanation?: string;
  buttons?: {
    options: string[];
    correctIndex: number;
  };
  checkboxes?: {
    options: string[];
    correctIndexes: number[];
  };
  reorder?: {
    items: string[];
    correctOrder: string[];
  };
  range?: {
    min: number;
    max: number;
    correctValue: number;
    unit?: string;
    step?: number;
  };
};

export type QuizSet = {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  questions: QuizQuestion[];
  createdAt: number;
};

// ─── Room & Player Types ───
export type RoomStatus = "lobby" | "countdown" | "question" | "result" | "finished";

export type RoomSnapshot = {
  roomCode: string;
  hostPlayerId: string;
  status: RoomStatus;
  currentQuestionIndex: number;
  quizSetId: string;
  players: PlayerState[];
  leaderboard: LeaderboardEntry[];
  questionState?: QuestionRuntimeState;
  updatedAt: number;
};

export type PlayerState = {
  playerId: string;
  displayName: string;
  avatarSeed: string;
  joinedAt: number;
  isHost: boolean;
  totalScore: number;
  totalCorrect: number;
  avgResponseMs: number | null;
  lastSeenAt: number;
};

export type QuestionRuntimeState = {
  questionId: string;
  startedAt: number;
  endsAt: number;
  revealProgress: number;
  lockedPlayers: string[];
  answerLog: AnswerSubmission[];
};

export type AnswerSubmission = {
  playerId: string;
  submittedAt: number;
  payload: unknown;
  scoreAwarded: number;
  isCorrect: boolean;
};

export type LeaderboardEntry = {
  playerId: string;
  displayName: string;
  avatarSeed: string;
  totalScore: number;
  totalCorrect: number;
  avgResponseMs: number | null;
  rank: number;
  isHost: boolean;
  previousRank?: number;
};

// ─── Room Adapter Interface ───
export type CreateRoomInput = {
  hostName: string;
  quizSetId: string;
};

export type JoinPlayerInput = {
  displayName: string;
  avatarSeed?: string;
};

export interface RoomAdapter {
  createRoom(input: CreateRoomInput): Promise<RoomSnapshot>;
  joinRoom(roomCode: string, player: JoinPlayerInput): Promise<RoomSnapshot>;
  getRoom(roomCode: string): Promise<RoomSnapshot | null>;
  saveRoom(snapshot: RoomSnapshot): Promise<void>;
  submitAnswer(roomCode: string, answer: AnswerSubmission): Promise<RoomSnapshot>;
  leaveRoom(roomCode: string, playerId: string): Promise<void>;
  subscribe(roomCode: string, onChange: (snapshot: RoomSnapshot) => void): () => void;
}

// ─── Slide Background Theme ───
export type SlideTheme = {
  bg: string;
  decoColor: string;
};

export const SLIDE_THEMES: SlideTheme[] = [
  { bg: "#2D5A5E", decoColor: "rgba(0,0,0,0.08)" },  // teal
  { bg: "#4A5568", decoColor: "rgba(0,0,0,0.08)" },  // slate blue
  { bg: "#7B6170", decoColor: "rgba(0,0,0,0.08)" },  // mauve
  { bg: "#5B5278", decoColor: "rgba(0,0,0,0.08)" },  // purple
  { bg: "#8B7355", decoColor: "rgba(0,0,0,0.08)" },  // brown
  { bg: "#5B6D52", decoColor: "rgba(0,0,0,0.08)" },  // olive
  { bg: "#4A6572", decoColor: "rgba(0,0,0,0.08)" },  // steel
  { bg: "#6B5B50", decoColor: "rgba(0,0,0,0.08)" },  // warm gray
];

// ─── Answer Button Colors ───
export const ANSWER_COLORS = [
  { bg: "#B2F5EA", text: "#111414", border: "#111414" },  // mint green
  { bg: "#D9F99D", text: "#111414", border: "#111414" },  // lime yellow
  { bg: "#FED7AA", text: "#111414", border: "#111414" },  // peach orange
  { bg: "#FECACA", text: "#111414", border: "#111414" },  // soft pink
  { bg: "#C4B5FD", text: "#111414", border: "#111414" },  // lavender
  { bg: "#A5F3FC", text: "#111414", border: "#111414" },  // sky
];
