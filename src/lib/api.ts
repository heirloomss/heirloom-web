'use client';

import { auth, BASE_URL } from '@/services/api-client';

/**
 * Helpers that don't fit the JSON api-client: multipart uploads and the
 * Stellar account connection. Everything fails softly for local demo mode.
 */

/** Upload a document to the Digital Archive as multipart form-data. */
export async function uploadDocument(
  title: string,
  category: string,
  file?: File,
): Promise<unknown> {
  const form = new FormData();
  form.set('title', title);
  form.set('category', category);
  if (file) form.set('file', file);

  const token = auth.getToken();
  const res = await fetch(`${BASE_URL}/archive`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

/** Connect or clear the Stellar account shown as "Connected Account". */
export async function linkWallet(walletAddress: string): Promise<unknown> {
  const token = auth.getToken();
  const res = await fetch(`${BASE_URL}/auth/link-wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ walletAddress }),
  });
  if (!res.ok) throw new Error('Could not connect account');
  return res.json();
}

export async function unlinkWallet(): Promise<unknown> {
  const token = auth.getToken();
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ walletAddress: null }),
  });
  if (!res.ok) throw new Error('Could not disconnect account');
  return res.json();
}
