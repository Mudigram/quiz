'use client';

import { Users, Trophy, Target, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAuth } from '@/lib/auth-context';
import { usePreviousAttempts } from '@/lib/api-hooks';

export function CommunityStats() {
    const { user } = useAuth();
    const { data: attempts = [] } = usePreviousAttempts(user?.id);

    // Calculate basic stats from current user's data
    // In production, you'd fetch global stats from an API endpoint
    const stats = [
        {
            icon: Users,
            label: 'Active Learners',
            value: '1,200+', // Placeholder - update with real data
            color: 'text-brand-mint',
            bgColor: 'bg-brand-mint/10',
        },
        {
            icon: Trophy,
            label: 'Quizzes Completed',
            value: attempts.length > 0 ? attempts.length.toString() : '0',
            color: 'text-brand-magenta',
            bgColor: 'bg-brand-magenta/10',
        },
        {
            icon: Target,
            label: 'This Week',
            value: '342', // Placeholder - update with real data
            color: 'text-brand-purple',
            bgColor: 'bg-brand-purple/10',
        },
        {
            icon: TrendingUp,
            label: 'Avg Score',
            value: '420', // Placeholder - update with real data
            color: 'text-brand-blue',
            bgColor: 'bg-brand-blue/10',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">
                    Community Impact
                </h2>
                <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">
                    Join thousands learning about decentralized AI
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ icon: Icon, label, value, color, bgColor }) => (
                    <Card key={label} className="text-center slide-up">
                        <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <Icon className={`w-6 h-6 ${color}`} />
                        </div>

                        <div className="text-3xl font-black text-brand-black dark:text-brand-white mb-1 italic tracking-tight">
                            {value}
                        </div>

                        <div className="text-xs text-brand-black/60 dark:text-brand-white/60 font-bold uppercase tracking-widest">
                            {label}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
