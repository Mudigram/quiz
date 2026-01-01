'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Clock, User } from 'lucide-react';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/history', label: 'History', icon: Clock },
    { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
    const pathname = usePathname();

    // Don't show nav during quiz taking or results
    if (pathname.includes('/quiz/') || pathname.includes('/results')) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-brand-gray dark:border-zinc-800 bg-white dark:bg-brand-black">
            <div className="grid grid-cols-4 h-16">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center justify-center gap-1 transition-all ${isActive
                                    ? 'text-brand-mint'
                                    : 'text-brand-black/40 dark:text-brand-white/40 hover:text-brand-purple'
                                }`}
                        >
                            <Icon
                                className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={`text-xs font-bold uppercase tracking-tight ${isActive ? 'text-brand-mint' : ''}`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
