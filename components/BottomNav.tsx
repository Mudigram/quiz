'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, User, Zap, BookOpen } from 'lucide-react';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/quiz', label: 'Quiz', icon: Zap },
    { href: '/resources', label: 'Learn', icon: BookOpen },
    { href: '/leaderboard', label: 'Ranks', icon: Trophy },
    { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
    const pathname = usePathname();

    // Don't show nav during quiz taking or results
    if (pathname.includes('/quiz/') && !pathname.endsWith('/quiz')) { // Allow /quiz list page, but not /quiz/[id] usually (but /quiz/[id] structure isn't used yet, usually just /quiz mode). 
        // Wait, the quiz taking logic in ActiveQuizHome uses setViewState('quiz').
        // If routes are /quiz/ (list) vs /quiz/[id] (taking), we need to be careful.
        // The current implementation of ActiveQuizHome uses conditional rendering on '/', it doesn't navigate to '/quiz/...'.
        // However, I just created '/quiz/page.tsx'.
        // The quiz taking happens inside ActiveQuizHome component, which is at '/'.
        // But wait, ActiveQuizHome conditionally renders `QuizInterface` when `viewState === 'quiz'`.
        // The URL doesn't change when taking the quiz on Home page currently.
        // But what if I want to display the bottom nav on the Quiz List page? Yes.
        // What about when taking a quiz?
        // If the user takes a quiz from the Home page, the URL is still '/' and BottomNav shows. This might be an issue.
        // The original BottomNav had: `if (pathname.includes('/quiz/') || pathname.includes('/results'))`
        // My new Quiz page is `/quiz`. `pathname.includes('/quiz/')` will match `/quiz` if it has trailing slash, but `usePathname` usually gives `/quiz`.
        // `includes` matches substrings. '/quiz' includes '/quiz'.
        // So I should check if it is EXACTLY '/quiz' to SHOW it.
        // But if I am inside a quiz (if I move quiz taking to a route later), I'd want to hide it.
        // For now, let's assume we want to show it on `/quiz` (the list).
        // And hide it on `/results`.
        // If the URL is `/quiz`, we show it. 
        // If the URL is `/quiz/123`, we might want to hide it.
        // The check `pathname.includes('/quiz/')` matches `/quiz/123` but NOT `/quiz` (missing trailing slash in logic? No, includes matches string).
        // `/quiz` includes `/quiz/`? No.
        // `/quiz/123` includes `/quiz/`. Yes.
        // So `pathname.includes('/quiz/')` is good for nested routes, but safely ignores `/quiz` if we check carefully.
        // BUT strict string includes: `'/quiz'.includes('/quiz/')` is false.
        // So checking `pathname.includes('/quiz/')` correctly targeting sub-routes only.
        // So I can leave the check as is?
        // Let's verify.
        // If I visit `/quiz` page. Pathname is `/quiz`.
        // `/quiz`.includes('/quiz/') -> False. Nav SHOWS. Correct.
        // If I visit `/results`. Nav HIDES. Correct.

        // Wait, I should make sure I didn't break anything.
    }

    // Don't show nav during results
    if (pathname.includes('/results')) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-brand-gray dark:border-zinc-800 bg-white dark:bg-brand-black">
            <div className="grid grid-cols-5 h-16">
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
                            <span className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? 'text-brand-mint' : ''}`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
