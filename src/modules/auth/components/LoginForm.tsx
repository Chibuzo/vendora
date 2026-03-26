'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { loginSchema } from '@/modules/auth/services/auth-service';
import type { LoginInput } from '@/modules/auth/types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = (searchParams.get('redirectTo') ?? '/marketplace') as Route;
  const { login, isPending, error } = useAuth();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      otp: ''
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const session = await login(values);

    if (session.user.role === 'vendor') {
      router.push('/vendor/dashboard' as Route);
      return;
    }

    if (session.user.role === 'admin') {
      router.push('/admin/dashboard' as Route);
      return;
    }

    router.push(redirectTo);
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <Input
        label="Email or phone"
        placeholder="vendor@vendora.app"
        autoComplete="username"
        error={form.formState.errors.identifier?.message}
        {...form.register('identifier')}
      />
      <Input
        label="One-time passcode"
        placeholder="123456"
        inputMode="numeric"
        autoComplete="one-time-code"
        error={form.formState.errors.otp?.message}
        {...form.register('otp')}
      />
      {error ? <p className="text-sm text-danger-700">{error.message}</p> : null}
      <Button type="submit" width="full" loading={isPending}>
        Continue
      </Button>
    </form>
  );
}
