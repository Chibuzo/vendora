import type { Route } from 'next';
import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  Boxes,
  Building2,
  CreditCard,
  Home,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Store,
  UserRound
} from 'lucide-react';

import { routes } from '@/shared/constants/routes';

export interface NavigationItem {
  href: Route;
  label: string;
  icon: string;
}

export const publicNavigation: NavigationItem[] = [
  { href: routes.public.home as Route, label: 'Home', icon: 'Home' },
  { href: routes.public.vendors as Route, label: 'Vendors', icon: 'Store' },
  { href: routes.public.products as Route, label: 'Products', icon: 'ShoppingBag' },
  { href: routes.public.search as Route, label: 'Search', icon: 'Search' }
];

export const vendorNavigation: NavigationItem[] = [
  { href: routes.vendor.dashboard as Route, label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: routes.vendor.products as Route, label: 'Products', icon: 'Package' },
  { href: routes.vendor.orders as Route, label: 'Orders', icon: 'Boxes' },
  { href: routes.vendor.payouts as Route, label: 'Payouts', icon: 'CreditCard' },
  { href: routes.vendor.analytics as Route, label: 'Analytics', icon: 'ShoppingBag' },
  { href: routes.vendor.settings as Route, label: 'Settings', icon: 'Settings' }
];

export const buyerNavigation: NavigationItem[] = [
  { href: routes.buyer.home as Route, label: 'Home', icon: 'Home' },
  { href: routes.buyer.orders as Route, label: 'Orders', icon: 'Boxes' },
  { href: routes.buyer.account as Route, label: 'Account', icon: 'UserRound' }
];

export const sharedNavigation: NavigationItem[] = [
  { href: routes.shared.notifications as Route, label: 'Notifications', icon: 'Bell' },
  { href: routes.shared.profile as Route, label: 'Profile', icon: 'UserRound' }
];

export const adminNavigation: NavigationItem[] = [
  { href: routes.admin.dashboard as Route, label: 'Overview', icon: 'LayoutDashboard' },
  { href: routes.vendor.dashboard as Route, label: 'Vendor view', icon: 'Building2' }
];

export const iconMap: Record<string, LucideIcon> = {
  Bell,
  Boxes,
  Building2,
  CreditCard,
  Home,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Store,
  UserRound
};
