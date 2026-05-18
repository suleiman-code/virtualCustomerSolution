import { NextResponse } from 'next/server';
import { z } from 'zod/v4';
import {
  attachSessionCookie,
  createSessionToken,
  getAdminCredentials,
  verifyCredentials,
} from '@/lib/admin-auth';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';

const loginSchema = z.object({
  user: z.string().min(1).max(200),
  pass: z.string().min(1).max(500),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const isDev = process.env.NODE_ENV === 'development';
    const max = isDev ? 80 : 25;
    const windowMs = isDev ? 10 * 60 * 1000 : 15 * 60 * 1000;
    const { success } = await rateLimit(ip, 'admin-login', max, windowMs);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Try again later.' },
        { status: 429 }
      );
    }

    const creds = getAdminCredentials();
    if (!creds) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Admin credentials not configured. Set ADMIN_USER and ADMIN_PASS in environment.',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input.' },
        { status: 400 }
      );
    }

    const { user, pass } = parsed.data;
    if (!verifyCredentials(user, pass)) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const token = await createSessionToken(user);
    const response = NextResponse.json({ success: true });
    attachSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error('[backoffice/login] error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed.' },
      { status: 500 }
    );
  }
}
