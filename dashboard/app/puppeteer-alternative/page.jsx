export const metadata = {
  title: 'Renderly vs Puppeteer — HTML to PDF without the DevOps',
  description: 'Compare Renderly API vs self-hosted Puppeteer for HTML to PDF generation. No server management, no Chromium maintenance, just an API call.',
};

const ROWS = [
  ['Setup time',         '~60 seconds',                  '30–60 min (install Node, Chromium, handle deps)'],
  ['Infrastructure',     'Zero — hosted API',             'Your server — you manage Chromium updates'],
  ['Chromium version',   'Always latest stable',          'Pinned to your installed version'],
  ['Cold start',         '< 200ms (warm pool)',           '1–8s per cold browser launch'],
  ['Memory per render',  'Managed by Renderly',          '200–400 MB per Puppeteer instance'],
  ['Scaling',            'Automatic',                     'Manual — you provision more servers'],
  ['Sandboxing',         'Fully managed, secure',        '--no-sandbox flags often required on Linux'],
  ['Maintenance',        'None',                          'Chromium, Node, OS updates on you'],
  ['Cost at 10k PDFs',   '€49/mo (Pro plan)',            '$50–200+ in server / EC2 costs'],
  ['API',                'REST — any language',           'Node.js only (or awkward subprocess calls)'],
];

export default function PuppeteerAlternative() {
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
        .btn-primary:hover{transform:translateY(-1px);box-shadow:0 0 30px rgba(99,102,241,0.6)}
        .btn-lg{font-size:16px;padding:14px 30px}

        .hero{padding:5rem 0 3rem;text-align:center}
        .hero h1{font-size:clamp(32px,5vw,54px);font-weight:900;letter-spacing:-1.5px;color:#F8FAFC;margin-bottom:16px;line-height:1.1}
        .hero h1 span{background:linear-gradient(135deg,#818CF8,#C084FC);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hero p{font-size:17px;color:#64748B;max-width:580px;margin:0 auto 36px;line-height:1.7}

        .section{padding:3rem 0}
        .section-title{font-size:26px;font-weight:800;color:#F8FAFC;margin-bottom:1.5rem;letter-spacing:-0.5px}

        table{width:100%;border-collapse:collapse;margin-top:0.5rem}
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
          <h1>Renderly vs <span>Puppeteer</span><br/>for HTML to PDF</h1>
          <p>Puppeteer is a great browser automation tool — but running it in production to generate PDFs means owning a Chromium server, managing memory, and handling every Linux sandbox edge case yourself. Renderly does all of that for you.</p>
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
                  <th>Self-hosted Puppeteer</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([feat, rend, pupp]) => (
                  <tr key={feat}>
                    <td>{feat}</td>
                    <td>{rend}</td>
                    <td>{pupp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Migration: from Puppeteer to Renderly</h2>
          <p style={{fontSize:14,color:'#64748B',marginBottom:'1.5rem'}}>Replace your entire Puppeteer PDF pipeline with a single fetch call:</p>

          <div className="code-block">
            <div className="code-header">
              <span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/>
              <span>before.js — Puppeteer</span>
            </div>
            <pre>{`<span class="cm">// ❌ Before — ~30 lines of Puppeteer boilerplate</span>
<span class="kw">const</span> puppeteer = require(<span class="str">'puppeteer'</span>);

<span class="kw">const</span> browser = <span class="kw">await</span> puppeteer.<span class="fn">launch</span>({
  args: [<span class="str">'--no-sandbox'</span>, <span class="str">'--disable-setuid-sandbox'</span>],
});
<span class="kw">const</span> page = <span class="kw">await</span> browser.<span class="fn">newPage</span>();
<span class="kw">await</span> page.<span class="fn">setContent</span>(html, { waitUntil: <span class="str">'networkidle0'</span> });
<span class="kw">const</span> pdf = <span class="kw">await</span> page.<span class="fn">pdf</span>({ format: <span class="str">'A4'</span> });
<span class="kw">await</span> browser.<span class="fn">close</span>();`}</pre>
          </div>

          <div className="code-block">
            <div className="code-header">
              <span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/>
              <span>after.js — Renderly</span>
            </div>
            <pre>{`<span class="cm">// ✅ After — 5 lines, any language, no server</span>
<span class="kw">const</span> res = <span class="kw">await</span> fetch(<span class="str">'https://api.renderlyapi.com/v1/pdf/from-html'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Authorization'</span>: <span class="str">'Bearer rly_live_…'</span>, <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
  body: JSON.<span class="fn">stringify</span>({ html, format: <span class="str">'A4'</span> }),
});
<span class="kw">const</span> pdfBuffer = <span class="kw">await</span> res.<span class="fn">arrayBuffer</span>();`}</pre>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Why teams switch from Puppeteer</h2>
          <div className="features-grid">
            {[
              { icon:'🚫', title:'No more --no-sandbox hacks', body:'Running Puppeteer in Docker or Linux always requires unsafe sandbox flags. Renderly runs in a hardened, isolated environment.' },
              { icon:'💰', title:'Lower total cost', body:'At 10,000 PDFs/month, a dedicated Node server costs more than Renderly Pro — and you still have to maintain it.' },
              { icon:'⚡', title:'Faster renders', body:'A pre-warmed browser pool means you never wait for Chromium to cold-start. Renders complete in under 200ms p95.' },
              { icon:'🌍', title:'Works from any language', body:'Puppeteer is Node.js only. Renderly is a plain REST API — call it from Python, PHP, Go, Ruby, or any HTTP client.' },
              { icon:'🔄', title:'Always up-to-date Chromium', body:'Puppeteer versions lock you to a specific Chromium. Renderly always uses the latest stable Chrome rendering engine.' },
              { icon:'📈', title:'Scales automatically', body:'Need to render 100 PDFs at once? Renderly handles the concurrency. No thread pools or queue management needed.' },
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
          <h2>Ship PDFs in 60 seconds</h2>
          <p>Free tier included. No credit card. API key on sign-up.</p>
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
