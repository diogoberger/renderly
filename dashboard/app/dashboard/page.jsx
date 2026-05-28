import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSession } from '../../lib/auth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function fetchUsage(token) {
  try {
    const res = await fetch(`${API}/v1/dashboard/usage`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const cookieStore = cookies();
  const sessionToken = cookieStore.get('renderly_session')?.value;
  const usage = sessionToken ? await fetchUsage(sessionToken) : null;

  const plan = usage?.plan ?? session.plan ?? 'free';
  const planLabels = { free:'Free', starter:'Starter', pro:'Pro', scale:'Scale' };
  const planColors = { free:'badge-free', starter:'badge-starter', pro:'badge-pro', scale:'badge-scale' };

  const rendered  = usage?.docs_rendered   ?? 0;
  const limit     = usage?.docs_limit      ?? { free:50, starter:500, pro:2000, scale:10000 }[plan];
  const remaining = usage?.docs_remaining  ?? limit;
  const pct       = Math.min(100, Math.round((rendered / limit) * 100));
  const resetDate = usage?.reset_date
    ? new Date(usage.reset_date).toLocaleDateString('en-US', { month:'short', day:'numeric' })
    : (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth()+1, 1).toLocaleDateString('en-US', { month:'short', day:'numeric' }); })();

  const barColor = pct >= 90 ? '#DC2626' : pct >= 70 ? '#F59E0B' : '#2E75B6';

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
          <span className={`badge ${planColors[plan]}`}>{planLabels[plan]} plan</span>
        </div>

        {/* Usage card */}
        <div style={{ background:'#fff', border:'1px solid var(--grey-border)', borderRadius:'var(--radius-lg)', padding:'1.5rem', marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div>
              <p style={{ fontWeight:600, fontSize:15, marginBottom:2 }}>PDF renders this month</p>
              <p style={{ fontSize:13, color:'var(--text-muted)' }}>Resets {resetDate}</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <span style={{ fontSize:24, fontWeight:700, color:'var(--text)' }}>{rendered.toLocaleString()}</span>
              <span style={{ fontSize:14, color:'var(--text-muted)' }}> / {limit.toLocaleString()}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ background:'#F3F4F6', borderRadius:100, height:8, overflow:'hidden' }}>
            <div style={{ width:`${pct}%`, height:'100%', background:barColor, borderRadius:100, transition:'width 0.4s ease' }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
            <span style={{ fontSize:12, color:'var(--text-muted)' }}>{pct}% used</span>
            <span style={{ fontSize:12, color:'var(--text-muted)' }}>{remaining.toLocaleString()} remaining</span>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:12, marginBottom:'1.5rem' }}>
          {[
            { label:'Plan',          value: planLabels[plan] },
            { label:'Monthly limit', value: limit.toLocaleString() + ' PDFs' },
            { label:'Used',          value: rendered.toLocaleString() + ' PDFs' },
            { label:'Resets',        value: resetDate },
          ].map(({ label, value }) => (
            <div key={label} style={{ background:'#fff', border:'1px solid var(--grey-border)', borderRadius:'var(--radius)', padding:'1rem' }}>
              <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:4 }}>{label}</p>
              <p style={{ fontSize:18, fontWeight:600 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Navigation links */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:12, marginBottom:'1.5rem' }}>
          <a href="/dashboard/keys" style={{ textDecoration:'none' }}>
            <div className="card" style={{ cursor:'pointer', transition:'border-color .15s' }}>
              <p style={{ fontWeight:600, marginBottom:4 }}>🔑 API Keys</p>
              <p style={{ fontSize:13, color:'var(--text-muted)' }}>View, create, and revoke your API keys</p>
            </div>
          </a>
          <a href="/pricing" style={{ textDecoration:'none' }}>
            <div className="card" style={{ cursor:'pointer' }}>
              <p style={{ fontWeight:600, marginBottom:4 }}>⚡ Upgrade plan</p>
              <p style={{ fontSize:13, color:'var(--text-muted)' }}>More PDFs, higher limits, priority rendering</p>
            </div>
          </a>
          <a href="https://docs.renderlyapi.com" target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}>
            <div className="card" style={{ cursor:'pointer' }}>
              <p style={{ fontWeight:600, marginBottom:4 }}>📖 Documentation</p>
              <p style={{ fontSize:13, color:'var(--text-muted)' }}>API reference, quickstart, code examples</p>
            </div>
          </a>
        </div>

        {/* Quick-start snippet */}
        <div className="card">
          <p style={{ fontWeight:600, marginBottom:12 }}>Quick start</p>
          <pre style={{ background:'#0F172A', color:'#E2E8F0', borderRadius:'var(--radius)', padding:'1rem', fontSize:12, overflowX:'auto', lineHeight:1.7 }}>
{`curl -X POST https://api.renderlyapi.com/v1/pdf/from-html \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"html":"<h1>Hello, Renderly!</h1>"}' \\
  --output hello.pdf`}
          </pre>
          <p style={{ marginTop:12, fontSize:13, color:'var(--text-muted)' }}>
            Full API reference → <a href="https://docs.renderlyapi.com">docs.renderlyapi.com</a>
          </p>
        </div>

        {/* History */}
        {usage?.history?.length > 0 && (
          <div className="card" style={{ marginTop:'1.5rem' }}>
            <p style={{ fontWeight:600, marginBottom:12 }}>Usage history</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {usage.history.map(h => {
                const hPct = Math.min(100, Math.round((h.docs_rendered / limit) * 100));
                return (
                  <div key={h.period} style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ fontSize:13, color:'var(--text-muted)', minWidth:60 }}>{h.period}</span>
                    <div style={{ flex:1, background:'#F3F4F6', borderRadius:100, height:6 }}>
                      <div style={{ width:`${hPct}%`, height:'100%', background:'var(--blue-mid)', borderRadius:100 }}/>
                    </div>
                    <span style={{ fontSize:13, fontWeight:500, minWidth:40, textAlign:'right' }}>{h.docs_rendered.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
