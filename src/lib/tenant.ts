import { env } from '@/config/env';

export interface TenantContext {
  slug: string | null;
  source: 'path' | 'subdomain' | 'none';
}

const reservedSubdomains = new Set(['www', 'app', 'api', 'localhost']);

export function resolveTenant({
  pathname,
  host
}: {
  pathname: string;
  host: string;
}): TenantContext {
  const hostName = host.split(':')[0];
  const [subdomain] = hostName.split('.');

  if (env.TENANT_STRATEGY === 'subdomain' && subdomain && !reservedSubdomains.has(subdomain)) {
    return {
      slug: subdomain,
      source: 'subdomain'
    };
  }

  const pathMatch = pathname.match(/^\/t\/([^/]+)/);

  if (pathMatch) {
    return {
      slug: pathMatch[1],
      source: 'path'
    };
  }

  return {
    slug: null,
    source: 'none'
  };
}
