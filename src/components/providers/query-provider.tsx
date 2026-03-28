'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { createApiQueryClient } from '@/lib/api/client';

export function QueryProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(createApiQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
