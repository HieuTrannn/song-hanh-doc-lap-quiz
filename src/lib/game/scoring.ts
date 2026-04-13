import type { QuestionType, AnswerSubmission } from "@/lib/types";

/**
 * Calculate base score based on time remaining
 */
export function calculateBaseScore(
  timeLeftMs: number,
  totalTimeMs: number,
  maxScore: number = 1000,
  minScore: number = 0
): number {
  const ratio = Math.max(0, timeLeftMs / totalTimeMs);
  return Math.max(minScore, Math.floor(maxScore * ratio));
}

/**
 * Score a Buttons answer (single correct answer)
 */
export function scoreButtons(
  selectedIndex: number,
  correctIndex: number,
  timeLeftMs: number,
  totalTimeMs: number,
  maxScore: number = 1000
): { score: number; isCorrect: boolean } {
  const isCorrect = selectedIndex === correctIndex;
  return {
    score: isCorrect ? calculateBaseScore(timeLeftMs, totalTimeMs, maxScore) : 0,
    isCorrect,
  };
}

/**
 * Score a Checkboxes answer (exact set match)
 */
export function scoreCheckboxes(
  selectedIndexes: number[],
  correctIndexes: number[],
  timeLeftMs: number,
  totalTimeMs: number,
  maxScore: number = 1000
): { score: number; isCorrect: boolean } {
  const sortedSelected = [...selectedIndexes].sort();
  const sortedCorrect = [...correctIndexes].sort();
  const isCorrect =
    sortedSelected.length === sortedCorrect.length &&
    sortedSelected.every((v, i) => v === sortedCorrect[i]);
  return {
    score: isCorrect ? calculateBaseScore(timeLeftMs, totalTimeMs, maxScore) : 0,
    isCorrect,
  };
}

/**
 * Score a Reorder answer (exact order match)
 */
export function scoreReorder(
  submittedOrder: string[],
  correctOrder: string[],
  timeLeftMs: number,
  totalTimeMs: number,
  maxScore: number = 1000
): { score: number; isCorrect: boolean } {
  const isCorrect =
    submittedOrder.length === correctOrder.length &&
    submittedOrder.every((item, i) => item === correctOrder[i]);
  return {
    score: isCorrect ? calculateBaseScore(timeLeftMs, totalTimeMs, maxScore) : 0,
    isCorrect,
  };
}

/**
 * Score a Range answer (accuracy + speed)
 */
export function scoreRange(
  playerValue: number,
  correctValue: number,
  rangeMin: number,
  rangeMax: number,
  timeLeftMs: number,
  totalTimeMs: number,
  maxScore: number = 1000
): { score: number; isCorrect: boolean; distance: number } {
  const distance = Math.abs(playerValue - correctValue);
  const rangeSpan = rangeMax - rangeMin;
  const normalizedDistance = Math.min(distance / rangeSpan, 1);
  const accuracyFactor = 1 - normalizedDistance;
  const timeFactor = Math.max(0, timeLeftMs / totalTimeMs);
  const score = Math.round(maxScore * timeFactor * accuracyFactor);
  const isCorrect = distance === 0;
  return { score, isCorrect, distance };
}

/**
 * Generic scoring dispatcher
 */
export function scoreAnswer(
  type: QuestionType,
  payload: unknown,
  correctData: unknown,
  timeLeftMs: number,
  totalTimeMs: number,
  maxScore: number = 1000
): { score: number; isCorrect: boolean } {
  switch (type) {
    case "buttons": {
      const { selectedIndex } = payload as { selectedIndex: number };
      const { correctIndex } = correctData as { correctIndex: number };
      return scoreButtons(selectedIndex, correctIndex, timeLeftMs, totalTimeMs, maxScore);
    }
    case "checkboxes": {
      const { selectedIndexes } = payload as { selectedIndexes: number[] };
      const { correctIndexes } = correctData as { correctIndexes: number[] };
      return scoreCheckboxes(selectedIndexes, correctIndexes, timeLeftMs, totalTimeMs, maxScore);
    }
    case "reorder": {
      const { submittedOrder } = payload as { submittedOrder: string[] };
      const { correctOrder } = correctData as { correctOrder: string[] };
      return scoreReorder(submittedOrder, correctOrder, timeLeftMs, totalTimeMs, maxScore);
    }
    case "range": {
      const { playerValue } = payload as { playerValue: number };
      const { correctValue, min, max } = correctData as { correctValue: number; min: number; max: number };
      const result = scoreRange(playerValue, correctValue, min, max, timeLeftMs, totalTimeMs, maxScore);
      return { score: result.score, isCorrect: result.isCorrect };
    }
    default:
      return { score: 0, isCorrect: false };
  }
}
