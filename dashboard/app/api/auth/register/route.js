import { NextResponse } from 'next/server';
import { createSession } from '../../../../lib/auth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function POST(req) {
  const body = await req.json();
  const res  = await fetch(`${API}/v1/auth/register`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.error?.message }, { status: res.status });

  await createSession(data.user);
  return NextResponse.json({ ok: true, api_key: data.api_key });
}
