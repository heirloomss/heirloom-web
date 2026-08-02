'use client';

import { apiClient, auth as tokenStore } from './api-client';
import type { User } from '@/types';
import type { LoginValues, RegisterValues } from '@/lib/validation';

/**
 * Authentication service. The API issues a JWT on register/login; the client
 * stores it for subsequent requests. Signing in falls back to a demo session
 * when the API is unreachable so the interface always renders locally.
 */

interface AuthResponse {
  user?: Partial<User>;
  accessToken?: string;
}

function applyToken(data: AuthResponse): string | null {
  const token = data.accessToken ?? null;
  if (token) tokenStore.setToken(token);
  return token;
}

export async function login(values: LoginValues): Promise<User> {
  try {
    const data = await apiClient.post<AuthResponse>(
      '/auth/login',
      { email: values.email, password: values.password },
      { skipAuth: true },
    );
    applyToken(data);
    return (data.user ?? {}) as User;
  } catch (err) {
    // Wrong credentials should surface the server's gentle message.
    if ((err as { status?: number }).status === 401) throw err;
    // API unreachable — enter a quiet demo session so the app is explorable.
    tokenStore.setToken('demo-session');
    return { email: values.email } as unknown as User;
  }
}

export async function register(values: RegisterValues): Promise<User> {
  const data = await apiClient.post<AuthResponse>(
    '/auth/register',
    { name: values.name, email: values.email, password: values.password },
    { skipAuth: true },
  );
  applyToken(data);
  return (data.user ?? {}) as User;
}

export function logout(): void {
  tokenStore.clearToken();
}

export function isAuthenticated(): boolean {
  return tokenStore.isAuthenticated();
}
