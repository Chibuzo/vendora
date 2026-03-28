'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import type { Session } from '@/lib/auth';
import { AuthBootstrap } from '@/modules/auth/components/AuthBootstrap';

export function AppProviders({
  initialSession,
  children
}: Readonly<{
  initialSession: Session | null;
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap initialSession={initialSession} />
      {children}
    </QueryClientProvider>
  );
}
