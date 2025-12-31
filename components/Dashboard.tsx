'use client';

import { useState } from 'react';
import { Header } from './Header';
import { QuizCard } from './dashboard/QuizCard';
import { PreviousAttempts } from './dashboard/PreviousAttempts';
import { QuizInterface } from './quiz/QuizInterface';
import { ResultsScreen } from './ResultsScreen';
import { useAuth } from '@/lib/auth-context';
import { useActiveQuiz, useQuizQuestions, useUserAttempt, usePreviousAttempts, useSubmitQuiz } from '@/lib/api-hooks';
import { useQuizStore } from '@/lib/quiz-store';
import { QuizAttempt } from '@/lib/types';

type ViewState = 'dashboard' | 'quiz' | 'results';

export function Dashboard() {
  const { user } = useAuth();
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(null);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const { data: activeQuiz, isLoading: quizLoading } = useActiveQuiz();
  const { data: questions = [] } = useQuizQuestions(activeQuiz?.id);
  const { data: userAttempt } = useUserAttempt(user?.id, activeQuiz?.id);
  const { data: previousAttempts = [] } = usePreviousAttempts(user?.id);
  const submitQuiz = useSubmitQuiz();

  const handleStartQuiz = () => {
    resetQuiz();
    setViewState('quiz');
  };

  const handleQuizComplete = async (answers: Record<string, string>, timeTaken: number) => {
    if (!user || !activeQuiz) return;

    try {
      const attempt = await submitQuiz.mutateAsync({
        userId: user.id,
        quizId: activeQuiz.id,
        answers,
        timeTakenSeconds: timeTaken,
        questions,
      });

      setCompletedAttempt(attempt);
      setViewState('results');
      resetQuiz();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  const handleBackToDashboard = () => {
    setViewState('dashboard');
    setCompletedAttempt(null);
  };

  if (quizLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-brand-obsidian">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-mint mx-auto mb-4"></div>
          <p className="text-brand-black/60 dark:text-brand-white/60">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (viewState === 'quiz' && activeQuiz && questions.length > 0) {
    return (
      <QuizInterface quiz={activeQuiz} questions={questions} onComplete={handleQuizComplete} />
    );
  }

  if (viewState === 'results' && completedAttempt && activeQuiz) {
    return <ResultsScreen attempt={completedAttempt} quiz={activeQuiz} onBack={handleBackToDashboard} />;
  }

  // Type guard: ensure userAttempt is not undefined for QuizCard
  const safeUserAttempt = userAttempt ?? null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-brand-obsidian">
      <Header />

      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {!activeQuiz ? (
            <div className="card text-center py-12 border-brand-red/20 bg-brand-red/5">
              <h2 className="text-2xl font-bold text-brand-red mb-2">No Active Quiz</h2>
              <p className="text-brand-black/60 dark:text-brand-white/60">Check back soon for the next weekly quiz!</p>
            </div>
          ) : (
            <QuizCard
              quiz={activeQuiz}
              attempt={safeUserAttempt}
              questionCount={questions.length}
              onStartQuiz={handleStartQuiz}
            />
          )}

          <PreviousAttempts attempts={previousAttempts} />
        </div>
      </main>
    </div>
  );
}