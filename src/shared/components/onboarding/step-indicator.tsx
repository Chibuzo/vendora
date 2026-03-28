import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface StepIndicatorItem {
  id: string;
  label: string;
}

export interface StepIndicatorProps {
  steps: StepIndicatorItem[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <ol className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
      {steps.map((step, index) => {
        const state = index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming';

        return (
          <li key={step.id} className="flex items-center gap-3">
            <span
              className={cn(
                'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold',
                state === 'complete' && 'border-success-500 bg-success-500 text-white',
                state === 'current' && 'border-primary-600 bg-primary-600 text-white shadow-soft-sm',
                state === 'upcoming' && 'border-border bg-surface text-muted-foreground'
              )}
            >
              {state === 'complete' ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            <div className="grid gap-1">
              <p className="text-sm font-medium text-foreground">{step.label}</p>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{state}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
