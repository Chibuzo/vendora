import Link from 'next/link';

export function PublicHeader() {
  return (
    <header className="border-b border-black/5 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
          Vendora
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/marketplace" className="transition hover:text-brand-700">
            Marketplace
          </Link>
          <Link href="/register" className="transition hover:text-brand-700">
            Become a vendor
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-ink px-4 py-2 text-white transition hover:bg-slate-900"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
