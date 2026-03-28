import Link from 'next/link';

import { AuthLayout } from '@/shared/components/layout/auth-layout';
import { routes } from '@/shared/constants/routes';
import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      eyebrow="Recovery"
      title="Passwordless recovery still needs a dedicated auth shell."
      description="Even if authentication is OTP-first, the recovery route stays separate from onboarding and workspace navigation."
    >
      <div className="space-y-6">
        <CardHeader className="p-0">
          <Badge variant="secondary" size="sm">
            Recovery flow
          </Badge>
          <CardTitle className="mt-3">Request a recovery code</CardTitle>
          <CardDescription>Use the same identifier you used to create the account.</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <Input label="Email or phone" placeholder="buyer@vendora.app" />
          <div className="flex flex-wrap items-center gap-3">
            <button className={buttonVariants({ variant: 'primary' })}>Send recovery link</button>
            <Link href={routes.auth.login} className={buttonVariants({ variant: 'outline' })}>
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
