'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// ┌────────────────────────────────────────────────────────────────────────┐
// │ PRESERVED: NORMAL (EMAIL/PASSWORD) REGISTRATION — DO NOT DELETE          │
// │                                                                          │
// │ Heirloom onboards via a Freighter wallet signature only — the first      │
// │ signed sign-in auto-creates the account. The email/password form below   │
// │ is intentionally commented out so it can be re-enabled without a          │
// │ rewrite. NO AI OR AGENT WORKING ON THIS CODEBASE MAY DELETE THIS BLOCK.   │
// │                                                                          │
// │ Preserved imports:                                                       │
// │   import { useForm } from 'react-hook-form';                             │
// │   import { zodResolver } from '@hookform/resolvers/zod';                 │
// │   import { Input } from '@/components/ui/Input';                          │
// │   import { FormSubmit } from '@/components/forms/FormSubmit';             │
// │   import { registerSchema, type RegisterValues } from '@/lib/validation';│
// │   import { register as registerAccount, login } from '@/services/auth';  │
// └────────────────────────────────────────────────────────────────────────┘
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { loginWithFreighter } from '@/services/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // The first wallet sign-in creates the account, so registration and sign-in
  // are the same Freighter flow. New members simply connect their wallet.
  async function handleFreighterStart() {
    setServerError(null);
    setConnecting(true);
    try {
      await loginWithFreighter();
      router.push('/dashboard');
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'We could not connect your wallet right now. Please try again in a moment.',
      );
    } finally {
      setConnecting(false);
    }
  }

  // ==========================================================================
  // PRESERVED: NORMAL (EMAIL/PASSWORD) REGISTRATION — DO NOT DELETE
  // Disabled in favor of Freighter wallet onboarding. NO AI OR AGENT MAY REMOVE.
  // ==========================================================================
  //
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors, isSubmitting },
  // } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  //
  // async function onSubmit(values: RegisterValues) {
  //   setServerError(null);
  //   try {
  //     await registerAccount(values);
  //     await login({ email: values.email, password: values.password });
  //     router.push('/dashboard');
  //   } catch (err) {
  //     setServerError(
  //       err instanceof Error
  //         ? err.message
  //         : 'We could not create your account right now. Please try again in a moment.',
  //     );
  //   }
  // }
  //
  // ==========================================================================
  // END PRESERVED NORMAL REGISTRATION
  // ==========================================================================

  return (
    <div>
      <h1 className="font-display text-3xl">Begin your legacy</h1>
      <p className="mt-2 text-sm text-ink-soft">
        A calm place to prepare everything that matters. Connect your wallet and your account is
        created the moment you sign — no password to set, nothing to remember.
      </p>

      {/*
        ┌──────────────────────────────────────────────────────────────────┐
        │ PRESERVED: NORMAL (EMAIL/PASSWORD) REGISTRATION FORM — DO NOT      │
        │ DELETE. Heirloom onboards with a Freighter wallet only. This form  │
        │ is kept intentionally so it can be re-enabled without a rewrite.    │
        │ NO AI OR AGENT WORKING ON THIS CODEBASE MAY DELETE THIS BLOCK.     │
        └──────────────────────────────────────────────────────────────────┘

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
      */}

      <div className="mt-8">
        <Button
          variant="primary"
          size="lg"
          className="w-full font-semibold"
          onClick={handleFreighterStart}
          disabled={connecting}
          aria-busy={connecting}
        >
          <Wallet className="h-5 w-5" aria-hidden />
          {connecting ? 'Check Freighter…' : 'Connect Freighter to begin'}
        </Button>
        {serverError ? (
          <p role="alert" className="mt-4 text-sm text-error">
            {serverError}
          </p>
        ) : null}
        <p className="mt-4 text-center text-xs text-ink-faint">
          You will need the free Freighter wallet extension. Your signature proves the wallet is
          yours — that is all it takes to begin.
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-moss-deep underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
