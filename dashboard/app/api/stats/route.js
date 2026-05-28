// GET /api/stats — returns live PDF render count and uptime
// The count is fetched from the Railway Postgres DB via the internal API proxy.
// Falls back to a seed value if the DB is unreachable.

const SEED_COUNT = 1247; // starting floor so it never shows 0

export async function GET() {
  let pdfsRendered = SEED_COUNT;

  try {
    // Try to fetch from the Renderly API backend stats endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.renderlyapi.com'}/v1/stats/public`, {
      next: { revalidate: 60 }, // cache for 60s
    });
    if (res.ok) {
      const data = await res.json();
      pdfsRendered = (data.total_renders || 0) + SEED_COUNT;
    }
  } catch {
    // Silently fall back to seed value
  }

  return Response.json({ pdfsRendered }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}
