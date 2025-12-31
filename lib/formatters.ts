// Time formatting
export const formatTimeRemaining = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Score formatting
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

// Rank formatting
export const formatRank = (rank: number): string => {
  const suffix = rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th';
  return `${rank}${suffix}`;
};

// Percentage formatting
export const formatPercentage = (value: number, total: number): string => {
  return `${Math.round((value / total) * 100)}%`;
};

// Date formatting for quiz week
export const formatQuizWeek = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};