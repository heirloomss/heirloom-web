'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormSubmit } from '@/components/forms/FormSubmit';
import { loginSchema, type LoginValues } from '@/lib/validation';
import { login } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    try {
      await login(values);
      router.push('/dashboard');
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'We couldn’t sign you in right now. Please try again in a moment.',
      );
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Your legacy is safe. Sign in to continue.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          autoFocus
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {serverError ? (
          <p role="alert" className="text-sm text-error">
            {serverError}
          </p>
        ) : null}
        <FormSubmit loading={isSubmitting} size="lg" className="w-full">
          Sign in
        </FormSubmit>
      </form>

      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-ink/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest text-ink-faint">
          <span className="bg-cotton px-3 font-semibold">Web3 Native</span>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="stellar" size="lg" className="w-full font-semibold" onClick={() => router.push('/dashboard')}>
          <Wallet className="h-5 w-5" aria-hidden />
          Connect Freighter
        </Button>
      </div>
      <p className="mt-6 text-center text-sm text-ink-soft">
        New to Heirloom?{' '}
        <Link href="/register" className="font-medium text-moss-deep underline-offset-4 hover:underline">
          Begin your legacy
        </Link>
      </p>
    </div>
  );
}
