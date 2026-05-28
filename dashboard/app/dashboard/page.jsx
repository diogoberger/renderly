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

  const rendered  = usage?.docs_rendered   ?? 0;
  const limit     = usage?.docs_limit      ?? { free:50, starter:500, pro:2000, scale:10000 }[plan];
  const remaining = usage?.docs_remaining  ?? limit;
  const pct       = Math.min(100, Math.round((rendered / limit) * 100));
  const resetDate = usage?.reset_date
    ? new Date(usage.reset_date).toLocaleDateString('en-US', { month:'short', day:'numeric' })
    : (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth()+1, 1).toLocaleDateString('en-US', { month:'short', day:'numeric' }); })();

  const barColor = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : '#6366F1';

  return (
    <>
      <style>{`
        html, body { background:#020817 !important; color:#F8FAFC !important; }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Inter',system-ui,-apple-system,sans-serif; background:#020817; color:#F8FAFC; }

        .nav { border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(2,8,23,0.9); position:sticky; top:0; z-index:50; backdrop-filter:blur(16px); }
        .nav-inner { max-width:960px; margin:0 auto; padding:0 1.5rem; height:64px; display:flex; align-items:center; justify-content:space-between; }
        .logo { font-weight:800; font-size:20px; background:linear-gradient(135deg,#818CF8,#C084FC); -webkit-background-clip:text; -webkit-text-fill-color:transparent; text-decoration:none; }

        .container { max-width:960px; margin:0 auto; padding:2.5rem 1.5rem; }

        .section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; }
        .page-title { font-size:24px; font-weight:800; letter-spacing:-0.5px; color:#F8FAFC; }

        .plan-badge { display:inline-flex; align-items:center; padding:4px 14px; border-radius:100px; font-size:12px; font-weight:600; }
        .badge-free    { background:rgba(255,255,255,0.07); color:#94A3B8; border:1px solid rgba(255,255,255,0.1); }
        .badge-starter { background:rgba(99,102,241,0.15); color:#818CF8; border:1px solid rgba(99,102,241,0.3); }
        .badge-pro     { background:rgba(139,92,246,0.15); color:#A78BFA; border:1px solid rgba(139,92,246,0.3); }
        .badge-scale   { background:rgba(16,185,129,0.12); color:#34D399; border:1px solid rgba(16,185,129,0.25); }

        .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:1.5rem; }
        .card-label { font-size:13px; font-weight:500; color:#64748B; margin-bottom:6px; }
        .card-value { font-size:22px; font-weight:700; color:#F8FAFC; }

        .usage-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:1.5rem; margin-bottom:1rem; }
        .usage-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
        .usage-title { font-size:15px; font-weight:600; color:#F8FAFC; margin-bottom:4px; }
        .usage-sub { font-size:13px; color:#64748B; }
        .usage-count { font-size:28px; font-weight:800; color:#F8FAFC; line-height:1; }
        .usage-limit { font-size:14px; color:#64748B; }

        .bar-track { background:rgba(255,255,255,0.07); border-radius:100px; height:8px; overflow:hidden; }
        .bar-fill { height:100%; border-radius:100px; transition:width 0.4s ease; }
        .bar-labels { display:flex; justify-content:space-between; margin-top:8px; }
        .bar-label { font-size:12px; color:#475569; }

        .stat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:10px; margin-bottom:1rem; }

        .link-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:10px; margin-bottom:1rem; }
        .link-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:1.25rem 1.5rem; cursor:pointer; transition:border-color .2s, background .2s; text-decoration:none; display:block; }
        .link-card:hover { border-color:rgba(99,102,241,0.5); background:rgba(99,102,241,0.06); text-decoration:none; }
        .link-title { font-size:14px; font-weight:600; color:#F8FAFC; margin-bottom:4px; }
        .link-desc { font-size:13px; color:#64748B; }

        pre { background:#0F172A; border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:1.25rem; font-size:12.5px; line-height:1.8; overflow-x:auto; color:#CBD5E1; }

        .history-row { display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
        .history-row:last-child { border-bottom:none; }
        .history-period { font-size:12px; color:#475569; min-width:60px; font-family:monospace; }
        .history-bar-track { flex:1; background:rgba(255,255,255,0.07); border-radius:100px; height:5px; }
        .history-bar-fill { height:100%; border-radius:100px; background:linear-gradient(90deg,#6366F1,#8B5CF6); }
        .history-count { font-size:12px; font-weight:500; color:#94A3B8; min-width:40px; text-align:right; }

        .info-box { background:rgba(99,102,241,0.06); border:1px solid rgba(99,102,241,0.2); border-radius:12px; padding:1rem 1.25rem; font-size:13px; color:#94A3B8; }
        .info-box a { color:#818CF8; }

        @media (max-width:600px) {
          .stat-grid { grid-template-columns:1fr 1fr; }
          .link-grid { grid-template-columns:1fr; }
          .usage-count { font-size:22px; }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">
          <a href="/dashboard" className="logo">Renderly</a>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontSize:13, color:'#475569' }}>{session.email}</span>
            <a href="/auth/logout" style={{ fontSize:13, color:'#64748B', textDecoration:'none' }}>Sign out</a>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Header */}
        <div className="section-header">
          <h1 className="page-title">Dashboard</h1>
          <span className={`plan-badge badge-${plan}`}>{planLabels[plan]} plan</span>
        </div>

        {/* Usage card */}
        <div className="usage-card">
          <div className="usage-top">
            <div>
              <p className="usage-title">PDF renders this month</p>
              <p className="usage-sub">Resets {resetDate}</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <span className="usage-count">{rendered.toLocaleString()}</span>
              <span className="usage-limit"> / {limit.toLocaleString()}</span>
            </div>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width:`${pct}%`, background:barColor }} />
          </div>
          <div className="bar-labels">
            <span className="bar-label">{pct}% used</span>
            <span className="bar-label">{remaining.toLocaleString()} remaining</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="stat-grid">
          {[
            { label:'Plan',          value: planLabels[plan] },
            { label:'Monthly limit', value: limit.toLocaleString() + ' PDFs' },
            { label:'Used',          value: rendered.toLocaleString() + ' PDFs' },
            { label:'Resets',        value: resetDate },
          ].map(({ label, value }) => (
            <div key={label} className="card">
              <p className="card-label">{label}</p>
              <p className="card-value" style={{ fontSize:18 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Navigation links */}
        <div className="link-grid" style={{ marginTop:'1rem' }}>
          <a href="/dashboard/keys" className="link-card">
            <p className="link-title">🔑 API Keys</p>
            <p className="link-desc">View, create, and revoke your API keys</p>
          </a>
          <a href="/pricing" className="link-card">
            <p className="link-title">⚡ Upgrade plan</p>
            <p className="link-desc">More PDFs, higher limits, priority rendering</p>
          </a>
          <a href="https://docs.renderlyapi.com" target="_blank" rel="noreferrer" className="link-card">
            <p className="link-title">📖 Documentation</p>
            <p className="link-desc">API reference, quickstart, code examples</p>
          </a>
        </div>

        {/* Quick-start */}
        <div className="card" style={{ marginTop:'1rem' }}>
          <p style={{ fontWeight:600, fontSize:14, marginBottom:12, color:'#F8FAFC' }}>Quick start</p>
          <pre>
{`curl -X POST https://api.renderlyapi.com/v1/pdf/from-html \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"html":"<h1>Hello, Renderly!</h1>"}' \\
  --output hello.pdf`}
          </pre>
          <p style={{ marginTop:12, fontSize:13, color:'#475569' }}>
            Full API reference → <a href="https://docs.renderlyapi.com" style={{ color:'#818CF8' }}>docs.renderlyapi.com</a>
          </p>
        </div>

        {/* History */}
        {usage?.history?.length > 0 && (
          <div className="card" style={{ marginTop:'1rem' }}>
            <p style={{ fontWeight:600, fontSize:14, marginBottom:14, color:'#F8FAFC' }}>Usage history</p>
            {usage.history.map(h => {
              const hPct = Math.min(100, Math.round((h.docs_rendered / limit) * 100));
              return (
                <div key={h.period} className="history-row">
                  <span className="history-period">{h.period}</span>
                  <div className="history-bar-track">
                    <div className="history-bar-fill" style={{ width:`${hPct}%` }} />
                  </div>
                  <span className="history-count">{h.docs_rendered.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
