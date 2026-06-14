import { redirect } from 'next/navigation';

import { routes } from '@/shared/constants/routes';

export default function VendorSetupPage() {
  redirect(routes.onboarding.vendorBusiness);
}
