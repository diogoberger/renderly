export const metadata = {
  title: 'Changelog — Renderly',
  description: 'What\'s new in Renderly. API updates, new features, and bug fixes.',
};

const entries = [
  {
    date: 'May 2026',
    version: 'v1.2',
    tag: 'feature',
    title: 'URL-to-PDF endpoint now generally available',
    body: 'Pass a public URL instead of raw HTML and Renderly will navigate to the page, wait for JavaScript to finish, and return a pixel-perfect PDF. Full headers/footers and margin support included.',
  },
  {
    date: 'Apr 2026',
    version: 'v1.1',
    tag: 'feature',
    title: 'Custom headers and footers',
    body: 'Pro and Scale plans can now inject per-page headers and footers using HTML templates with page number and total-page tokens ({{page}} / {{pages}}).',
  },
  {
    date: 'Apr 2026',
    version: 'v1.1',
    tag: 'improvement',
    title: 'Render time down to < 200ms p95',
    body: 'We pre-warm a pool of Chromium browser contexts so that the first render on your account is just as fast as subsequent ones. Cold-start overhead is now essentially zero.',
  },
  {
    date: 'Mar 2026',
    version: 'v1.0',
    tag: 'launch',
    title: '🚀 Renderly is live',
    body: 'The first stable release of the Renderly API. Convert any HTML to a PDF with a single POST request. Free tier includes 50 PDFs/month with no credit card required.',
  },
];

const TAG_COLORS = {
  launch:      { bg:'rgba(99,102,241,0.15)', color:'#A5B4FC', label:'Launch' },
  feature:     { bg:'rgba(16,185,129,0.12)', color:'#6EE7B7', label:'New feature' },
  improvement: { bg:'rgba(251,146,60,0.12)', color:'#FCD34D', label:'Improvement' },
  fix:         { bg:'rgba(239,68,68,0.12)',  color:'#FCA5A5', label:'Bug fix' },
};

export default function ChangelogPage() {
  return (
    <>
      <style>{`
        html, body { background:#020817 !important; color:#F8FAFC !important; }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Inter',system-ui,-apple-system,sans-serif; color:#F8FAFC; background:#020817; }
        .container { max-width:760px; margin:0 auto; padding:0 1.5rem; }
        .nav { border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(2,8,23,0.8);position:sticky;top:0;z-index:50;backdrop-filter:blur(16px); }
        .nav-inner { height:64px;display:flex;align-items:center;justify-content:space-between; }
        .logo { font-weight:800;font-size:20px;background:linear-gradient(135deg,#818CF8,#C084FC);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.5px;text-decoration:none; }
        .nav-links { display:flex;gap:8px;align-items:center; }
        .nav-link { font-size:14px;color:#94A3B8;text-decoration:none;padding:6px 12px;border-radius:6px;transition:color 0.2s; }
        .nav-link:hover { color:#F8FAFC; }
        .btn { display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;border:none;transition:all 0.2s; }
        .btn-primary { background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;box-shadow:0 0 20px rgba(99,102,241,0.4); }

        .page-header { padding:4rem 0 2.5rem;text-align:center; }
        .page-header h1 { font-size:42px;font-weight:900;letter-spacing:-1px;color:#F8FAFC;margin-bottom:12px; }
        .page-header p { font-size:16px;color:#64748B; }

        .timeline { padding:0 0 5rem;display:flex;flex-direction:column;gap:0; }
        .entry { display:grid;grid-template-columns:120px 1fr;gap:0;position:relative; }
        .entry-date { padding:2rem 2rem 2rem 0;text-align:right; }
        .entry-date-ver { font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1.5px; }
        .entry-date-month { font-size:13px;color:#475569;margin-top:4px; }
        .entry-line { position:relative;padding:2rem 0 2rem 2rem;border-left:1px solid rgba(255,255,255,0.08); }
        .entry-line::before { content:'';position:absolute;left:-5px;top:2.5rem;width:9px;height:9px;background:#6366F1;border-radius:50%;border:2px solid #020817; }
        .entry-tag { display:inline-flex;align-items:center;padding:2px 10px;border-radius:100px;font-size:11px;font-weight:600;margin-bottom:10px; }
        .entry-title { font-size:18px;font-weight:700;color:#F8FAFC;margin-bottom:8px;letter-spacing:-0.3px; }
        .entry-body { font-size:14px;color:#64748B;line-height:1.7; }

        .footer-mini { border-top:1px solid rgba(255,255,255,0.06);padding:1.5rem 0;text-align:center; }
        .footer-mini span { font-size:12px;color:#334155; }

        @media (max-width:600px) {
          .entry { grid-template-columns:1fr; }
          .entry-date { text-align:left;padding:2rem 0 0; }
          .entry-line { border-left:none;padding:0.5rem 0 2rem; }
          .entry-line::before { display:none; }
        }
      `}</style>

      <nav className="nav">
        <div className="container nav-inner">
          <a href="/" className="logo">Renderly</a>
          <div className="nav-links">
            <a href="/docs" className="nav-link">Docs</a>
            <a href="/pricing" className="nav-link">Pricing</a>
            <a href="/auth/register" className="btn btn-primary">Get started free</a>
          </div>
        </div>
      </nav>

      <div className="container">
        <header className="page-header">
          <h1>Changelog</h1>
          <p>Every update, fix, and new feature — in one place.</p>
        </header>

        <div className="timeline">
          {entries.map((e, i) => {
            const t = TAG_COLORS[e.tag] || TAG_COLORS.feature;
            return (
              <div className="entry" key={i}>
                <div className="entry-date">
                  <div className="entry-date-ver">{e.version}</div>
                  <div className="entry-date-month">{e.date}</div>
                </div>
                <div className="entry-line">
                  <div className="entry-tag" style={{ background: t.bg, color: t.color }}>{t.label}</div>
                  <div className="entry-title">{e.title}</div>
                  <div className="entry-body">{e.body}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="footer-mini">
        <div className="container">
          <span>© 2026 Renderly</span>
        </div>
      </footer>
    </>
  );
}
