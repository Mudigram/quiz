'use client';

import { SiDiscord } from 'react-icons/si';
import { Users, Trophy, Target } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { ritualConfig } from '@/config/ritual';
import Image from 'next/image';

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
          {/* Logo Placeholder - Replace with your actual logo */}
          <div className="w-20 h-20 mx-auto mb-4 bg-brand-obsidian rounded-2xl flex items-center justify-center shadow-lg">
            <Image src="/ritual-logo.png" alt="Logo" width={60} height={60} className='rounded-2xl' />
          </div>

          <h1 className="text-5xl font-black text-white mb-3 uppercase italic tracking-tighter">
            {ritualConfig.project.name}
          </h1>
          <p className="text-xl text-white/90 font-bold uppercase tracking-wide mb-2">
            {ritualConfig.project.tagline}
          </p>
          <p className="text-white/70 font-medium">
            Test your knowledge. Climb the leaderboard.
          </p>
        </div>

        {/* Glassmorphic Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl slide-up">
          <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">
            Get Started
          </h2>
          <p className="text-white/80 mb-6 font-medium leading-relaxed">
            Join the community learning about decentralized AI infrastructure through weekly quizzes.
          </p>

          <Button
            variant="discord"
            onClick={handleSignIn}
            isLoading={isLoading}
            className="w-full flex items-center justify-center gap-3 py-4 mb-6 shadow-[0_0_20px_rgba(136,64,255,0.4)]"
          >
            {!isLoading && <SiDiscord className="w-6 h-6" />}
            <span className="text-base">Sign in with Discord</span>
          </Button>

          {/* Features */}
          <div className="space-y-3 pt-6 border-t border-white/20">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-brand-mint/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-brand-mint" />
                </div>
                <span className="font-bold text-sm uppercase tracking-wide">{text}</span>
              </div>
            ))}
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