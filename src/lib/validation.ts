import { z } from 'zod';
import { ASSET_CODES, DOCUMENT_CATEGORIES, MESSAGE_TYPES, RELATIONSHIPS, RELEASE_RULES } from '@/types';

/**
 * Zod schemas — gentle, complete validation with warm error messages.
 * Every message avoids blame and explains how to fix things.
 */

/** A Stellar account id: 56 characters starting with "G". Optional where used. */
export const walletSchema = z
  .string()
  .refine((v) => v === '' || /^G[A-Z2-7]{55}$/.test(v), {
    message:
      'That account address doesn’t look quite right. It should begin with a G and be 56 characters long.',
  });

const relationshipEnum = z.enum(RELATIONSHIPS as [string, ...string[]]);

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email address.')
    .email('That email address doesn’t look quite right.'),
  password: z.string().min(1, 'Please enter your password.'),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, 'Please tell us your name.'),
  email: z
    .string()
    .min(1, 'Please enter your email address.')
    .email('That email address doesn’t look quite right.'),
  password: z.string().min(8, 'Please choose a password of at least 8 characters.'),
});
export type RegisterValues = z.infer<typeof registerSchema>;

export const beneficiarySchema = z.object({
  name: z.string().min(1, 'Please enter their full name.'),
  relationship: relationshipEnum,
  email: z
    .string()
    .min(1, 'Please enter an email address.')
    .email('That email address doesn’t look quite right.'),
  phone: z.string(),
  walletAddress: walletSchema,
  allocationPercentage: z.coerce
    .number({ invalid_type_error: 'Please enter a number between 0 and 100.' })
    .min(0, 'Please enter a number between 0 and 100.')
    .max(100, 'Please enter a number between 0 and 100.'),
});
export type BeneficiaryValues = z.infer<typeof beneficiarySchema>;

export const guardianInviteSchema = z.object({
  name: z.string().min(1, 'Please enter their full name.'),
  relationship: relationshipEnum,
  email: z
    .string()
    .min(1, 'Please enter an email address.')
    .email('That email address doesn’t look quite right.'),
  walletAddress: walletSchema,
});
export type GuardianInviteValues = z.infer<typeof guardianInviteSchema>;

export const protectAssetSchema = z.object({
  label: z.string().min(1, 'Please give this a name you will recognize.'),
  assetCode: z.enum(ASSET_CODES as [string, ...string[]]),
  amount: z.coerce
    .number({ invalid_type_error: 'Please enter an amount.' })
    .positive('Please enter an amount greater than zero.'),
});
export type ProtectAssetValues = z.infer<typeof protectAssetSchema>;

export const documentUploadSchema = z.object({
  title: z.string().min(1, 'Please give the document a name.'),
  category: z.enum(DOCUMENT_CATEGORIES as [string, ...string[]]),
});
export type DocumentUploadValues = z.infer<typeof documentUploadSchema>;

export const messageSchema = z.object({
  title: z.string().min(1, 'Please give this a title you will recognize.'),
  type: z.enum(MESSAGE_TYPES as [string, ...string[]]),
  recipientId: z.string(),
  releaseRule: z.enum(RELEASE_RULES as [string, ...string[]]),
  body: z.string(),
});
export type MessageValues = z.infer<typeof messageSchema>;
