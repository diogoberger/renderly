export const metadata = {
  title: 'Renderly vs WeasyPrint — HTML to PDF API vs Python library',
  description: 'Compare Renderly API vs WeasyPrint for generating PDFs from HTML. No Python dependencies, no server management, just a REST API.',
};

const ROWS = [
  ['Language support',   'Any — REST API',               'Python only'],
  ['Rendering engine',   'Chromium (Chrome-quality)',     'Python CSS parser (Pango/Cairo)'],
  ['CSS fidelity',       'Chrome-accurate',               'Good — but diverges from browsers on complex layouts'],
  ['JavaScript support', 'Full V8',                       'None — static HTML only'],
  ['Custom fonts',       'Yes, CSS @font-face',           'Yes, but requires GTK/Pango system fonts'],
  ['Docker deps',        'None — cloud API',              'WeasyPrint + Pango + Cairo + GTK (~300MB)'],
  ['Setup time',         '~60 seconds',                   '30+ min (Python deps, system libs, Docker layers)'],
  ['Cold start',         '< 200ms',                       '2–5s for WeasyPrint import + first render'],
  ['Scaling',            'Automatic',                     'Manual — worker per process'],
  ['Maintenance',        'None',                          'Python version + system lib updates on you'],
];

export default function WeasyprintAlternative() {
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
          <h1>Renderly vs <span>WeasyPrint</span></h1>
          <p>WeasyPrint is a solid Python PDF library — but it requires a stack of system dependencies (GTK, Pango, Cairo), doesn't support JavaScript, and is limited to Python apps. Renderly is a language-agnostic REST API with Chrome-quality rendering.</p>
          <a href="/auth/register" className="btn btn-primary btn-lg">Start free — no credit card →</a>
        </section>

        <section className="section">
          <h2 className="section-title">Feature comparison</h2>
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,overflow:'hidden'}}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Renderly API</th>
                  <th>WeasyPrint</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([feat, rend, wp]) => (
                  <tr key={feat}>
                    <td>{feat}</td>
                    <td>{rend}</td>
                    <td>{wp}</td>
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
              <span>before.py — WeasyPrint</span>
            </div>
            <pre>{`<span class="cm"># ❌ Before — Python-only, system dependencies required</span>
<span class="kw">from</span> weasyprint <span class="kw">import</span> HTML

pdf_bytes = HTML(<span class="fn">string</span>=html_content).<span class="fn">write_pdf</span>()`}</pre>
          </div>
          <div className="code-block">
            <div className="code-header">
              <span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/>
              <span>after.py — Renderly API</span>
            </div>
            <pre>{`<span class="cm"># ✅ After — works in any language, no system deps</span>
<span class="kw">import</span> requests

res = requests.<span class="fn">post</span>(
    <span class="str">"https://api.renderlyapi.com/v1/pdf/from-html"</span>,
    headers={<span class="str">"Authorization"</span>: <span class="str">"Bearer rly_live_…"</span>},
    json={<span class="str">"html"</span>: html_content, <span class="str">"format"</span>: <span class="str">"A4"</span>},
)
pdf_bytes = res.content`}</pre>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Why teams switch from WeasyPrint</h2>
          <div className="features-grid">
            {[
              { icon:'📦', title:'Slim Docker images', body:'WeasyPrint pulls in GTK, Pango, and Cairo — adding 300MB+ to Docker images. Renderly has zero system dependencies.' },
              { icon:'🌍', title:'Not just Python', body:'WeasyPrint is Python-only. Your Node.js, PHP, or Go services can call Renderly the same way via the REST API.' },
              { icon:'⚡', title:'JavaScript support', body:'WeasyPrint renders static HTML only. Renderly uses real Chrome, so chart libraries, dynamic content, and Vue/React-rendered templates all work.' },
              { icon:'🎨', title:'Pixel-perfect layout', body:'Complex Flexbox layouts, CSS Grid, and sticky positioning render exactly as they do in a browser — because Renderly uses Chrome.' },
              { icon:'🔒', title:'No system lib vulnerabilities', body:'System-level GTK and Pango have their own CVE surface. Renderly\'s managed API abstracts all of that away.' },
              { icon:'📈', title:'Scales beyond a single process', body:'WeasyPrint blocks a Python process per render. Renderly handles concurrency automatically — no worker pool tuning needed.' },
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
          <h2>Drop the system dependencies</h2>
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
