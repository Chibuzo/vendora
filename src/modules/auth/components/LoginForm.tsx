'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { loginSchema } from '@/modules/auth/services/auth-service';
import type { LoginInput } from '@/modules/auth/types';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/marketplace';
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
      router.push('/vendor/dashboard');
      return;
    }

    if (session.user.role === 'admin') {
      router.push('/admin/dashboard');
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
      {error ? <p className="text-sm text-red-600">{error.message}</p> : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
        Continue
      </Button>
    </form>
  );
}
