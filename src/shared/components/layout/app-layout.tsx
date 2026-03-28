import Link from 'next/link';
import { Sparkles } from 'lucide-react';

import { publicNavigation, iconMap } from '@/shared/constants/navigation';
import { routes } from '@/shared/constants/routes';
import { Navbar } from '@/shared/components/navigation/navbar';
import { Badge } from '@/shared/components/ui/badge';

export function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <Navbar
        brandHref={routes.public.home}
        brandLabel="Vendora"
        items={publicNavigation.map(({ href, label, icon }) => ({
          href,
          label,
          icon: iconMap[icon]
        }))}
        suggestions={['Verified office furniture', 'Solar backup kits', 'Top packaging vendors', 'Cold-chain logistics']}
        primaryAction={{ href: routes.auth.signup, label: 'Join Vendora' }}
        secondaryAction={{ href: routes.auth.login, label: 'Sign in' }}
        actionSlot={
          <Badge variant="accent" className="hidden sm:inline-flex">
            <Sparkles className="h-3.5 w-3.5" />
            Discovery mode
          </Badge>
        }
      />
      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <footer className="border-t border-border/70 bg-surface/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Vendora marketplace surfaces for buyer discovery and tenant-ready merchandising.</p>
          <div className="flex items-center gap-4">
            <Link href={routes.public.vendors} className="transition hover:text-foreground">
              Vendors
            </Link>
            <Link href={routes.public.products} className="transition hover:text-foreground">
              Products
            </Link>
            <Link href={routes.public.search} className="transition hover:text-foreground">
              Search
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
