import { redirect } from 'next/navigation';

import { routes } from '@/shared/constants/routes';

export default function VendorVerificationPage() {
  redirect(routes.vendor.dashboard);
}
