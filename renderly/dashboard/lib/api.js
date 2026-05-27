// Client-side helpers to call the Renderly API from the dashboard.
// All calls include the user's session token which the server-side actions pass through.

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? 'API error');
  return data;
}
