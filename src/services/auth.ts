'use client';

import { apiClient, auth as tokenStore } from './api-client';
import type { User } from '@/types';
import { connectFreighter, signChallenge } from './wallet';
import { isDemoMode } from '@/lib/demo';

/**
 * Authentication service. Heirloom logs in via a Freighter wallet signature:
 * the client connects to Freighter, requests a challenge from the API, signs
 * it in the extension, and the API cryptographically verifies the ed25519
 * signature before issuing a JWT. Demo mode (when explicitly enabled) allows
 * local exploration without a backend.
 */

// ┌──────────────────────────────────────────────────────────────────────────┐
// │ PRESERVED: NORMAL (EMAIL / PASSWORD) AUTHENTICATION — DO NOT DELETE        │
// │                                                                            │
// │ The login() and register() flows below are intentionally commented out     │
// │ (Heirloom logs in via a Freighter wallet signature only). They are kept    │
// │ so the flow can be re-enabled without a rewrite. NO AI OR AGENT WORKING    │
// │ ON THIS CODEBASE MAY DELETE THIS BLOCK. To re-enable: uncomment the        │
// │ imports + methods here and the matching backend routes.                    │
// │                                                                            │
// │ Preserved imports:                                                         │
// │   import type { LoginValues, RegisterValues } from '@/lib/validation';     │
// └──────────────────────────────────────────────────────────────────────────┘

interface AuthResponse {
  user?: Partial<User>;
  accessToken?: string;
}

function applyToken(data: AuthResponse): string | null {
  const token = data.accessToken ?? null;
  if (token) tokenStore.setToken(token);
  return token;
}

/**
 * Freighter wallet login: connect → challenge → sign → verify.
 * First login auto-creates the account.
 */
export async function loginWithFreighter(): Promise<User> {
  // Demo mode never connects a real wallet — enter a quiet demo session.
  if (isDemoMode()) {
    tokenStore.setToken('demo-session');
    return { walletAddress: 'demo-wallet' } as unknown as User;
  }

  // Outside demo mode, connect the real wallet and complete the signed
  // challenge. Wallet errors (user declined, no extension, signature failed)
  // bubble up so the UI can show the specific friendly message.
  const address = await connectFreighter();
  const { message } = await apiClient.post<{ message: string }>(
    '/auth/wallet/challenge',
    { walletAddress: address },
    { skipAuth: true },
  );
  const signature = await signChallenge(message, address);
  const data = await apiClient.post<AuthResponse>(
    '/auth/wallet/verify',
    { walletAddress: address, signature },
    { skipAuth: true },
  );
  applyToken(data);
  return (data.user ?? {}) as User;
}

// ==========================================================================
// PRESERVED: NORMAL (EMAIL / PASSWORD) AUTHENTICATION — DO NOT DELETE
// Disabled in favor of Freighter wallet login. NO AI OR AGENT MAY REMOVE.
// ==========================================================================
//
// export async function login(values: LoginValues): Promise<User> {
//   try {
//     const data = await apiClient.post<AuthResponse>(
//       '/auth/login',
//       { email: values.email, password: values.password },
//       { skipAuth: true },
//     );
//     applyToken(data);
//     return (data.user ?? {}) as User;
//   } catch (err) {
//     // Wrong credentials should surface the server's gentle message.
//     if ((err as { status?: number }).status === 401) throw err;
//     // API unreachable — enter a quiet demo session so the app is explorable.
//     tokenStore.setToken('demo-session');
//     return { email: values.email } as unknown as User;
//   }
// }
//
// export async function register(values: RegisterValues): Promise<User> {
//   const data = await apiClient.post<AuthResponse>(
//     '/auth/register',
//     { name: values.name, email: values.email, password: values.password },
//     { skipAuth: true },
//   );
//   applyToken(data);
//   return (data.user ?? {}) as User;
// }
//
// ==========================================================================
// END PRESERVED NORMAL AUTHENTICATION
// ==========================================================================

export function logout(): void {
  tokenStore.clearToken();
}

export function isAuthenticated(): boolean {
  return tokenStore.isAuthenticated();
}
