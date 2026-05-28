export const metadata = {
  title: 'Renderly vs PDFShift vs DocRaptor — HTML to PDF API Comparison',
  description: 'Compare Renderly, PDFShift, DocRaptor and self-hosted Puppeteer. Find the best HTML to PDF API for your project.',
};

const competitors = [
  {
    name: 'Renderly',
    tagline: 'The simplest HTML→PDF API',
    engine: 'Chromium',
    free: '50/mo',
    starter: '€19/mo',
    pro: '€49/mo',
    setup: '30 seconds',
    modernCSS: true,
    sdkRequired: false,
    ops: 'None',
    highlight: true,
  },
  {
    name: 'PDFShift',
    tagline: 'Established Chromium API',
    engine: 'Chromium',
    free: 'Trial only',
    starter: '$29/mo',
    pro: '$79/mo',
    setup: '~5 min',
    modernCSS: true,
    sdkRequired: false,
    ops: 'None',
    highlight: false,
  },
  {
    name: 'DocRaptor',
    tagline: 'Enterprise PDF via Prince',
    engine: 'Prince XML',
    free: '5 docs/mo',
    starter: '$15/mo',
    pro: '$49/mo',
    setup: '~10 min',
    modernCSS: false,
    sdkRequired: true,
    ops: 'None',
    highlight: false,
  },
  {
    name: 'Self-hosted Puppeteer',
    tagline: 'DIY Chromium setup',
    engine: 'Chromium',
    free: 'Server cost',
    starter: '$20+/mo',
    pro: '$20+/mo',
    setup: '4–6 hours',
    modernCSS: true,
    sdkRequired: false,
    ops: 'High',
    highlight: false,
  },
];

const rows = [
  { label: 'Rendering engine',    key: 'engine' },
  { label: 'Free tier',           key: 'free' },
  { label: 'Entry price',         key: 'starter' },
  { label: '~2k PDFs/mo',         key: 'pro' },
  { label: 'Setup time',          key: 'setup' },
  { label: 'Modern CSS support',  key: 'modernCSS', bool: true },
  { label: 'No SDK required',     key: 'sdkRequired', bool: true, invert: true },
  { label: 'Ops burden',          key: 'ops' },
];

