'use client';

import { useQuizzes, usePreviousAttempts, useActiveQuiz } from '@/lib/api-hooks';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/Header';
import { QuizCard } from '@/components/dashboard/QuizCard';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function QuizListPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { data: quizzes = [], isLoading } = useQuizzes();
    const { data: previousAttempts = [] } = usePreviousAttempts(user?.id);
    const { data: activeQuiz } = useActiveQuiz();

    // Map attempts to quiz IDs for easy lookup
    const attemptsMap = new Map(previousAttempts.map(a => [a.quiz_id, a]));

    const handleStartQuiz = () => {
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-brand-obsidian">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-mint mx-auto mb-4"></div>
                    <p className="text-brand-black/60 dark:text-brand-white/60">Loading quizzes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-brand-obsidian pb-20 lg:pb-0">
            <Header />

            <main className="container py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">
                            All Quizzes
                        </h1>
                        <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">
                            Explore current and past quizzes
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {quizzes.map((quiz) => {
                            const attempt = attemptsMap.get(quiz.id);
                            const isActive = quiz.id === activeQuiz?.id;

                            // If it's the active quiz, use the main QuizCard component
                            if (isActive) {
                                return (
                                    <div key={quiz.id} className="relative">
                                        <div className="absolute -top-3 -right-3 z-10 bg-brand-mint text-brand-black text-xs font-black uppercase px-3 py-1 -rotate-2 shadow-sm border border-brand-black">
                                            Active Now
                                        </div>
                                        <QuizCard
                                            quiz={quiz}
                                            attempt={attempt || null}
                                            questionCount={10} // Ideally we'd know this from the quiz object or query
                                            onStartQuiz={handleStartQuiz}
                                        />
                                    </div>
                                );
                            }

                            // For past quizzes
                            return (
                                <Card key={quiz.id} className="slide-up">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-2">
                                                {quiz.title}
                                            </h3>
                                            <p className="text-brand-black/60 dark:text-brand-white/60 text-sm mb-4">
                                                Week of {new Date(quiz.week_start_date).toLocaleDateString()}
                                            </p>

                                            {attempt ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-black/5 dark:bg-brand-white/10 rounded-full">
                                                    <span className="text-xs font-bold uppercase text-brand-black/60 dark:text-brand-white/60">
                                                        Score: {attempt.score}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 rounded-full">
                                                    <span className="text-xs font-bold uppercase text-brand-red">
                                                        Missed
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}

                        {quizzes.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-brand-black/40 dark:text-brand-white/40">
                                    No quizzes found.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
