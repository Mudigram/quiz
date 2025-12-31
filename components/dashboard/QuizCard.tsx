'use client';

import { ArrowRight, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Quiz, QuizAttempt } from '@/lib/types';
import { formatTimeRemaining } from '@/lib/utils';

interface QuizCardProps {
  quiz: Quiz;
  attempt: QuizAttempt | null;
  questionCount: number;
  onStartQuiz: () => void;
}

export function QuizCard({ quiz, attempt, questionCount, onStartQuiz }: QuizCardProps) {
  const hasAttempted = !!attempt;

  return (
    <Card className="slide-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">{quiz.title}</h2>
          <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">{quiz.description}</p>
        </div>
        {hasAttempted ? (
          <Badge variant="silver">Completed</Badge>
        ) : (
          <Badge variant="gold">Active</Badge>
        )}
      </div>

      <div className="flex items-center gap-6 text-sm text-brand-black/60 dark:text-brand-white/60 mb-6 font-bold uppercase tracking-wide">
        <div className="flex items-center gap-2">
          <span className="text-brand-purple">{questionCount}</span>
          <span>Questions</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-magenta" />
          <span>{formatTimeRemaining(quiz.max_time_seconds)} Time Limit</span>
        </div>
      </div>

      {hasAttempted ? (
        <div className="bg-brand-purple/5 dark:bg-brand-white/5 rounded-lg p-4 border border-brand-purple/20">
          <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-2 font-bold uppercase tracking-wider">Your last attempt</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-black text-brand-purple italic tracking-tight">{attempt.score}</span>
              <span className="text-sm text-brand-black/40 dark:text-brand-white/40 ml-2 font-bold uppercase">points</span>
            </div>
            <div className="text-right text-xs text-brand-black/60 dark:text-brand-white/60 font-bold uppercase tracking-widest leading-relaxed">
              <div>
                {attempt.correct_answers} / {attempt.total_questions} correct
              </div>
              <div>{formatTimeRemaining(attempt.time_taken_seconds)}</div>
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="primary"
          onClick={onStartQuiz}
          className="w-full flex items-center justify-center gap-2 py-3"
        >
          Start Quiz
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </Card>
  );
}