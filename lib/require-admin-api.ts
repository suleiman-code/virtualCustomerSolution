import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSessionCookieName, verifySessionToken } from '@/lib/admin-auth';

export type AdminApiOk = { ok: true; user: string };
export type AdminApiFail = { ok: false; response: NextResponse };

export async function requireAdminApi(): Promise<AdminApiOk | AdminApiFail> {
  const store = await cookies();
  const token = store.get(getSessionCookieName())?.value;
  const admin = await verifySessionToken(token);
  if (!admin) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { ok: true, user: admin.user };
}
