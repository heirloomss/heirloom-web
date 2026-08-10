'use client';

/**
 * Freighter wallet bridge for Heirloom.
 *
 * Every call lazily imports `@stellar/freighter-api` so the extension SDK — which
 * touches `window` — never executes during server rendering. Return shapes have
 * shifted across Freighter versions, so we normalize defensively: `connect`
 * accepts either a bare address string or `{ address, error }`, and `sign`
 * accepts a base64 string, a `Uint8Array`, or a serialized Buffer and always
 * returns base64 (which the API verifies with the Stellar public key).
 */

export class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletError';
  }
}

const NOT_INSTALLED =
  'We couldn’t find the Freighter wallet. Install it from freighter.app, then try again.';

async function freighter() {
  return import('@stellar/freighter-api');
}

/** True when the Freighter extension is available in this browser. */
export async function isFreighterAvailable(): Promise<boolean> {
  try {
    const api = await freighter();
    const res = await api.isConnected();
    return typeof res === 'boolean' ? res : Boolean(res?.isConnected);
  } catch {
    return false;
  }
}

/** Prompt Freighter for access and return the user's Stellar public key. */
export async function connectFreighter(): Promise<string> {
  if (!(await isFreighterAvailable())) throw new WalletError(NOT_INSTALLED);

  const api = await freighter();
  const res = await api.requestAccess();
  const address = typeof res === 'string' ? res : res?.address;
  const error = typeof res === 'string' ? undefined : res?.error;
  if (error) throw new WalletError(friendly(error));
  if (!address) {
    throw new WalletError(
      'No account was shared. Please approve the connection in Freighter.',
    );
  }
  return address;
}

/**
 * Ask Freighter to sign a transaction envelope and return the signed base64 XDR.
 *
 * The unsigned `xdr` and its `networkPassphrase` come straight from the API's
 * build step; `address` is the account expected to authorize it (owner,
 * guardian, or beneficiary). Return shapes vary across Freighter versions —
 * newer builds return `{ signedTxXdr, signerAddress }`, older ones a bare XDR
 * string, and some surface `{ error }` — so we normalize defensively and always
 * return the signed XDR the API relays via POST /legacy/submit.
 */
export async function signTransaction(
  xdr: string,
  opts: { networkPassphrase: string; address: string },
): Promise<string> {
  const api = await freighter();
  const res = await api.signTransaction(xdr, {
    networkPassphrase: opts.networkPassphrase,
    address: opts.address,
  });

  if (typeof res === 'string') return res;

  const error = (res as { error?: unknown })?.error;
  if (error) {
    throw new WalletError(friendly(typeof error === 'string' ? error : String(error)));
  }

  const signed =
    (res as { signedTxXdr?: string })?.signedTxXdr ??
    (res as { signedXDR?: string })?.signedXDR;
  if (typeof signed === 'string' && signed.length > 0) return signed;

  throw new WalletError('Freighter did not return a signed transaction. Please try again.');
}

/** Ask Freighter to sign `message`; returns the signature encoded as base64. */
export async function signChallenge(message: string, address: string): Promise<string> {
  const api = await freighter();
  const res = await api.signMessage(message, { address });
  const error =
    res && typeof res === 'object' ? (res as { error?: string }).error : undefined;
  if (error) throw new WalletError(friendly(error));
  const signed =
    typeof res === 'string' ? res : (res as { signedMessage?: unknown })?.signedMessage;
  return toBase64(signed);
}

function toBase64(value: unknown): string {
  if (value == null) {
    throw new WalletError('Freighter did not return a signature. Please try again.');
  }
  if (typeof value === 'string') return value; // already base64
  if (value instanceof Uint8Array) return bytesToBase64(value);
  // Some versions return a serialized Buffer: { type: 'Buffer', data: number[] }.
  const data = (value as { data?: unknown }).data;
  if (Array.isArray(data)) return bytesToBase64(Uint8Array.from(data as number[]));
  if (Array.isArray(value)) return bytesToBase64(Uint8Array.from(value as number[]));
  throw new WalletError('Freighter returned an unexpected signature format.');
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function friendly(error: string): string {
  if (/reject|denied|declined|cancel/i.test(error)) {
    return 'You declined the request in Freighter. Connect your wallet when you’re ready.';
  }
  return error;
}
