import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function handler(req) {
  const cookieStore = cookies();
  const token = cookieStore.get('renderly_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path') ?? '';

  const fetchOptions = {
    method: req.method,
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    cache: 'no-store',
  };
  if (req.method !== 'GET' && req.method !== 'DELETE') {
    try { fetchOptions.body = await req.text(); } catch {}
  }

  const res  = await fetch(`${API}/v1/dashboard/${path}`, fetchOptions);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export { handler as GET, handler as POST, handler as DELETE };
