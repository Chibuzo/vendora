import { LoginForm } from '@/modules/auth';
import { AuthLayout } from '@/shared/components/layout/auth-layout';
import { Badge } from '@/shared/components/ui/badge';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Session access"
      title="Sign in with OTP-backed access."
      description="This scaffold stores the authenticated session in HTTP-only cookies and mirrors the active user profile into a lightweight client store."
      aside={
        <div className="rounded-[var(--radius-xl)] border border-white/10 bg-white/5 p-5 text-sm text-white/72">
          <p className="font-semibold text-white">Demo accounts</p>
          <p className="mt-2">Use `vendor@vendora.app`, `admin@vendora.app`, or any other identifier.</p>
          <p className="mt-1">Use OTP `123456` while mocks are enabled.</p>
        </div>
      }
    >
      <CardHeader className="p-0 pb-6">
        <Badge variant="secondary" size="sm">
          Vendora authentication
        </Badge>
        <CardTitle className="mt-3">Account login</CardTitle>
        <CardDescription>Use the same entry pattern for customer, vendor, and admin roles.</CardDescription>
      </CardHeader>
      <LoginForm />
    </AuthLayout>
  );
}
