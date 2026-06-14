import Link from 'next/link';
import type { Route } from 'next';
import { cn } from '@/lib/utils';
import { routes } from '@/shared/constants/routes';

interface LogoProps {
  className?: string;
  href?: Route;
}

export function Logo({ className, href = routes.public.home }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-white transition-opacity hover:opacity-90',
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black transition-transform group-hover:scale-105">
        V
      </div>
      <span>Vendora</span>
    </Link>
  );
}
