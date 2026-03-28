import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Inter, Manrope } from 'next/font/google';

import '@/app/globals.css';

import { AppProviders } from '@/components/providers/AppProviders';
import { readSessionState, SESSION_STATE_COOKIE } from '@/lib/auth';

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
  description: 'Multi-tenant marketplace platform for customers, vendors, and operators.'
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
        <AppProviders initialSession={initialSession}>{children}</AppProviders>
      </body>
    </html>
  );
}
