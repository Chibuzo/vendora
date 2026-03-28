'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { createApiQueryClient } from '@/lib/api/client';
import type { Session } from '@/lib/auth';
import { AuthBootstrap } from '@/modules/auth/components/AuthBootstrap';

export function AppProviders({
  initialSession,
  children
}: Readonly<{
  initialSession: Session | null;
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(createApiQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap initialSession={initialSession} />
      {children}
    </QueryClientProvider>
  );
}
