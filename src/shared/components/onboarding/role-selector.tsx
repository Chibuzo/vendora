'use client';

import { ShoppingBag, Store } from 'lucide-react';

import { cn } from '@/lib/utils';
import { RadioGroup, RadioOption } from '@/shared/components/ui/radio-group';

export interface RoleSelectorProps {
  value?: 'buyer' | 'vendor';
  onValueChange?: (value: 'buyer' | 'vendor') => void;
}

const roleCopy = {
  buyer: {
    label: 'Buyer',
    description: 'Discover trusted vendors, save repeat purchases, and manage orders.',
    icon: ShoppingBag
  },
  vendor: {
    label: 'Vendor',
    description: 'Launch a credible storefront, earn trust, and manage sales operations.',
    icon: Store
  }
} as const;

export function RoleSelector({ value = 'buyer', onValueChange }: RoleSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(nextValue) => onValueChange?.(nextValue as 'buyer' | 'vendor')}
      className="grid gap-4 md:grid-cols-2"
    >
      {(['buyer', 'vendor'] as const).map((role) => {
        const Icon = roleCopy[role].icon;
        const selected = value === role;

        return (
          <div
            key={role}
            className={cn(
              'rounded-[var(--radius-2xl)] border p-5 transition',
              selected ? 'border-primary-300 bg-primary-50 shadow-soft-sm' : 'border-border/70 bg-card'
            )}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary-700 shadow-soft-xs">
              <Icon className="h-5 w-5" />
            </div>
            <RadioOption
              value={role}
              label={roleCopy[role].label}
              description={roleCopy[role].description}
              className="mt-1"
            />
          </div>
        );
      })}
    </RadioGroup>
  );
}
