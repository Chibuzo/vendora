import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Inter, Manrope } from 'next/font/google';

import '@/app/globals.css';

import { AuthProvider } from '@/components/providers/auth-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { readSessionState, SESSION_STATE_COOKIE } from '@/lib/auth';
import { ToastProvider } from '@/shared/components/feedback/toast';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

const display = Manrope({
  subsets: ['latin'],
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: 'Vendora',
  description: 'Multi-tenant marketplace platform for buyers, vendors, and operator workflows.'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialSession = readSessionState(cookieStore.get(SESSION_STATE_COOKIE)?.value);

  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} data-tenant-theme="vendora">
      <body className="font-sans antialiased">
        <QueryProvider>
          <AuthProvider initialSession={initialSession}>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
