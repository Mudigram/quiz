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
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">Previous Attempts</h3>
      <div className="space-y-3">
        {attempts.map((attempt) => (
          <div
            key={attempt.id}
            className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200"
          >
            <div>
              <div className="font-medium text-zinc-900">{attempt.quiz_title}</div>
              <div className="text-sm text-zinc-600">
                {formatQuizWeek(new Date(attempt.quiz_week_start))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-indigo-600">{attempt.score}</div>
              <div className="text-xs text-zinc-600">
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