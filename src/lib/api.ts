'use client';

import { auth, BASE_URL } from '@/services/api-client';
import { documentCategoryToApi, messageTypeToApi, releaseRuleToApi } from '@/lib/mappers';
import type { Message, MessageType, ReleaseRule } from '@/types';

/**
 * Helpers that don't fit the JSON api-client: multipart uploads and the
 * Stellar account connection.
 */

function authHeader(): HeadersInit {
  const token = auth.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Upload a document to the Digital Archive as multipart form-data. */
export async function uploadDocument(
  title: string,
  category: string,
  file?: File,
): Promise<unknown> {
  const form = new FormData();
  form.set('title', title);
  form.set('category', documentCategoryToApi(category));
  if (file) form.set('file', file);

  const res = await fetch(`${BASE_URL}/archive`, {
    method: 'POST',
    headers: authHeader(),
    body: form,
  });
  if (!res.ok) throw new Error('We couldn’t file that just now. Please try again in a moment.');
  return res.json();
}

/** Create a memory — JSON for letters, multipart when a recording is attached. */
export async function createMessage(input: {
  title: string;
  type: MessageType;
  recipientId?: string;
  releaseRule: ReleaseRule;
  body?: string;
  file?: File;
}): Promise<Message> {
  const headers = authHeader();
  if (input.file) {
    const form = new FormData();
    form.set('title', input.title);
    form.set('type', messageTypeToApi(input.type));
    if (input.recipientId) form.set('recipientId', input.recipientId);
    form.set('releaseRule', JSON.stringify(releaseRuleToApi(input.releaseRule)));
    if (input.body) form.set('content', input.body);
    form.set('file', input.file);
    const res = await fetch(`${BASE_URL}/messages`, { method: 'POST', headers, body: form });
    if (!res.ok) throw new Error('We couldn’t save that memory just now. Please try again.');
    return res.json() as Promise<Message>;
  }

  const res = await fetch(`${BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({
      title: input.title,
      type: messageTypeToApi(input.type),
      recipientId: input.recipientId || undefined,
      content: input.body,
      releaseRule: releaseRuleToApi(input.releaseRule),
    }),
  });
  if (!res.ok) throw new Error('We couldn’t save that memory just now. Please try again.');
  return res.json() as Promise<Message>;
}

export function messageMediaUrl(id: string): string {
  return `${BASE_URL}/messages/${id}/media`;
}

export function archiveDownloadUrl(id: string): string {
  return `${BASE_URL}/archive/${id}/download`;
}

export function capsuleDocumentUrl(token: string, id: string): string {
  return `${BASE_URL}/claim/${token}/documents/${id}/download`;
}

export function capsuleMessageMediaUrl(token: string, id: string): string {
  return `${BASE_URL}/claim/${token}/messages/${id}/media`;
}

/** Fetch a protected blob (archive / media) with the session token. */
export async function fetchAuthedBlob(url: string): Promise<Blob> {
  const res = await fetch(url, { headers: authHeader() });
  if (!res.ok) throw new Error('We couldn’t open that file just now.');
  return res.blob();
}

/** Connect or clear the Stellar account shown as "Connected Account". */
export async function linkWallet(walletAddress: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/auth/link-wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify({ walletAddress }),
  });
  if (!res.ok) throw new Error('Could not connect account');
  return res.json();
}

export async function unlinkWallet(): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify({ walletAddress: null }),
  });
  if (!res.ok) throw new Error('Could not disconnect account');
  return res.json();
}
