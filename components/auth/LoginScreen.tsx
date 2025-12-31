'use client';

import { SiDiscord } from 'react-icons/si';
import { Button } from '../ui/Button';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export function LoginScreen() {
  const { signInWithDiscord } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithDiscord();
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md p-8 text-center slide-up">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 mb-3">Weekly Quiz Challenge</h1>
          <p className="text-lg text-zinc-600">
            Learn about the blockchain ecosystem through competitive weekly quizzes
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Get Started</h2>
          <p className="text-zinc-600 mb-6">
            Sign in with your Discord account to participate in weekly quizzes and compete on the
            leaderboard.
          </p>

          <Button
            variant="discord"
            onClick={handleSignIn}
            isLoading={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3"
          >
            {!isLoading && <SiDiscord className="w-5 h-5" />}
            Sign in with Discord
          </Button>
        </div>

        <div className="text-sm text-zinc-500">
          <p>One quiz per week • One attempt per quiz • Compete for the top spot!</p>
        </div>
      </div>
    </div>
  );
}