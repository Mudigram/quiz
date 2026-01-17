'use client';

import { LogOut } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-brand-black border-b border-brand-gray dark:border-zinc-800">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-brand-black dark:text-brand-white tracking-tighter uppercase italic">
              Weekly Quiz <span className="text-brand-purple">Challenge</span>
            </h1>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 ml-8">
              <Link
                href="/"
                className={`text-sm font-bold uppercase tracking-tight hover:text-brand-purple transition-colors ${pathname === '/' ? 'text-brand-mint' : 'text-brand-black/60 dark:text-brand-white/60'}`}
              >
                Home
              </Link>
              <Link
                href="/quiz"
                className={`text-sm font-bold uppercase tracking-tight hover:text-brand-purple transition-colors ${pathname === '/quiz' ? 'text-brand-mint' : 'text-brand-black/60 dark:text-brand-white/60'}`}
              >
                Quiz
              </Link>
              <Link
                href="/resources"
                className={`text-sm font-bold uppercase tracking-tight hover:text-brand-purple transition-colors ${pathname === '/resources' ? 'text-brand-mint' : 'text-brand-black/60 dark:text-brand-white/60'}`}
              >
                Learn
              </Link>
              <Link
                href="/leaderboard"
                className={`text-sm font-bold uppercase tracking-tight hover:text-brand-purple transition-colors ${pathname === '/leaderboard' ? 'text-brand-mint' : 'text-brand-black/60 dark:text-brand-white/60'}`}
              >
                Ranks
              </Link>
              <Link
                href="/history"
                className={`text-sm font-bold uppercase tracking-tight hover:text-brand-purple transition-colors ${pathname === '/history' ? 'text-brand-mint' : 'text-brand-black/60 dark:text-brand-white/60'}`}
              >
                History
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar
                // Tries specific avatar -> discord avatar -> empty string (safe fallback)
                src={user.avatar_url ?? user.discord_avatar_url ?? ''}
                // Tries display name -> username -> 'User' (safe fallback)
                alt={user.display_name ?? user.username ?? 'User'}
                size="lg"
              />
              <span className="text-sm font-bold text-brand-black dark:text-brand-white">{user.discord_username}</span>
            </div>
            <Button
              variant="secondary"
              onClick={handleSignOut}
              className="flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}