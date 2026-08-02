'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { FormSubmit } from '@/components/forms/FormSubmit';
import { registerSchema, type RegisterValues } from '@/lib/validation';
import { register as registerAccount, login } from '@/services/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterValues) {
    setServerError(null);
    try {
      await registerAccount(values);
      await login({ email: values.email, password: values.password });
      router.push('/dashboard');
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'We couldn’t create your account right now. Please try again in a moment.',
      );
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Begin your legacy</h1>
      <p className="mt-2 text-sm text-ink-soft">
        A calm place to prepare everything that matters. It only takes a minute.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <Input
          label="Full name"
          autoComplete="name"
          autoFocus
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters."
          error={errors.password?.message}
          {...register('password')}
        />
        {serverError ? (
          <p role="alert" className="text-sm text-error">
            {serverError}
          </p>
        ) : null}
        <FormSubmit loading={isSubmitting} size="lg" className="w-full">
          Create my account
        </FormSubmit>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-moss-deep underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
