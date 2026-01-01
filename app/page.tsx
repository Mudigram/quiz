'use client';

import { useAuth } from '@/lib/auth-context';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { ActiveQuizHome } from '@/components/ActiveQuizHome';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-brand-obsidian">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-mint mx-auto mb-4"></div>
          <p className="text-brand-black/60 dark:text-brand-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <ActiveQuizHome />;
}