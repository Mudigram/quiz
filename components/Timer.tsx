'use client';

import { Clock } from 'lucide-react';
import { formatTimeRemaining, getTimerColorClass } from '@/lib/utils';

interface TimerProps {
  seconds: number;
  maxSeconds?: number;
}

export function Timer({ seconds, maxSeconds = 300 }: TimerProps) {
  const colorClass = getTimerColorClass(seconds, maxSeconds);

  return (
    <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${colorClass}`}>
      <Clock className="w-6 h-6" />
      <span>{formatTimeRemaining(seconds)}</span>
    </div>
  );
}