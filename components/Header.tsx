'use client';

import { LogOut } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { useAuth } from '@/lib/auth-context';

export function Header() {
  const { user, signOut } = useAuth();

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
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar src={user.discord_avatar_url} alt={user.discord_username} size="sm" />
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