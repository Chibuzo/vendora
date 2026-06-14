import { LoginForm } from '@/modules/auth';
import { AuthLayout } from '@/shared/components/layout/auth-layout';
import { Badge } from '@/shared/components/ui/badge';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

const enableMocks = process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true';

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Authentication"
      title="Sign in once, route to the right workspace."
      description="Login does not decide layout chrome. It only restores session state, then routing chooses onboarding, buyer, or vendor surfaces."
      aside={
        enableMocks ? (
          <div className="rounded-[var(--radius-xl)] border border-white/10 bg-white/5 p-5 text-sm text-white/72">
            <p className="font-semibold text-white">Mock accounts</p>
            <p className="mt-2">Use `buyer@vendora.app`, `vendor@vendora.app`, or `admin@vendora.app`.</p>
            <p className="mt-1">Password: `password123`.</p>
            <p className="mt-1">Phone OTP: `123456` while mocks are enabled.</p>
          </div>
        ) : null
      }
    >
      <CardHeader className="p-0 pb-6">
        <Badge variant="secondary" size="sm">
          Vendora access
        </Badge>
        <CardTitle className="mt-3">Sign in with email or phone</CardTitle>
        <CardDescription>Route guards handle onboarding, buyer, and vendor redirects after the session is established.</CardDescription>
      </CardHeader>
      <LoginForm />
    </AuthLayout>
  );
}
