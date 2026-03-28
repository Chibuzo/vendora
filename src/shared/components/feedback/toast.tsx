'use client';

import * as React from 'react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

import { cn } from '@/lib/utils';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: TriangleAlert
} as const;

const toneMap: Record<ToastVariant, string> = {
  info: 'border-info-200 bg-info-50 text-info-900',
  success: 'border-success-200 bg-success-50 text-success-900',
  warning: 'border-warning-200 bg-warning-50 text-warning-900',
  danger: 'border-danger-200 bg-danger-50 text-danger-900'
};

export function ToastProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = React.useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, ...toast }]);
    window.setTimeout(() => dismissToast(id), 4000);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}

export function ToastViewport() {
  const context = React.useContext(ToastContext);

  if (!context) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-4 top-4 z-[70] grid justify-items-end gap-3"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {context.toasts.map((toast) => {
        const Icon = iconMap[toast.variant];

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm gap-3 rounded-[var(--radius-xl)] border p-4 shadow-soft-lg backdrop-blur',
              toneMap[toast.variant]
            )}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="grid gap-1">
              <p className="font-medium">{toast.title}</p>
              {toast.description ? <p className="text-sm leading-6 opacity-90">{toast.description}</p> : null}
            </div>
            <button
              type="button"
              className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/50"
              onClick={() => context.dismissToast(toast.id)}
              aria-label="Dismiss toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
