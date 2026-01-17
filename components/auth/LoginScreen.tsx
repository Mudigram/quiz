'use client';

import { SiDiscord } from 'react-icons/si';
import { Users, Trophy, Target, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '@/lib/auth-context';
import { useState, useCallback } from 'react';
import { ritualConfig } from '@/config/ritual';
import Image from 'next/image';
import debounce from 'lodash/debounce';

export function LoginScreen() {
  const { signInWithDiscord, signInWithUsername, signUpWithUsername, checkUsernameAvailability } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Registration specific state
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const checkAvailability = useCallback(
    debounce(async (uname: string) => {
      if (uname.length < 3) {
        setIsUsernameAvailable(null);
        return;
      }
      setIsCheckingUsername(true);
      const available = await checkUsernameAvailability(uname);
      setIsUsernameAvailable(available);
      setIsCheckingUsername(false);
    }, 500),
    [checkUsernameAvailability]
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Enforce alphanumeric only
    if (!/^[a-zA-Z0-9]*$/.test(val)) return;

    setUsername(val);
    if (mode === 'register') {
      checkAvailability(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signInWithUsername(username, password);
      } else {
        if (!isUsernameAvailable) {
          setError('Username is not available');
          setIsLoading(false);
          return;
        }
        await signUpWithUsername(username, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithDiscord();
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Users, text: '1,200+ Active Learners' },
    { icon: Trophy, text: 'Weekly Competitions' },
    { icon: Target, text: 'Master AI Technology' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 bg-brand-obsidian"
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease infinite',
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-black/10"></div>

      <div className="relative z-10 w-full max-w-md p-6 mx-4">
        {/* Logo & Branding */}
        <div className="text-center mb-8 slide-up">
          <div className="w-20 h-20 mx-auto mb-4 bg-brand-obsidian rounded-2xl flex items-center justify-center shadow-lg">
            <Image src="/ritual-logo.png" alt="Logo" width={60} height={60} className='rounded-2xl' />
          </div>

          <h1 className="text-5xl font-black text-white mb-3 uppercase italic tracking-tighter">
            {ritualConfig.project.name}
          </h1>
          <p className="text-xl text-white/90 font-bold uppercase tracking-wide mb-2">
            {ritualConfig.project.tagline}
          </p>
        </div>

        {/* Glassmorphic Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl slide-up">
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight text-center">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/80">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-mint/50 focus:border-brand-mint transition-all"
                  placeholder="Enter username"
                  minLength={3}
                  required
                />
                {mode === 'register' && username.length >= 3 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isCheckingUsername ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                    ) : isUsernameAvailable ? (
                      <Check className="w-5 h-5 text-brand-mint" />
                    ) : (
                      <X className="w-5 h-5 text-brand-red" />
                    )}
                  </div>
                )}
              </div>
              {mode === 'register' && username.length > 0 && !isUsernameAvailable && !isCheckingUsername && username.length >= 3 && (
                <p className="text-xs text-brand-red font-bold">Username is taken</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/80">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-mint/50 focus:border-brand-mint transition-all"
                placeholder="Enter password"
                minLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-brand-red font-bold text-center bg-brand-red/10 py-2 rounded">
                {error}
              </p>
            )}

            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 text-base shadow-[0_0_20px_rgba(64,255,175,0.3)]"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/20 flex-1"></div>
            <span className="text-xs font-bold text-white/40 uppercase">Or continue with</span>
            <div className="h-px bg-white/20 flex-1"></div>
          </div>

          <Button
            variant="discord"
            onClick={handleDiscordSignIn}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 mb-6"
          >
            <SiDiscord className="w-5 h-5" />
            <span className="text-sm">Discord</span>
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
                setUsername('');
                setPassword('');
              }}
              className="text-brand-mint hover:text-brand-mint/80 text-sm font-bold uppercase tracking-wide transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-6 text-white/60 text-sm font-bold uppercase tracking-widest slide-up">
          <p>One Quiz Per Week • One Attempt • Top the Leaderboard</p>
        </div>
      </div>
    </div>
  );
}