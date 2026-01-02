'use client';

import { useEffect } from 'react';
import { Question, Quiz } from '@/lib/types';
import { useQuizStore } from '@/lib/quiz-store';
import { Timer } from '../Timer';
import { QuizQuestion } from './QuizQuestion';
import { QuizProgress } from './QuizProgress';

interface QuizInterfaceProps {
  quiz: Quiz;
  questions: Question[];
  onComplete: (answers: Record<string, string>, timeTaken: number) => void;
}

export function QuizInterface({ quiz, questions, onComplete }: QuizInterfaceProps) {
  const {
    currentQuestionIndex,
    answers,
    startTime,
    timeRemaining,
    startQuiz,
    updateTimeRemaining,
  } = useQuizStore();

  useEffect(() => {
    if (!startTime) {
      startQuiz(quiz.max_time_seconds);
    }
  }, [startTime, quiz.max_time_seconds, startQuiz]);

  useEffect(() => {
    if (!startTime || timeRemaining <= 0) {
      if (timeRemaining <= 0 && startTime) {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        onComplete(answers, timeTaken);
      }
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, quiz.max_time_seconds - elapsed);
      updateTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, timeRemaining, quiz.max_time_seconds, updateTimeRemaining, answers, onComplete]);

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-brand-obsidian flex flex-col">
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-10 dark:bg-brand-obsidian">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <QuizProgress current={currentQuestionIndex + 1} total={questions.length} />
            <Timer seconds={timeRemaining} maxSeconds={quiz.max_time_seconds} />
          </div>
        </div>
      </div>

      <div className="flex-1 container py-8 dark:bg-brand-obsidian">
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQuestion.id]}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
}