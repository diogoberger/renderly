'use client';

import { useState } from 'react';

const plans = [
  {
    name: 'Free', price: 0, period: '', docs: '50 PDFs/mo',
    features: ['50 PDFs/month', '5MB max HTML', 'A4, Letter, A3 formats', 'API key access', 'Community support'],
    cta: 'Get started free', plan: null, href: '/auth/register', featured: false,
  },
  {
    name: 'Starter', price: 19, period: '/mo', docs: '500 PDFs/mo',
    features: ['500 PDFs/month', '20MB max HTML', 'Custom headers & footers', 'Email support', 'Overage at €0.06/doc'],
    cta: 'Upgrade to Starter', plan: 'starter', href: null, featured: false,
  },
  {
    name: 'Pro', price: 49, period: '/mo', docs: '2,000 PDFs/mo',
    features: ['2,000 PDFs/month', '50MB max HTML', 'Async + webhooks', 'Priority rendering', '99.5% SLA', 'Overage at €0.04/doc'],
    cta: 'Upgrade to Pro', plan: 'pro', href: null, featured: true,
  },
  {
    name: 'Scale', price: 99, period: '/mo', docs: '10,000 PDFs/mo',
    features: ['10,000 PDFs/month', '100MB max HTML', 'All Pro features', '99.9% SLA', 'Priority email support', 'Overage at €0.025/doc'],
    cta: 'Upgrade to Scale', plan: 'scale', href: null, featured: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(null);
  const [error, setError]     = useState('');

  async function handleUpgrade(plan) {
    setLoading(plan);
    setError('');
    try {
      const res  = await fetch(`/api/proxy?path=checkout`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (res.status === 401) { window.location.href = '/auth/login'; return; }
      if (!res.ok || !data.url) { setError(data.error?.message ?? 'Something went wrong. Please try again.'); return; }
      window.location.href = data.url;
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(null);
  }

  return (
    <>
      <style>{`
        html, body { background:#020817 !important; color:#F8FAFC !important; }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Inter',system-ui,-apple-system,sans-serif; background:#020817; color:#F8FAFC; }

        .nav { border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(2,8,23,0.9); position:sticky; top:0; z-index:50; backdrop-filter:blur(16px); }
        .nav-inner { max-width:1100px; margin:0 auto; padding:0 1.5rem; height:64px; display:flex; align-items:center; justify-content:space-between; }
        .logo { font-weight:800; font-size:20px; background:linear-gradient(135deg,#818CF8,#C084FC); -webkit-background-clip:text; -webkit-text-fill-color:transparent; text-decoration:none; }

        .container { max-width:1100px; margin:0 auto; padding:4rem 1.5rem; }
        h1 { font-size:clamp(28px,5vw,48px); font-weight:900; text-align:center; letter-spacing:-1px; color:#F8FAFC; margin-bottom:12px; }
        .sub { font-size:17px; color:#64748B; text-align:center; margin-bottom:3.5rem; }

        .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:16px; }

        .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:1.75rem; position:relative; transition:border-color 0.2s; }
        .card.featured { background:rgba(99,102,241,0.07); border-color:rgba(99,102,241,0.5); }
        .card:hover { border-color:rgba(255,255,255,0.15); }
        .card.featured:hover { border-color:rgba(99,102,241,0.8); }

        .popular-badge { position:absolute; top:-13px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#6366F1,#8B5CF6); color:#fff; font-size:11px; font-weight:700; padding:4px 14px; border-radius:100px; white-space:nowrap; }

        .plan-name { font-size:13px; font-weight:600; color:#94A3B8; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; }
        .plan-price { font-size:42px; font-weight:800; color:#F8FAFC; margin-bottom:2px; line-height:1; }
        .plan-price span { font-size:15px; font-weight:400; color:#64748B; }
        .plan-docs { font-size:14px; color:#64748B; margin-bottom:20px; margin-top:4px; }

        .features { list-style:none; display:flex; flex-direction:column; gap:9px; margin-bottom:24px; }
        .features li { font-size:13px; color:#94A3B8; display:flex; align-items:flex-start; gap:8px; }
        .features li::before { content:'✓'; color:#10B981; font-weight:700; font-size:12px; flex-shrink:0; margin-top:1px; }

        .btn { display:inline-flex; align-items:center; justify-content:center; width:100%; padding:11px 20px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; border:none; transition:all 0.2s; text-decoration:none; }
        .btn-dark { background:#fff; color:#0A0F1E; }
        .btn-dark:hover { background:#F1F5F9; transform:translateY(-1px); }
        .btn-outline { background:rgba(255,255,255,0.06); color:#F8FAFC; border:1px solid rgba(255,255,255,0.12); }
        .btn-outline:hover { background:rgba(255,255,255,0.1); transform:translateY(-1px); }
        .btn-gradient { background:linear-gradient(135deg,#6366F1,#8B5CF6); color:#fff; box-shadow:0 0 20px rgba(99,102,241,0.35); }
        .btn-gradient:hover { transform:translateY(-1px); box-shadow:0 0 28px rgba(99,102,241,0.5); }
        .btn:disabled { opacity:0.6; cursor:not-allowed; transform:none !important; }

        .error { background:rgba(220,38,38,0.08); border:1px solid rgba(220,38,38,0.2); border-radius:10px; padding:12px 16px; font-size:14px; color:#FCA5A5; text-align:center; margin-bottom:1.5rem; }

        .footer-note { text-align:center; margin-top:2rem; font-size:13px; color:#475569; }

        @media (max-width:768px) {
          .grid { grid-template-columns:1fr; max-width:400px; margin:0 auto; }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">Renderly</a>
          <div style={{ display:'flex', gap:10 }}>
            <a href="/auth/login" style={{ fontSize:14, color:'#94A3B8', textDecoration:'none', padding:'7px 14px' }}>Sign in</a>
            <a href="/auth/register" style={{ fontSize:14, background:'linear-gradient(135deg,#6366F1,#8B5CF6)', color:'#fff', padding:'7px 16px', borderRadius:8, fontWeight:500, textDecoration:'none' }}>Get started free</a>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1>Simple, transparent pricing</h1>
        <p className="sub">Start free. Upgrade when you need more PDFs. No contracts, cancel anytime.</p>

        {error && <div className="error">{error}</div>}

        <div className="grid">
          {plans.map(p => (
            <div key={p.name} className={`card${p.featured ? ' featured' : ''}`}>
              {p.featured && <div className="popular-badge">Most popular</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">€{p.price}<span>{p.period}</span></div>
              <div className="plan-docs">{p.docs}</div>
              <ul className="features">
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              {p.href ? (
                <a href={p.href} className="btn btn-outline">{p.cta}</a>
              ) : (
                <button
                  className={`btn ${p.featured ? 'btn-gradient' : 'btn-dark'}`}
                  onClick={() => handleUpgrade(p.plan)}
                  disabled={loading === p.plan}
                >
                  {loading === p.plan ? 'Redirecting…' : p.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="footer-note">All plans include HTTPS, 99% uptime, and API key management.</p>
      </div>
    </>
  );
}
