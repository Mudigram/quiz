import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { RankBadge } from '@/lib/types';

interface BadgeProps {
  children: ReactNode;
  variant?: RankBadge;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantClasses = {
    gold: 'bg-brand-magenta/10 text-brand-magenta border-brand-magenta/30',
    silver: 'bg-brand-purple/10 text-brand-purple border-brand-purple/30',
    bronze: 'bg-brand-blue/10 text-brand-blue border-brand-blue/30',
    mint: 'bg-brand-mint/10 text-brand-mint border-brand-mint/30',
    outline: 'bg-transparent text-brand-black/60 dark:text-brand-white/60 border-brand-black/10 dark:border-brand-white/10',
    default: 'bg-brand-gray/10 text-brand-obsidian/70 dark:text-brand-white/70 border-brand-gray/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}