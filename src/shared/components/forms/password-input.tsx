'use client';

import * as React from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input, type InputProps } from '@/shared/components/ui/input';

const strengthCopy = [
  { label: 'Weak', tone: 'bg-danger-400' },
  { label: 'Fair', tone: 'bg-warning-400' },
  { label: 'Good', tone: 'bg-info-400' },
  { label: 'Strong', tone: 'bg-success-500' }
] as const;

function getPasswordScore(value: string) {
  let score = 0;

  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  return score;
}

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'trailingIcon'> {
  showStrengthMeter?: boolean;
}

export function PasswordInput({
  className,
  value,
  showStrengthMeter = true,
  helperText,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);
  const password = typeof value === 'string' ? value : '';
  const score = getPasswordScore(password);
  const strength = password ? strengthCopy[Math.max(score - 1, 0)] : null;

  return (
    <div className="grid gap-2">
      <Input
        {...props}
        value={value}
        type={visible ? 'text' : 'password'}
        className={className}
        helperText={undefined}
        trailingIcon={
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full p-1 text-muted-foreground transition hover:text-foreground focus-visible:outline-none"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />
      {showStrengthMeter ? (
        <div className="grid gap-2">
          <div className="grid grid-cols-4 gap-2" aria-hidden="true">
            {strengthCopy.map((item, index) => (
              <span
                key={item.label}
                className={cn(
                  'h-1.5 rounded-full bg-neutral-200 transition-colors',
                  password && index < score && item.tone
                )}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{helperText || 'Use 8+ characters, a number, and a symbol.'}</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              {strength ? strength.label : 'No password'}
            </span>
          </div>
        </div>
      ) : helperText ? (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
