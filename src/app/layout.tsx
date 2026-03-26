import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';

import '@/app/globals.css';

import { AppProviders } from '@/components/providers/AppProviders';

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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} data-tenant-theme="vendora">
      <body className="font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
