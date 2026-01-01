'use client';

import { useAuth } from '@/lib/auth-context';
import { usePreviousAttempts } from '@/lib/api-hooks';
import { Header } from '@/components/Header';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trophy, Clock, Target, TrendingUp } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();
    const { data: previousAttempts = [] } = usePreviousAttempts(user?.id);

    if (!user) {
        return null;
    }

    // Calculate stats
    const totalQuizzes = previousAttempts.length;
    const totalScore = previousAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const averageScore = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;
    const bestScore = totalQuizzes > 0 ? Math.max(...previousAttempts.map(a => a.score)) : 0;
    const totalCorrect = previousAttempts.reduce((sum, attempt) => sum + attempt.correct_answers, 0);
    const totalQuestions = previousAttempts.reduce((sum, attempt) => sum + attempt.total_questions, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const stats = [
        { icon: Trophy, label: 'Quizzes Taken', value: totalQuizzes, color: 'text-brand-magenta' },
        { icon: Target, label: 'Best Score', value: bestScore, color: 'text-brand-mint' },
        { icon: TrendingUp, label: 'Avg Score', value: averageScore, color: 'text-brand-purple' },
        { icon: Clock, label: 'Accuracy', value: `${accuracy}%`, color: 'text-brand-blue' },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-brand-obsidian pb-20 lg:pb-0">
            <Header />

            <main className="container py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">
                            Profile
                        </h1>
                        <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">
                            Your quiz performance and stats
                        </p>
                    </div>

                    {/* User Info Card */}
                    <Card className="slide-up">
                        <div className="flex items-center gap-6">
                            <Avatar
                                src={user.discord_avatar_url}
                                alt={user.discord_username}
                                size="lg"
                            />
                            <div className="flex-1">
                                <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-1 uppercase tracking-tight">
                                    {user.discord_username}
                                </h2>
                                <Badge variant="gold">Discord Member</Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map(({ icon: Icon, label, value, color }) => (
                            <Card key={label} className="text-center slide-up">
                                <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
                                <div className="text-3xl font-black text-brand-black dark:text-brand-white mb-1 italic tracking-tight">
                                    {value}
                                </div>
                                <div className="text-xs text-brand-black/60 dark:text-brand-white/60 font-bold uppercase tracking-widest">
                                    {label}
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Achievement Section (Placeholder) */}
                    <Card className="slide-up">
                        <h3 className="text-xl font-black text-brand-black dark:text-brand-white mb-4 uppercase italic tracking-tighter">
                            Achievements
                        </h3>
                        <div className="text-center py-8">
                            <Trophy className="w-12 h-12 mx-auto mb-3 text-brand-gray dark:text-zinc-700" />
                            <p className="text-brand-black/40 dark:text-brand-white/40 font-medium">
                                Complete more quizzes to unlock achievements!
                            </p>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
