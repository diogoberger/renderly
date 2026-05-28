export const metadata = {
  title: 'Renderly vs wkhtmltopdf — Modern HTML to PDF API',
  description: 'wkhtmltopdf uses an outdated Qt WebKit engine. Compare it to Renderly\'s Chromium-powered API for pixel-perfect PDFs.',
};

const ROWS = [
  ['Rendering engine',   'Chromium (latest Chrome)',     'Qt WebKit — unmaintained since 2023'],
  ['CSS support',        'Full CSS3, Grid, Flexbox',     'Limited — no CSS Grid, no Flexbox'],
  ['JavaScript',         'Full V8 execution',            'Partial / unreliable JS execution'],
  ['Custom fonts',       'Yes, via CSS @font-face',      'Partial — system fonts only reliably'],
  ['Setup',              'REST API call',                'Binary install + command-line flags'],
  ['Docker image size',  'None — cloud API',             '+200 MB for wkhtmltopdf binary'],
  ['Security patches',   'Managed by Renderly',          'No security updates since 2023'],
  ['CI/CD integration',  'HTTP call in any pipeline',    'Binary dependency in build image'],
  ['Active maintenance', 'Yes',                          'No — project is abandoned'],
  ['Cost at 10k PDFs',   '€49/mo (Pro plan)',            'Server + maintenance time'],
];

