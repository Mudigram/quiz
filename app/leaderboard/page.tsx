'use client';

import { useAuth } from '@/lib/auth-context';
import { useActiveQuiz, useLeaderboard } from '@/lib/api-hooks';
import { Header } from '@/components/Header';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';

export default function LeaderboardPage() {
    const { user } = useAuth();
    const { data: activeQuiz } = useActiveQuiz();
    const { data: leaderboard = [], isLoading } = useLeaderboard(activeQuiz?.id);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-brand-obsidian">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-mint mx-auto mb-4"></div>
                    <p className="text-brand-black/60 dark:text-brand-white/60">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-brand-obsidian pb-20 lg:pb-0">
            <Header />

            <main className="container py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">
                            Leaderboard
                        </h1>
                        {activeQuiz && (
                            <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">
                                {activeQuiz.title}
                            </p>
                        )}
                    </div>

                    {leaderboard.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-brand-black/60 dark:text-brand-white/60">
                                No submissions yet. Be the first to take the quiz!
                            </p>
                        </div>
                    ) : (
                        user && <LeaderboardTable entries={leaderboard} currentUserId={user.id} />
                    )}
                </div>
            </main>
        </div>
    );
}
