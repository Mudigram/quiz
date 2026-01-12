'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { QuizCard } from './dashboard/QuizCard';
import { QuizInterface } from './quiz/QuizInterface';
import { ProjectHero } from './home/ProjectHero';
import { SocialLinks } from './home/SocialLinks';
import { AboutSection } from './home/AboutSection';
import { LearningResources } from './home/LearningResources';
import { CommunityStats } from './home/CommunityStats';
import { useAuth } from '@/lib/auth-context';
import { useActiveQuiz, useQuizQuestions, useUserAttempt, useSubmitQuiz } from '@/lib/api-hooks';
import { useQuizStore } from '@/lib/quiz-store';

type ViewState = 'home' | 'quiz';

export function ActiveQuizHome() {
    const router = useRouter();
    const { user } = useAuth();
    const [viewState, setViewState] = useState<ViewState>('home');
    const resetQuiz = useQuizStore((state) => state.resetQuiz);

    const { data: activeQuiz, isLoading: quizLoading } = useActiveQuiz();
    const { data: questions = [] } = useQuizQuestions(activeQuiz?.id);
    const { data: userAttempt } = useUserAttempt(user?.id, activeQuiz?.id);
    const submitQuiz = useSubmitQuiz();

    const handleStartQuiz = () => {
        resetQuiz();
        setViewState('quiz');
    };

    const handleQuizComplete = useCallback(async (answers: Record<string, string>, timeTaken: number) => {
        if (!user || !activeQuiz) return;

        try {
            await submitQuiz.mutateAsync({
                userId: user.id,
                quizId: activeQuiz.id,
                answers,
                timeTakenSeconds: timeTaken,
                questions,
            });

            router.push('/history');
            resetQuiz();
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
        }
    }, [user, activeQuiz, submitQuiz, questions, router, resetQuiz]);

    if (quizLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-brand-obsidian">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-mint mx-auto mb-4"></div>
                    <p className="text-brand-black/60 dark:text-brand-white/60">Loading...</p>
                </div>
            </div>
        );
    }

    if (viewState === 'quiz' && activeQuiz && questions.length > 0) {
        return (
            <QuizInterface quiz={activeQuiz} questions={questions} onComplete={handleQuizComplete} />
        );
    }

    const safeUserAttempt = userAttempt ?? null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-brand-obsidian pb-20 lg:pb-0">
            <Header />

            <main className="container py-8 space-y-12">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Hero Section */}
                    <ProjectHero />

                    {/* Social Links */}
                    <SocialLinks />

                    {/* Current Week's Quiz */}
                    <div className="space-y-4">
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">
                                This Week's Quiz
                            </h2>
                            <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">
                                Test your knowledge and climb the leaderboard
                            </p>
                        </div>

                        {!activeQuiz ? (
                            <div className="card text-center py-12 border-brand-red/20 bg-brand-red/5">
                                <h2 className="text-2xl font-bold text-brand-red mb-2">No Active Quiz</h2>
                                <p className="text-brand-black/60 dark:text-brand-white/60">
                                    Check back soon for the next weekly quiz!
                                </p>
                            </div>
                        ) : (
                            <QuizCard
                                quiz={activeQuiz}
                                attempt={safeUserAttempt}
                                questionCount={questions.length}
                                onStartQuiz={handleStartQuiz}
                            />
                        )}
                    </div>

                    {/* About Ritual */}
                    <AboutSection />

                    {/* Learning Resources */}
                    <LearningResources />

                    {/* Community Stats */}
                    <CommunityStats />
                </div>
            </main>
        </div>
    );
}
