// Calculate quiz score based on accuracy and time
export const calculateScore = (
  correctAnswers: number,
  totalQuestions: number,
  timeTakenSeconds: number,
  maxTimeSeconds: number = 300
): { accuracyScore: number; timeBonus: number; finalScore: number } => {
  const accuracyScore = correctAnswers * 100;
  const timeBonus = Math.max(0, (maxTimeSeconds - timeTakenSeconds) * 2);
  const finalScore = accuracyScore + timeBonus;

  return { accuracyScore, timeBonus, finalScore };
};

// Get correct answers count
export const getCorrectAnswersCount = (
  answers: Record<string, string>,
  questions: Array<{ id: string; correct_option: string }>
): number => {
  return questions.filter((q) => answers[q.id] === q.correct_option).length;
};

// Determine rank badge type
export const getRankBadgeType = (rank: number): 'gold' | 'silver' | 'bronze' | 'default' => {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return 'default';
};

// Get timer color class based on remaining time
export const getTimerColorClass = (seconds: number, maxSeconds: number = 300): string => {
  const percentage = (seconds / maxSeconds) * 100;
  if (percentage > 50) return 'text-green-500';
  if (percentage > 20) return 'text-yellow-500';
  return 'text-red-500';
};

// Class name utility
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Re-export formatters for convenience
export {
  formatTimeRemaining,
  formatScore,
  formatRank,
  formatPercentage,
  formatQuizWeek,
} from './formatters';