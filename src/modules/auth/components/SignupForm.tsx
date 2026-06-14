'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

const enableMocks = process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true';

export function SignupForm() {
  const router = useRouter();
  const initializeForSession = useOnboardingStore((state) => state.initializeForSession);
  const {
    signupEmail,
    signupPhoneSendOtp,
    signupPhoneVerify,
    fetchMe,
    isSignupEmailPending,
    isSignupPhoneSendOtpPending,
    isSignupPhoneVerifyPending,
    signupEmailError,
    signupPhoneError
  } = useAuth();
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [fullName, setFullName] = useState(enableMocks ? 'Amina Balogun' : '');
  const [email, setEmail] = useState(enableMocks ? 'newbuyer@vendora.app' : '');
  const [password, setPassword] = useState(enableMocks ? 'password123' : '');
  const [phone, setPhone] = useState(enableMocks ? '+2348012341111' : '');
  const [otp, setOtp] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [challengeNote, setChallengeNote] = useState<string>('');

  const finalizeSignup = async (session: Awaited<ReturnType<typeof signupEmail>>) => {
    initializeForSession(session);
    await fetchMe().catch(() => null);
    router.push(routes.onboarding.profile as Route);
    router.refresh();
  };

  const activeError = activeTab === 'email' ? signupEmailError : signupPhoneError;

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'email' | 'phone')}>
      <TabsList className="w-full">
        <TabsTrigger value="email" className="flex-1">
          Email signup
        </TabsTrigger>
        <TabsTrigger value="phone" className="flex-1">
          Phone signup
        </TabsTrigger>
      </TabsList>

      <TabsContent value="email">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void (async () => {
              const session = await signupEmail({
                fullName,
                email,
                password
              });
              await finalizeSignup(session);
            })();
          }}
        >
          <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {activeError ? <p className="text-sm text-danger-700">{activeError.message}</p> : null}
          <Button type="submit" width="full" loading={isSignupEmailPending}>
            Create account
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
                const challenge = await signupPhoneSendOtp({ phone });
                setChallengeId(challenge.challengeId);
                setChallengeNote(
                  enableMocks
                    ? `Code sent to ${challenge.maskedDestination}. Use 123456 while mocks are enabled.`
                    : `Code sent to ${challenge.maskedDestination}.`
                );
                return;
              }

              const session = await signupPhoneVerify({
                phone,
                challengeId,
                otp
              });
              await finalizeSignup(session);
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
              loading={challengeId ? isSignupPhoneVerifyPending : isSignupPhoneSendOtpPending}
            >
              {challengeId ? 'Verify and continue' : 'Send OTP'}
            </Button>
          </div>
        </form>
      </TabsContent>
      <p className="mt-8 text-center text-sm text-secondary-600/80">
        Already have an account?{' '}
        <Link
          href={routes.auth.login}
          className="font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </Tabs>
  );
}
