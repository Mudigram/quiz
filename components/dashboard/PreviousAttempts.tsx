'use client';

import { Card } from '../ui/Card';
import { PastAttempt } from '@/lib/types';
import { formatQuizWeek, formatTimeRemaining } from '@/lib/utils';

interface PreviousAttemptsProps {
  attempts: PastAttempt[];
}

export function PreviousAttempts({ attempts }: PreviousAttemptsProps) {
  if (attempts.length === 0) return null;

  return (
    <Card className="slide-up">
      <h3 className="text-lg font-black text-brand-black dark:text-brand-white mb-4 uppercase italic tracking-tighter">Previous Attempts</h3>
      <div className="space-y-3">
        {attempts.map((attempt) => (
          <div
            key={attempt.id}
            className="flex items-center justify-between p-3 bg-brand-purple/5 dark:bg-brand-white/5 rounded-lg border border-brand-purple/20 dark:border-zinc-800"
          >
            <div>
              <div className="font-bold text-brand-black dark:text-brand-white uppercase tracking-tight">{attempt.quiz_title}</div>
              <div className="text-sm text-brand-black/60 dark:text-brand-white/60 font-medium">
                {formatQuizWeek(new Date(attempt.quiz_week_start))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-brand-purple italic tracking-tight">{attempt.score}</div>
              <div className="text-xs text-brand-black/60 dark:text-brand-white/60 font-bold">
                {attempt.correct_answers}/{attempt.total_questions} •{' '}
                {formatTimeRemaining(attempt.time_taken_seconds)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}