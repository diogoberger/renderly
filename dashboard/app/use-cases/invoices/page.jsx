export const metadata = {
  title: 'Generate PDF Invoices via API — Renderly',
  description: 'Automate invoice PDF generation from your app. POST your HTML invoice template, receive a pixel-perfect PDF instantly.',
};

export default function InvoicesPage() {
  return (
    <>
      <style>{`
        html,body{background:#020817!important;color:#F8FAFC!important}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',system-ui,-apple-system,sans-serif;color:#F8FAFC;background:#020817}
        .container{max-width:960px;margin:0 auto;padding:0 1.5rem}
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
        .btn-secondary{background:rgba(255,255,255,0.06);color:#F8FAFC;border:1px solid rgba(255,255,255,0.12)}

        .hero{padding:5rem 0 3rem}
        .use-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);color:#A5B4FC;padding:5px 14px;border-radius:100px;font-size:12px;font-weight:600;margin-bottom:20px}
        .hero h1{font-size:clamp(32px,5vw,52px);font-weight:900;letter-spacing:-1.5px;color:#F8FAFC;margin-bottom:16px;line-height:1.1}
        .hero h1 span{background:linear-gradient(135deg,#818CF8,#C084FC);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hero p{font-size:17px;color:#64748B;max-width:600px;margin-bottom:36px;line-height:1.7}
        .hero-ctas{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:3.5rem}

        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start;padding:3rem 0}
        @media(max-width:720px){.two-col{grid-template-columns:1fr}}

        .section{padding:2.5rem 0}
        .section-title{font-size:22px;font-weight:800;color:#F8FAFC;margin-bottom:1rem;letter-spacing:-0.3px}
        .section-sub{font-size:15px;color:#64748B;margin-bottom:1.5rem;line-height:1.7}

        .benefits{display:flex;flex-direction:column;gap:16px}
        .benefit{display:flex;gap:14px;align-items:flex-start}
        .benefit-icon{width:36px;height:36px;background:rgba(99,102,241,0.1);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .benefit h3{font-size:14px;font-weight:700;color:#F8FAFC;margin-bottom:4px}
        .benefit p{font-size:13px;color:#64748B;line-height:1.5}

        .code-block{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;margin:0.75rem 0}
        .code-header{padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;gap:8px;align-items:center}
        .code-title{font-size:12px;color:#64748B;margin-left:4px}
        .dot{width:10px;height:10px;border-radius:50%}
        .dot-r{background:#FF5F57}.dot-y{background:#FFBD2E}.dot-g{background:#28C840}
        pre{padding:20px;font-family:'SF Mono',Monaco,'Fira Code',monospace;font-size:13px;line-height:1.8;color:#CBD5E1;overflow-x:auto;white-space:pre}
        .kw{color:#818CF8}.str{color:#86EFAC}.cm{color:#475569}.fn{color:#F472B6}

        .also-links{display:flex;gap:12px;flex-wrap:wrap;margin-top:0.5rem}
        .also-link{font-size:13px;color:#818CF8;text-decoration:none;padding:6px 14px;border:1px solid rgba(99,102,241,0.3);border-radius:8px;transition:all 0.2s}
        .also-link:hover{background:rgba(99,102,241,0.1)}

        .cta-section{padding:5rem 0;text-align:center}
        .cta-section h2{font-size:36px;font-weight:900;letter-spacing:-1px;color:#F8FAFC;margin-bottom:12px}
        .cta-section p{font-size:16px;color:#64748B;margin-bottom:32px}

        .footer-mini{border-top:1px solid rgba(255,255,255,0.06);padding:1.5rem 0;text-align:center}
        .footer-mini span{font-size:12px;color:#334155}
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
          <div className="use-badge">🧾 Use case</div>
          <h1>Automate <span>PDF invoice</span><br/>generation at scale</h1>
          <p>Stop exporting invoices manually. Use Renderly's API to generate PDF invoices from your HTML templates on demand — triggered by your billing system, webhook, or user action.</p>
          <div className="hero-ctas">
            <a href="/auth/register" className="btn btn-primary btn-lg">Start free →</a>
            <a href="/docs" className="btn btn-secondary btn-lg">View API docs</a>
          </div>
        </section>

        <div className="two-col">
          <div>
            <h2 className="section-title">How it works</h2>
            <p className="section-sub">Your billing system renders the invoice as HTML (using your existing template engine), then calls Renderly's API. You get a PDF back in under 200ms.</p>
            <div className="benefits">
              {[
                { icon:'⚡', title:'Under 200ms per render', body:'Pre-warmed Chromium pool means no cold starts. Invoices are ready instantly.' },
                { icon:'🎨', title:'Your HTML, your branding', body:'Use any CSS — custom fonts, logos, colors. The output matches your brand pixel-perfectly.' },
                { icon:'📐', title:'A4, Letter, or custom size', body:'Configure page format, margins, and orientation per request.' },
                { icon:'🔗', title:'Any language or framework', body:'Generate invoices from Node, Python, PHP, Ruby, Go — any HTTP client works.' },
              ].map(b => (
                <div className="benefit" key={b.title}>
                  <div className="benefit-icon">{b.icon}</div>
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="section-title">Code example</h2>
            <div className="code-block">
              <div className="code-header">
                <span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/>
                <span className="code-title">invoice.js</span>
              </div>
              <pre>{`<span class="kw">async function</span> <span class="fn">generateInvoicePDF</span>(invoice) {
  <span class="kw">const</span> html = <span class="fn">renderInvoiceTemplate</span>(invoice);

  <span class="kw">const</span> res = <span class="kw">await</span> fetch(
    <span class="str">'https://api.renderlyapi.com/v1/pdf/from-html'</span>,
    {
      method: <span class="str">'POST'</span>,
      headers: {
        <span class="str">'Authorization'</span>: <span class="str">\`Bearer \${process.env.RENDERLY_KEY}\`</span>,
        <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>,
      },
      body: JSON.<span class="fn">stringify</span>({
        html,
        format: <span class="str">'A4'</span>,
        marginTop: <span class="str">'15mm'</span>,
        marginBottom: <span class="str">'15mm'</span>,
      }),
    }
  );

  <span class="kw">return</span> Buffer.<span class="fn">from</span>(<span class="kw">await</span> res.<span class="fn">arrayBuffer</span>());
}`}</pre>
            </div>
          </div>
        </div>

        <section className="section">
          <h2 className="section-title">Other use cases</h2>
          <div className="also-links">
            <a href="/use-cases/reports" className="also-link">📊 PDF Reports</a>
            <a href="/use-cases/certificates" className="also-link">🎓 Certificates</a>
            <a href="/use-cases/contracts" className="also-link">📝 Contracts</a>
          </div>
        </section>

        <section className="cta-section">
          <h2>Start generating invoices</h2>
          <p>Free tier — 50 PDFs/month. No credit card required.</p>
          <a href="/auth/register" className="btn btn-primary btn-lg">Get your free API key →</a>
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
