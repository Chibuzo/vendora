export interface NavigationItem {
  href: string;
  label: string;
}

export const customerNavigation: NavigationItem[] = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/orders', label: 'Orders' }
];

export const vendorNavigation: NavigationItem[] = [
  { href: '/vendor/dashboard', label: 'Dashboard' },
  { href: '/marketplace', label: 'Marketplace' }
];

export const adminNavigation: NavigationItem[] = [
  { href: '/admin/dashboard', label: 'Overview' },
  { href: '/vendor/dashboard', label: 'Vendor view' }
];
