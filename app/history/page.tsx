'use client';

import { useAuth } from '@/lib/auth-context';
import { usePreviousAttempts } from '@/lib/api-hooks';
import { Header } from '@/components/Header';
import { PreviousAttempts } from '@/components/dashboard/PreviousAttempts';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HistoryPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { data: previousAttempts = [], isLoading } = usePreviousAttempts(user?.id);

    // Redirect to home if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    // Show loading while checking auth
    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-brand-obsidian">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-mint mx-auto mb-4"></div>
                    <p className="text-brand-black/60 dark:text-brand-white/60">Loading...</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-brand-obsidian">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-mint mx-auto mb-4"></div>
                    <p className="text-brand-black/60 dark:text-brand-white/60">Loading history...</p>
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
                            Quiz History
                        </h1>
                        <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">
                            Your past quiz attempts and scores
                        </p>
                    </div>

                    <PreviousAttempts attempts={previousAttempts} />
                </div>
            </main>
        </div>
    );
}
