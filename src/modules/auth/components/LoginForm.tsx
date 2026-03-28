'use client';

import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ZodIssue } from 'zod';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { getAuthenticatedLandingRoute } from '@/modules/onboarding/lib/onboarding';
import {
  selectOnboardingSnapshot,
  useOnboardingStore
} from '@/modules/onboarding/store/use-onboarding-store';
import { loginSchema, requestOtpSchema } from '@/modules/auth/services/auth-service';
import type { LoginInput, OtpChallenge, RequestOtpInput } from '@/modules/auth/types';
import { routes } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface LoginFormValues {
  identifier: string;
  otp: string;
}

function getFieldError(issues: ZodIssue[], field: keyof LoginInput | keyof RequestOtpInput) {
  return issues.find((issue) => issue.path[0] === field)?.message;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const {
    requestOtp,
    login,
    isRequestOtpPending,
    isLoginPending,
    requestOtpError,
    loginError
  } = useAuth();
  const initializeForSession = useOnboardingStore((state) => state.initializeForSession);
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<LoginFormValues>({
    defaultValues: {
      identifier: '',
      otp: ''
    }
  });

  useEffect(() => {
    if (!challenge) {
      setCountdown(0);
      return;
    }

    const updateCountdown = () => {
      setCountdown(Math.max(Math.ceil((Date.parse(challenge.resendAvailableAt) - Date.now()) / 1000), 0));
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [challenge]);

  const handleSuccessfulLogin = async (payload: LoginInput) => {
    const session = await login(payload);
    initializeForSession(session);
    const destination =
      redirectTo || getAuthenticatedLandingRoute(session, selectOnboardingSnapshot(useOnboardingStore.getState()));

    router.push((destination || routes.buyer.home) as Route);
    router.refresh();
  };

  const handleRequestOtp = async () => {
    const values = form.getValues();
    const parsed = requestOtpSchema.safeParse({
      identifier: values.identifier
    });

    if (!parsed.success) {
      form.setError('identifier', {
        message: getFieldError(parsed.error.issues, 'identifier')
      });
      return;
    }

    form.clearErrors('identifier');
    const response = await requestOtp(parsed.data);
    setChallenge(response.challenge);
    form.setFocus('otp');
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!challenge) {
      await handleRequestOtp();
      return;
    }

    const parsed = loginSchema.safeParse({
      ...values,
      challengeId: challenge.challengeId
    });

    if (!parsed.success) {
      form.setError('identifier', {
        message: getFieldError(parsed.error.issues, 'identifier')
      });
      form.setError('otp', {
        message: getFieldError(parsed.error.issues, 'otp')
      });
      return;
    }

    form.clearErrors();
    await handleSuccessfulLogin(parsed.data);
  });

  const identifierField = form.register('identifier');
  const otpField = form.register('otp');
  const activeError = challenge ? loginError : requestOtpError;

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <Input
        label="Email or phone"
        placeholder="vendor@vendora.app"
        autoComplete="username"
        disabled={Boolean(challenge)}
        error={form.formState.errors.identifier?.message}
        {...identifierField}
      />

      {challenge ? (
        <>
          <Input
            label="One-time passcode"
            placeholder="123456"
            inputMode="numeric"
            autoComplete="one-time-code"
            helperText={`Code sent via ${challenge.channel} to ${challenge.maskedDestination}.`}
            error={form.formState.errors.otp?.message}
            {...otpField}
          />
          <div className="flex items-center justify-between gap-3 text-sm">
            <button
              type="button"
              className="text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              disabled={countdown > 0 || isRequestOtpPending}
              onClick={() => {
                void handleRequestOtp();
              }}
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
            </button>
            <button
              type="button"
              className="text-primary-700 transition hover:text-primary-800"
              onClick={() => {
                setChallenge(null);
                form.setValue('otp', '');
                form.clearErrors();
              }}
            >
              Use a different identifier
            </button>
          </div>
        </>
      ) : null}

      {activeError ? <p className="text-sm text-danger-700">{activeError.message}</p> : null}

      <Button type="submit" width="full" loading={challenge ? isLoginPending : isRequestOtpPending}>
        {challenge ? 'Continue' : 'Send code'}
      </Button>
    </form>
  );
}
