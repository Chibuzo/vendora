import Link from 'next/link';

import type { NavigationItem } from '@/shared/constants/navigation';

export function DashboardShell({
  eyebrow,
  title,
  navigation,
  children
}: Readonly<{
  eyebrow: string;
  title: string;
  navigation: NavigationItem[];
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="surface h-fit p-6">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
            Vendora
          </Link>
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.24em] text-brand-700">{eyebrow}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{title}</h1>
          </div>
          <nav className="mt-8 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="space-y-6 py-2">{children}</div>
      </div>
    </div>
  );
}