export default function WkhtmltopdfAlternative() {
  return (
    <>
      <style>{`
        html,body{background:#020817!important;color:#F8FAFC!important}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',system-ui,-apple-system,sans-serif;color:#F8FAFC;background:#020817}
        .container{max-width:1000px;margin:0 auto;padding:0 1.5rem}
        .nav{border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(2,8,23,0.8);position:sticky;top:0;z-index:50;backdrop-filter:blur(16px)}
        .nav-inner{height:64px;display:flex;align-items:center;justify-content:space-between}
        .logo{font-weight:800;font-size:20px;background:linear-gradient(135deg,#818CF8,#C084FC);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.5px;text-decoration:none}
        .nav-links{display:flex;gap:8px;align-items:center}
        .nav-link{font-size:14px;color:#94A3B8;text-decoration:none;padding:6px 12px;border-radius:6px;transition:color 0.2s}
        .nav-link:hover{color:#F8FAFC}
        .btn{display:inline-flex;align-items:center;padding:7px 16px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;border:none;transition:all 0.2s}
        .btn-primary{background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;box-shadow:0 0 20px rgba(99,102,241,0.4)}
        .btn-primary:hover{transform:translateY(-1px)}
        .btn-lg{font-size:16px;padding:14px 30px}

        .hero{padding:5rem 0 3rem;text-align:center}
        .hero h1{font-size:clamp(32px,5vw,54px);font-weight:900;letter-spacing:-1.5px;color:#F8FAFC;margin-bottom:16px;line-height:1.1}
        .hero h1 span{background:linear-gradient(135deg,#818CF8,#C084FC);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hero p{font-size:17px;color:#64748B;max-width:600px;margin:0 auto 36px;line-height:1.7}

        .warning-box{background:rgba(251,146,60,0.08);border:1px solid rgba(251,146,60,0.25);border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:2rem;font-size:14px;color:#FCD34D;line-height:1.6}

        .section{padding:3rem 0}
        .section-title{font-size:26px;font-weight:800;color:#F8FAFC;margin-bottom:1.5rem;letter-spacing:-0.5px}

        table{width:100%;border-collapse:collapse}
        th{text-align:left;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#64748B;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.08)}
        td{padding:14px 16px;font-size:14px;border-bottom:1px solid rgba(255,255,255,0.05)}
        tr td:first-child{color:#94A3B8;font-weight:500;width:30%}
        tr td:nth-child(2){color:#86EFAC}
        tr td:nth-child(3){color:#64748B}
        tr:hover td{background:rgba(255,255,255,0.02)}

        .code-block{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;margin:1rem 0}
        .code-header{padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;gap:8px;align-items:center}
        .code-header span{font-size:12px;color:#64748B;margin-left:4px}
        .dot{width:10px;height:10px;border-radius:50%}
        .dot-r{background:#FF5F57}.dot-y{background:#FFBD2E}.dot-g{background:#28C840}
        pre{padding:20px;font-family:'SF Mono',Monaco,'Fira Code',monospace;font-size:13px;line-height:1.8;color:#CBD5E1;overflow-x:auto}
        .kw{color:#818CF8}.str{color:#86EFAC}.cm{color:#475569}.fn{color:#F472B6}

        .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:1.5rem}
        .feature-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:1.5rem}
        .feature-icon{font-size:24px;margin-bottom:10px}
        .feature-title{font-size:15px;font-weight:700;color:#F8FAFC;margin-bottom:6px}
        .feature-body{font-size:13px;color:#64748B;line-height:1.6}

        .cta-section{padding:5rem 0;text-align:center}
        .cta-section h2{font-size:38px;font-weight:900;letter-spacing:-1px;color:#F8FAFC;margin-bottom:12px}
        .cta-section p{font-size:16px;color:#64748B;margin-bottom:32px}

        .footer-mini{border-top:1px solid rgba(255,255,255,0.06);padding:1.5rem 0;text-align:center}
        .footer-mini span{font-size:12px;color:#334155}

        @media(max-width:640px){
          th:nth-child(3),td:nth-child(3){display:none}
          .hero h1{font-size:28px}
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
        <section className="hero">
          <h1>Renderly vs <span>wkhtmltopdf</span></h1>
          <p>wkhtmltopdf was the go-to HTML-to-PDF tool for years — but its Qt WebKit engine hasn't received security patches since 2023 and doesn't support modern CSS. Renderly uses the real Chrome rendering engine, managed for you.</p>
          <a href="/auth/register" className="btn btn-primary btn-lg">Start free — no credit card →</a>
        </section>

        <div className="warning-box">
          ⚠️ <strong>wkhtmltopdf is no longer actively maintained.</strong> The project's last meaningful release was in 2022 and the underlying Qt WebKit engine receives no security updates. If you're using it in production, consider migrating before it becomes a liability.
        </div>

        <section className="section">
          <h2 className="section-title">Feature comparison</h2>
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,overflow:'hidden'}}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Renderly API</th>
                  <th>wkhtmltopdf</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([feat, rend, wk]) => (
                  <tr key={feat}>
                    <td>{feat}</td>
                    <td>{rend}</td>
                    <td>{wk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Migration example</h2>
          <div className="code-block">
            <div className="code-header">
              <span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/>
              <span>before — wkhtmltopdf shell command</span>
            </div>
            <pre>{`<span class="cm"># ❌ Before — binary, shell exec, temp files, security flags</span>
wkhtmltopdf --no-stop-slow-scripts --enable-local-file-access \\
  --javascript-delay 2000 \\
  input.html output.pdf`}</pre>
          </div>
          <div className="code-block">
            <div className="code-header">
              <span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/>
              <span>after — Renderly API</span>
            </div>
            <pre>{`<span class="cm"># ✅ After — one curl call, no binary, no temp files</span>
curl -X POST https://api.renderlyapi.com/v1/pdf/from-html \\
  -H "Authorization: Bearer rly_live_…" \\
  -H "Content-Type: application/json" \\
  -d '{"html":"<h1>Hello</h1>","format":"A4"}' \\
  --output invoice.pdf`}</pre>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Why teams migrate from wkhtmltopdf</h2>
          <div className="features-grid">
            {[
              { icon:'🛡️', title:'Security — no more stale WebKit', body:'wkhtmltopdf\'s embedded WebKit engine has known CVEs with no fixes. Renderly uses the fully-patched Chrome engine.' },
              { icon:'🎨', title:'Modern CSS support', body:'CSS Grid, Flexbox, custom properties, clip-path — all render correctly. wkhtmltopdf often misrenders or ignores modern CSS.' },
              { icon:'⚡', title:'JavaScript rendering', body:'wkhtmltopdf has inconsistent JS support. Renderly uses full V8 — your dynamic content and chart libraries render perfectly.' },
              { icon:'📦', title:'No binary to install', body:'Remove the 200MB wkhtmltopdf binary from your Docker image. Renderly is just an HTTP call.' },
              { icon:'🔤', title:'Reliable font rendering', body:'Custom web fonts via @font-face work consistently in Renderly. wkhtmltopdf often requires font pre-installation.' },
              { icon:'🔧', title:'No more --flags hacks', body:'wkhtmltopdf often needs --no-stop-slow-scripts and --enable-local-file-access workarounds. Renderly has none of this.' },
            ].map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-body">{f.body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <h2>Migrate in under an hour</h2>
          <p>Free tier — 50 PDFs/month, no credit card, API key on sign-up.</p>
          <a href="/auth/register" className="btn btn-primary btn-lg">Start for free →</a>
        </section>
      </div>

      <footer className="footer-mini">
        <div className="container">
          <span>© 2026 Renderly · <a href="/" style={{color:'#475569',textDecoration:'none'}}>renderlyapi.com</a></span>
        </div>
      </footer>
    </>
  );
}
