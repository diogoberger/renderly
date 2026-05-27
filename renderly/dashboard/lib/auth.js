'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-in-production'
);
const COOKIE = 'renderly_session';
const EXPIRES = 60 * 60 * 24 * 7; // 7 days

export async function createSession(user) {
  const token = await new SignJWT({ id: user.id, email: user.email, plan: user.plan })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${EXPIRES}s`)
    .sign(SECRET);

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   EXPIRES,
    path:     '/',
  });
}

export async function getSession() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function clearSession() {
  cookies().delete(COOKIE);
}
