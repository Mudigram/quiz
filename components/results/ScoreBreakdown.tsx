import { Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { QuizAttempt } from '@/lib/types';
import { formatScore, formatTimeRemaining } from '@/lib/utils';
import { calculateScore } from '@/lib/utils';

interface ScoreBreakdownProps {
  attempt: QuizAttempt;
}

export function ScoreBreakdown({ attempt }: ScoreBreakdownProps) {
  const { accuracyScore, timeBonus } = calculateScore(
    attempt.correct_answers,
    attempt.total_questions,
    attempt.time_taken_seconds
  );

  return (
    <Card className="slide-up">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 mb-2">Quiz Completed!</h2>
        <p className="text-zinc-600">Here's how you performed</p>
      </div>

      <div className="bg-indigo-50 rounded-lg p-6 mb-6 text-center border-2 border-indigo-200">
        <div className="text-sm font-medium text-indigo-600 uppercase tracking-wide mb-2">
          Final Score
        </div>
        <div className="text-5xl font-bold text-indigo-600">{formatScore(attempt.score)}</div>
        <div className="text-sm text-zinc-600 mt-1">points</div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-200">
          <div>
            <div className="font-medium text-zinc-900">Accuracy Score</div>
            <div className="text-sm text-zinc-600">
              {attempt.correct_answers} out of {attempt.total_questions} correct
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{formatScore(accuracyScore)}</div>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-200">
          <div>
            <div className="font-medium text-zinc-900">Time Bonus</div>
            <div className="text-sm text-zinc-600">
              Completed in {formatTimeRemaining(attempt.time_taken_seconds)}
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">+{formatScore(timeBonus)}</div>
        </div>
      </div>
    </Card>
  );
}