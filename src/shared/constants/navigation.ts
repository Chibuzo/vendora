import type { Route } from 'next';
import type { LucideIcon } from 'lucide-react';
import { Boxes, Building2, LayoutDashboard, ShoppingBag, Store } from 'lucide-react';

export interface NavigationItem {
  href: Route;
  label: string;
  icon: string;
}

export const customerNavigation: NavigationItem[] = [
  { href: '/marketplace', label: 'Marketplace', icon: 'ShoppingBag' },
  { href: '/orders', label: 'Orders', icon: 'Boxes' }
];

export const vendorNavigation: NavigationItem[] = [
  { href: '/vendor/dashboard' as Route, label: 'Dashboard', icon: 'Store' },
  { href: '/marketplace', label: 'Marketplace', icon: 'ShoppingBag' }
];

export const adminNavigation: NavigationItem[] = [
  { href: '/admin/dashboard' as Route, label: 'Overview', icon: 'LayoutDashboard' },
  { href: '/vendor/dashboard' as Route, label: 'Vendor view', icon: 'Building2' }
];
