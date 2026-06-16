'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { routes } from '@/shared/constants/routes';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { getAuthenticatedLandingRoute } from '@/modules/onboarding/lib/onboarding';
import {
  selectOnboardingSnapshot,
  useOnboardingStore
} from '@/modules/onboarding/store/use-onboarding-store';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

const enableMocks = process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const initializeForSession = useOnboardingStore((state) => state.initializeForSession);
  const {
    loginEmail,
    loginPhoneSendOtp,
    loginPhoneVerify,
    fetchMe,
    isLoginEmailPending,
    isLoginPhoneSendOtpPending,
    isLoginPhoneVerifyPending,
    loginEmailError,
    loginPhoneError
  } = useAuth();
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState(enableMocks ? 'buyer@vendora.app' : '');
  const [password, setPassword] = useState(enableMocks ? 'password123' : '');
  const [phone, setPhone] = useState(enableMocks ? '+2348012340000' : '');
  const [otp, setOtp] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [challengeNote, setChallengeNote] = useState<string>('');

  const finalizeLogin = async (session: Awaited<ReturnType<typeof loginEmail>>) => {
    initializeForSession(session);
    await fetchMe().catch(() => null);
    const destination =
      redirectTo ||
      getAuthenticatedLandingRoute(
        session,
        selectOnboardingSnapshot(useOnboardingStore.getState())
      );

    router.push((destination ?? '/home') as Route);
    router.refresh();
  };

  const activeError = activeTab === 'email' ? loginEmailError : loginPhoneError;

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'email' | 'phone')}>
      <TabsList className="w-full">
        <TabsTrigger value="email" className="flex-1">
          Email login
        </TabsTrigger>
        <TabsTrigger value="phone" className="flex-1">
          Phone OTP
        </TabsTrigger>
      </TabsList>

      <TabsContent value="email">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void (async () => {
              const session = await loginEmail({
                email,
                password
              });
              await finalizeLogin(session);
            })();
          }}
        >
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <div className="space-y-1.5">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className="flex justify-end">
              <Link
                href={routes.auth.forgotPassword}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          {activeError ? <p className="text-sm text-danger-700">{activeError.message}</p> : null}
          <Button type="submit" width="full" loading={isLoginEmailPending}>
            Sign in
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="phone">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void (async () => {
              if (!challengeId) {
                const challenge = await loginPhoneSendOtp({ phone });
                setChallengeId(challenge.challengeId);
                setChallengeNote(
                  enableMocks
                    ? `Code sent to ${challenge.maskedDestination}. Use 123456 while mocks are enabled.`
                    : `Code sent to ${challenge.maskedDestination}.`
                );
                return;
              }

              const session = await loginPhoneVerify({
                phone,
                challengeId,
                otp
              });
              await finalizeLogin(session);
            })();
          }}
        >
          <Input
            label="Phone number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={Boolean(challengeId)}
          />
          {challengeId ? (
            <Input
              label="One-time passcode"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              helperText={challengeNote}
            />
          ) : null}
          {activeError ? <p className="text-sm text-danger-700">{activeError.message}</p> : null}
          <div className="flex gap-3">
            {challengeId ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setChallengeId(null);
                  setOtp('');
                  setChallengeNote('');
                }}
              >
                Change phone
              </Button>
            ) : null}
            <Button
              type="submit"
              width="full"
              loading={challengeId ? isLoginPhoneVerifyPending : isLoginPhoneSendOtpPending}
            >
              {challengeId ? 'Verify and continue' : 'Send OTP'}
            </Button>
          </div>
        </form>
      </TabsContent>
      <p className="mt-8 text-center text-sm text-secondary-600/80">
        Don&apos;t have an account?{' '}
        <Link
          href={routes.auth.signup}
          className="font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline"
        >
          Create account
        </Link>
      </p>
    </Tabs>
  );
}
