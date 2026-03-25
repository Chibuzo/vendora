import { LoginForm } from '@/modules/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

export default function LoginPage() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6 rounded-[2rem] bg-ink p-10 text-white">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-brand-200">Session access</p>
          <h1 className="font-display text-4xl font-semibold">Sign in with OTP-backed access.</h1>
          <p className="text-sm leading-7 text-slate-300">
            This scaffold stores the authenticated session in HTTP-only cookies and mirrors the
            user profile into a lightweight client store for rendering.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <p className="font-semibold text-white">Demo accounts</p>
          <p className="mt-2">Use `vendor@vendora.app`, `admin@vendora.app`, or any other identifier.</p>
          <p className="mt-1">Use OTP `123456` while mocks are enabled.</p>
        </div>
      </div>

      <Card className="self-center">
        <CardHeader>
          <CardTitle>Account login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
