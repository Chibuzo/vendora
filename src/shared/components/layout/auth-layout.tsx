import { ShieldCheck, Sparkles } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}

export function AuthLayout({ eyebrow, title, description, children, aside }: Readonly<AuthLayoutProps>) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_520px] lg:items-center">
      <section className="surface relative overflow-hidden border-0 bg-surface-inverse px-8 py-10 text-white sm:px-10">
        <div className="absolute inset-0 bg-panel-grid bg-[size:32px_32px] opacity-10" />
        <div className="relative space-y-8">
          <Badge variant="outline" className="border-white/15 bg-white/5 text-white">
            {eyebrow}
          </Badge>
          <div className="space-y-4">
            <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{title}</h1>
            <p className="max-w-lg text-base leading-7 text-white/72">{description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--radius-xl)] border border-white/10 bg-white/5 p-5">
              <ShieldCheck className="h-5 w-5 text-white/80" />
              <p className="mt-4 text-sm font-semibold">Tenant-safe access</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Sessions, routing, and role separation stay consistent across buyer, vendor, and admin surfaces.
              </p>
            </div>
            <div className="rounded-[var(--radius-xl)] border border-white/10 bg-white/5 p-5">
              <Sparkles className="h-5 w-5 text-white/80" />
              <p className="mt-4 text-sm font-semibold">Calm operational UX</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                The system uses restrained color, generous spacing, and predictable states for trust-heavy flows.
              </p>
            </div>
          </div>
          {aside}
        </div>
      </section>

      <Card variant="elevated" className="mx-auto w-full max-w-xl">
        <CardContent className="p-8 sm:p-10">{children}</CardContent>
      </Card>
    </div>
  );
}
