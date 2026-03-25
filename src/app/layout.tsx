import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';

import '@/app/globals.css';

import { AppProviders } from '@/components/providers/AppProviders';

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans'
});

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: 'Vendora',
  description: 'Multi-tenant marketplace platform for customers, vendors, and operators.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
