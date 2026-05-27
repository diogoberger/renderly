import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getUsageAndKeys(apiKeyHeader) {
  const [usageRes, keysRes] = await Promise.all([
    fetch(`${API}/v1/usage`, { headers: { Authorization: apiKeyHeader }, cache: 'no-store' }),
    fetch(`${API}/v1/keys`,  { headers: { Authorization: apiKeyHeader }, cache: 'no-store' }),
  ]);
  const usage = usageRes.ok ? await usageRes.json() : null;
  const keys  = keysRes.ok  ? await keysRes.json()  : { keys: [] };
  return { usage, keys: keys.keys ?? [] };
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  // Note: server-side data fetch needs the user's API key.
  // For the dashboard overview we show plan info from the session (no key needed).
  // Full usage data requires their API key — shown via client component below.
  const plan = session.plan ?? 'free';

  const planLabels = { free:'Free', starter:'Starter', pro:'Pro', scale:'Scale' };
  const planLimits = { free:50, starter:500, pro:2000, scale:10000 };

  return (
    <div style={{ minHeight:'100vh', background:'var(--grey-bg)' }}>
      {/* Nav */}
      <nav style={{ background:'#fff', borderBottom:'1px solid var(--grey-border)', padding:'0 2rem', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontWeight:700, fontSize:18, color:'var(--blue)' }}>Renderly</span>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:13, color:'var(--text-muted)' }}>{session.email}</span>
          <a href="/auth/logout" style={{ fontSize:13, color:'var(--text-muted)' }}>Sign out</a>
        </div>
      </nav>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
          <h1 style={{ fontSize:22, fontWeight:600 }}>Dashboard</h1>
          <span className={`badge badge-${plan}`}>{planLabels[plan]} plan</span>
        </div>

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:12, marginBottom:'2rem' }}>
          {[
            { label:'Plan', value: planLabels[plan] },
            { label:'Monthly limit', value: planLimits[plan].toLocaleString() + ' PDFs' },
            { label:'Resets', value: getResetDate() },
          ].map(({ label, value }) => (
            <div key={label} style={{ background:'#fff', border:'1px solid var(--grey-border)', borderRadius:'var(--radius)', padding:'1rem' }}>
              <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:4 }}>{label}</p>
              <p style={{ fontSize:20, fontWeight:600 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Navigation links */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:12, marginBottom:'2rem' }}>
          <a href="/dashboard/keys" style={{ textDecoration:'none' }}>
            <div className="card" style={{ cursor:'pointer', transition:'border-color .15s' }}>
              <p style={{ fontWeight:600, marginBottom:4 }}>API Keys</p>
              <p style={{ fontSize:13, color:'var(--text-muted)' }}>View, create, and revoke your API keys</p>
            </div>
          </a>
          <a href="/pricing" style={{ textDecoration:'none' }}>
            <div className="card" style={{ cursor:'pointer' }}>
              <p style={{ fontWeight:600, marginBottom:4 }}>Upgrade plan</p>
              <p style={{ fontSize:13, color:'var(--text-muted)' }}>More PDFs, higher limits, priority rendering</p>
            </div>
          </a>
          <a href="https://docs.renderly.dev" target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}>
            <div className="card" style={{ cursor:'pointer' }}>
              <p style={{ fontWeight:600, marginBottom:4 }}>Documentation</p>
              <p style={{ fontSize:13, color:'var(--text-muted)' }}>API reference, quickstart, code examples</p>
            </div>
          </a>
        </div>

        {/* Quick-start snippet */}
        <div className="card">
          <p style={{ fontWeight:600, marginBottom:12 }}>Quick start</p>
          <pre style={{ background:'#0F172A', color:'#E2E8F0', borderRadius:'var(--radius)', padding:'1rem', fontSize:12, overflowX:'auto', lineHeight:1.7 }}>
{`curl -X POST https://api.renderly.dev/v1/pdf/from-html \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"html":"<h1>Hello, Renderly!</h1>"}' \\
  --output hello.pdf`}
          </pre>
          <p style={{ marginTop:12, fontSize:13, color:'var(--text-muted)' }}>
            Full API reference → <a href="https://docs.renderly.dev">docs.renderly.dev</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function getResetDate() {
  const d = new Date();
  const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return next.toLocaleDateString('en-US', { month:'short', day:'numeric' });
}
