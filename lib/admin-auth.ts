import { timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

const COOKIE_NAME = 'vcs_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

export function attachSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
}

export function clearSessionCookieOnResponse(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', { ...sessionCookieOptions(), maxAge: 0 });
}

function base64(value: string): string {
  return Buffer.from(value, 'utf-8').toString('base64url')
}

function fromBase64(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf-8')
}

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASS ||
    'vcs-dev-secret-change-me'
  )
}

async function hmac(value: string): Promise<string> {
  const secret = getSecret()
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return Buffer.from(sig).toString('base64url')
}

export interface AdminCredentials {
  user: string
  pass: string
}

export function getAdminCredentials(): AdminCredentials | null {
  const user = process.env.ADMIN_USER?.trim();
  const pass = process.env.ADMIN_PASS;
  if (!user || !pass) return null;
  return { user, pass };
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) {
    if (left.length > 0) timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function verifyCredentials(user: string, pass: string): boolean {
  const creds = getAdminCredentials();
  if (!creds) return false;
  return safeEqual(user.trim(), creds.user) && safeEqual(pass, creds.pass);
}

export async function createSessionToken(user: string): Promise<string> {
  const payload = JSON.stringify({
    user,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  })
  const payloadB64 = base64(payload)
  const sig = await hmac(payloadB64)
  return `${payloadB64}.${sig}`
}

export async function verifySessionToken(
  token: string | undefined
): Promise<{ user: string } | null> {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadB64, sig] = parts
  const expectedSig = await hmac(payloadB64)
  if (expectedSig !== sig) return null
  try {
    const payload = JSON.parse(fromBase64(payloadB64)) as {
      user: string
      exp: number
    }
    if (payload.exp < Date.now()) return null
    return { user: payload.user }
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, sessionCookieOptions());
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function getCurrentAdmin(): Promise<{ user: string } | null> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  return verifySessionToken(token)
}

export function getSessionCookieName(): string {
  return COOKIE_NAME
}