export default function ComparePage() {
  return (
    <>
      <style>{`
        html, body { background:#020817 !important; color:#F8FAFC !important; }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Inter',system-ui,-apple-system,sans-serif; background:#020817; color:#F8FAFC; line-height:1.6; }
        a { color:#818CF8; text-decoration:none; }
        a:hover { text-decoration:underline; }

        .nav { border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(2,8,23,0.9); position:sticky; top:0; z-index:50; backdrop-filter:blur(16px); }
        .nav-inner { max-width:1100px; margin:0 auto; padding:0 1.5rem; height:64px; display:flex; align-items:center; justify-content:space-between; }
        .logo { font-weight:800; font-size:20px; background:linear-gradient(135deg,#818CF8,#C084FC); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }

        .container { max-width:1100px; margin:0 auto; padding:4rem 1.5rem; }
        h1 { font-size:clamp(28px,5vw,52px); font-weight:900; letter-spacing:-1.5px; color:#F8FAFC; text-align:center; margin-bottom:16px; }
        .hero-sub { font-size:17px; color:#64748B; text-align:center; max-width:580px; margin:0 auto 3.5rem; line-height:1.7; }

        /* Table */
        .table-wrap { overflow-x:auto; border-radius:16px; border:1px solid rgba(255,255,255,0.07); margin-bottom:4rem; }
        table { width:100%; border-collapse:collapse; font-size:14px; }
        th { padding:14px 20px; text-align:left; font-size:11px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:1.5px; background:rgba(255,255,255,0.02); border-bottom:1px solid rgba(255,255,255,0.07); white-space:nowrap; }
        th.highlight-col { background:rgba(99,102,241,0.08); color:#818CF8; }
        td { padding:14px 20px; border-bottom:1px solid rgba(255,255,255,0.04); color:#94A3B8; vertical-align:middle; }
        td.highlight-col { background:rgba(99,102,241,0.05); color:#F8FAFC; font-weight:500; }
        tr:last-child td { border-bottom:none; }
        tr:hover td { background:rgba(255,255,255,0.02); }
        tr:hover td.highlight-col { background:rgba(99,102,241,0.08); }
        .row-label { color:#64748B; font-size:13px; white-space:nowrap; }
        .check { color:#10B981; font-weight:700; }
        .cross { color:#EF4444; }

        /* Verdict cards */
        .verdicts { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; margin-bottom:4rem; }
        .verdict-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:1.5rem; }
        .verdict-card.featured { background:rgba(99,102,241,0.07); border-color:rgba(99,102,241,0.3); }
        .verdict-who { font-size:11px; font-weight:700; color:#6366F1; text-transform:uppercase; letter-spacing:2px; margin-bottom:10px; }
        .verdict-title { font-size:17px; font-weight:700; color:#F8FAFC; margin-bottom:8px; }
        .verdict-body { font-size:14px; color:#64748B; line-height:1.6; }

        /* CTA section */
        .cta { text-align:center; padding:4rem 0 2rem; }
        .cta h2 { font-size:clamp(24px,4vw,40px); font-weight:800; letter-spacing:-1px; margin-bottom:12px; }
        .cta p { color:#64748B; font-size:16px; margin-bottom:2rem; }
        .btn-primary { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#6366F1,#8B5CF6); color:#fff; padding:14px 30px; border-radius:10px; font-size:16px; font-weight:600; text-decoration:none; box-shadow:0 0 24px rgba(99,102,241,0.35); transition:all 0.2s; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 0 36px rgba(99,102,241,0.5); text-decoration:none; }
        .badge { display:inline-block; background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.25); color:#34D399; font-size:12px; font-weight:600; padding:3px 12px; border-radius:100px; margin-bottom:20px; }

        /* Section */
        .section { margin-bottom:4rem; }
        .section-label { font-size:12px; font-weight:700; color:#6366F1; text-transform:uppercase; letter-spacing:2px; margin-bottom:12px; }
        h2.section-title { font-size:clamp(22px,3vw,32px); font-weight:800; color:#F8FAFC; letter-spacing:-0.5px; margin-bottom:12px; }
        .section p { font-size:15px; color:#64748B; margin-bottom:12px; }

        /* Code */
        pre { background:#0F172A; border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:1.25rem; font-size:13px; line-height:1.8; overflow-x:auto; color:#CBD5E1; margin:1rem 0; }

        /* Footer */
        .footer { border-top:1px solid rgba(255,255,255,0.06); padding:2rem 0; margin-top:2rem; }
        .footer-inner { max-width:1100px; margin:0 auto; padding:0 1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; font-size:13px; color:#334155; }

        @media (max-width:768px) {
          th, td { padding:10px 14px; }
          .verdicts { grid-template-columns:1fr; }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">
          <span className="logo">Renderly</span>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <a href="/docs" style={{fontSize:14,color:'#94A3B8'}}>Docs</a>
            <a href="/pricing" style={{fontSize:14,color:'#94A3B8'}}>Pricing</a>
            <a href="/auth/register" style={{fontSize:14,background:'linear-gradient(135deg,#6366F1,#8B5CF6)',color:'#fff',padding:'7px 16px',borderRadius:8,fontWeight:500}}>Get started free</a>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1>Renderly vs the alternatives</h1>
        <p className="hero-sub">
          You could self-host Puppeteer and own all the ops. Or pay €50+/month for tools built for enterprise. Or use Renderly — the simplest HTML to PDF API available.
        </p>

        {/* Comparison table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{minWidth:160}}>Feature</th>
                {competitors.map(c => (
                  <th key={c.name} className={c.highlight ? 'highlight-col' : ''}>
                    {c.highlight ? '⚡ ' : ''}{c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.label}>
                  <td className="row-label">{row.label}</td>
                  {competitors.map(c => {
                    const val = c[row.key];
                    let display;
                    if (row.bool) {
                      const positive = row.invert ? !val : val;
                      display = positive
                        ? <span className="check">✓ Yes</span>
                        : <span className="cross">✗ No</span>;
                    } else {
                      display = val;
                    }
                    return (
                      <td key={c.name} className={c.highlight ? 'highlight-col' : ''}>
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verdict cards */}
        <div className="section-label">Who should use what</div>
        <div className="verdicts" style={{marginTop:12}}>
          <div className="verdict-card featured">
            <div className="verdict-who">Best for most developers</div>
            <div className="verdict-title">Use Renderly if…</div>
            <div className="verdict-body">You want to call one endpoint and get a PDF back. You care about modern CSS rendering. You want a free tier to test before paying. You don't want to run your own infrastructure.</div>
          </div>
          <div className="verdict-card">
            <div className="verdict-who">Established alternative</div>
            <div className="verdict-title">Use PDFShift if…</div>
            <div className="verdict-body">You've already integrated with them and switching isn't worth it. They're a solid product — just more expensive with no free tier for ongoing use.</div>
          </div>
          <div className="verdict-card">
            <div className="verdict-who">Enterprise / legacy</div>
            <div className="verdict-title">Use DocRaptor if…</div>
            <div className="verdict-body">You have an enterprise requirement for the Prince XML engine, or you need specific typesetting features that Chromium doesn't support. Note: modern CSS (Grid, Flexbox) may not render as expected.</div>
          </div>
          <div className="verdict-card">
            <div className="verdict-who">Maximum control</div>
            <div className="verdict-title">Self-host if…</div>
            <div className="verdict-body">You have strict data residency requirements, very high volume that makes API pricing uneconomical, or you have a dedicated DevOps team to manage it. Otherwise, the ops burden isn't worth it.</div>
          </div>
        </div>

        {/* Why Renderly section */}
        <div className="section">
          <div className="section-label">Why developers choose Renderly</div>
          <h2 className="section-title">One endpoint. Any HTML. Pixel-perfect output.</h2>
          <p>Every other option involves trade-offs: self-hosted means ops burden, enterprise tools mean steep pricing, older engines mean CSS quirks. Renderly is the answer for the 90% case — a developer who needs to generate PDFs without owning the infrastructure.</p>
          <p>Powered by Chromium — the same engine Chrome uses — so your CSS Grid layouts, custom @font-face fonts, and background gradients all render exactly as designed.</p>
          <pre><code>{`// All it takes
const res = await fetch('https://api.renderlyapi.com/v1/pdf/from-html', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_KEY', 'Content-Type': 'application/json' },
  body: JSON.stringify({ html: yourHTML, format: 'A4' }),
});
const pdf = await res.arrayBuffer(); // done.`}</code></pre>
        </div>

        {/* CTA */}
        <div className="cta">
          <div className="badge">Free tier — no credit card required</div>
          <h2>Try Renderly for free</h2>
          <p>50 PDFs/month free. API key in 60 seconds.</p>
          <a href="/auth/register" className="btn-primary">Get started free →</a>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <span className="logo" style={{fontSize:16}}>Renderly</span>
          <div style={{display:'flex',gap:20}}>
            {[['Docs','/docs'],['Pricing','/pricing'],['Sign in','/auth/login']].map(([l,h])=>(
              <a key={l} href={h} style={{color:'#475569'}}>{l}</a>
            ))}
          </div>
          <span>© 2026 Renderly</span>
        </div>
      </footer>
    </>
  );
}
