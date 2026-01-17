import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'discord' | 'ghost' | 'outline';
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  children,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    discord: 'btn-discord',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}