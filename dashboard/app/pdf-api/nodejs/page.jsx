export const metadata = {
  title: 'HTML to PDF in Node.js — Renderly API',
  description: 'Generate PDFs from HTML in Node.js with a single fetch call. No Puppeteer, no Chromium binary, no headaches.',
};

export default function NodejsPDFPage() {
  return (
    <>
      <style>{`
        html,body{background:#020817!important;color:#F8FAFC!important}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',system-ui,-apple-system,sans-serif;color:#F8FAFC;background:#020817}
        .container{max-width:860px;margin:0 auto;padding:0 1.5rem}
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

        .hero{padding:4.5rem 0 2.5rem}
        .lang-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(104,160,99,0.12);border:1px solid rgba(104,160,99,0.3);color:#86EFAC;padding:5px 14px;border-radius:100px;font-size:12px;font-weight:600;margin-bottom:20px}
        .hero h1{font-size:clamp(30px,5vw,50px);font-weight:900;letter-spacing:-1.5px;color:#F8FAFC;margin-bottom:14px;line-height:1.1}
        .hero h1 span{background:linear-gradient(135deg,#818CF8,#C084FC);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hero p{font-size:17px;color:#64748B;max-width:620px;margin-bottom:32px;line-height:1.7}
        .hero-ctas{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:3rem}

        .section{padding:2.5rem 0}
        .section-title{font-size:22px;font-weight:800;color:#F8FAFC;margin-bottom:1rem;letter-spacing:-0.3px}
        .section-sub{font-size:14px;color:#64748B;margin-bottom:1.25rem;line-height:1.6}

        .code-block{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;margin:0.75rem 0 1.5rem}
        .code-header{padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;gap:8px;align-items:center;justify-content:space-between}
        .code-header-left{display:flex;gap:8px;align-items:center}
        .code-title{font-size:12px;color:#64748B;margin-left:4px}
        .dot{width:10px;height:10px;border-radius:50%}
        .dot-r{background:#FF5F57}.dot-y{background:#FFBD2E}.dot-g{background:#28C840}
        pre{padding:20px;font-family:'SF Mono',Monaco,'Fira Code',monospace;font-size:13px;line-height:1.8;color:#CBD5E1;overflow-x:auto;white-space:pre}
        .kw{color:#818CF8}.str{color:#86EFAC}.cm{color:#475569}.fn{color:#F472B6}.num{color:#FB923C}

        .steps-list{display:flex;flex-direction:column;gap:2rem;margin-top:1rem}
        .step{display:grid;grid-template-columns:32px 1fr;gap:16px;align-items:start}
        .step-n{width:32px;height:32px;border-radius:50%;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#818CF8;flex-shrink:0}
        .step-body h3{font-size:15px;font-weight:700;color:#F8FAFC;margin-bottom:6px}
        .step-body p{font-size:13px;color:#64748B;line-height:1.6}

        .also-links{display:flex;gap:12px;flex-wrap:wrap;margin-top:1rem}
        .also-link{font-size:13px;color:#818CF8;text-decoration:none;padding:6px 14px;border:1px solid rgba(99,102,241,0.3);border-radius:8px;transition:all 0.2s}
        .also-link:hover{background:rgba(99,102,241,0.1);border-color:rgba(99,102,241,0.5)}

        .cta-section{padding:4rem 0;text-align:center}
        .cta-section h2{font-size:34px;font-weight:900;letter-spacing:-1px;color:#F8FAFC;margin-bottom:12px}
        .cta-section p{font-size:15px;color:#64748B;margin-bottom:28px}

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
          <div className="lang-badge">⬡ Node.js</div>
          <h1>HTML to PDF in <span>Node.js</span></h1>
          <p>Generate pixel-perfect PDFs from HTML in your Node.js or Express app with a single fetch call — no Puppeteer, no Chromium binary, no system dependencies.</p>
          <div className="hero-ctas">
            <a href="/auth/register" className="btn btn-primary btn-lg">Get your API key free →</a>
            <a href="/docs" className="btn btn-secondary btn-lg">View full docs</a>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Quickstart</h2>
          <p className="section-sub">No package to install. Just use the native <code style={{color:'#86EFAC',fontFamily:'monospace'}}>fetch</code> API available in Node 18+.</p>

          <div className="code-block">
            <div className="code-header">
              <div className="code-header-left">
                <span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/>
                <span className="code-title">generate-pdf.mjs</span>
              </div>
            </div>
            <pre>{`<span class="kw">const</span> html = <span class="str">\`
  &lt;!DOCTYPE html&gt;
  &lt;html&gt;
    &lt;head&gt;&lt;style&gt;body { font-family: sans-serif; padding: 2rem; }&lt;/style&gt;&lt;/head&gt;
    &lt;body&gt;
      &lt;h1&gt;Invoice #042&lt;/h1&gt;
      &lt;p&gt;Total: €1,500.00&lt;/p&gt;
    &lt;/body&gt;
  &lt;/html&gt;
\`</span>;

<span class="kw">const</span> res = <span class="kw">await</span> fetch(<span class="str">'https://api.renderlyapi.com/v1/pdf/from-html'</span>, {
  method: <span class="str">'POST'</span>,
  headers: {
    <span class="str">'Authorization'</span>: <span class="str">'Bearer rly_live_YOUR_KEY'</span>,
    <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>,
  },
  body: JSON.<span class="fn">stringify</span>({
    html,
    format: <span class="str">'A4'</span>,          <span class="cm">// or 'Letter'</span>
    marginTop: <span class="str">'20mm'</span>,    <span class="cm">// optional margins</span>
    landscape: <span class="kw">false</span>,
  }),
});

<span class="kw">if</span> (!res.ok) <span class="kw">throw new</span> <span class="fn">Error</span>(<span class="str">\`Renderly error: \${res.status}\`</span>);

<span class="kw">const</span> pdfBuffer = Buffer.<span class="fn">from</span>(<span class="kw">await</span> res.<span class="fn">arrayBuffer</span>());
<span class="cm">// Stream to HTTP response:</span>
<span class="cm">// res.setHeader('Content-Type', 'application/pdf');</span>
<span class="cm">// res.send(pdfBuffer);</span>
<span class="cm">// Or save to disk:</span>
<span class="kw">import</span> fs <span class="kw">from</span> <span class="str">'fs'</span>;
fs.<span class="fn">writeFileSync</span>(<span class="str">'invoice.pdf'</span>, pdfBuffer);
console.<span class="fn">log</span>(<span class="str">'PDF saved!'</span>);`}</pre>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Express integration</h2>
          <div className="code-block">
            <div className="code-header">
              <div className="code-header-left">
                <span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/>
                <span className="code-title">routes/pdf.js</span>
              </div>
            </div>
            <pre>{`app.<span class="fn">get</span>(<span class="str">'/invoice/:id/pdf'</span>, <span class="kw">async</span> (req, res) => {
  <span class="kw">const</span> invoice = <span class="kw">await</span> <span class="fn">getInvoice</span>(req.params.id);
  <span class="kw">const</span> html = <span class="fn">renderInvoiceHTML</span>(invoice);

  <span class="kw">const</span> pdfRes = <span class="kw">await</span> fetch(<span class="str">'https://api.renderlyapi.com/v1/pdf/from-html'</span>, {
    method: <span class="str">'POST'</span>,
    headers: {
      <span class="str">'Authorization'</span>: <span class="str">\`Bearer \${process.env.RENDERLY_API_KEY}\`</span>,
      <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>,
    },
    body: JSON.<span class="fn">stringify</span>({ html, format: <span class="str">'A4'</span> }),
  });

  res.<span class="fn">setHeader</span>(<span class="str">'Content-Type'</span>, <span class="str">'application/pdf'</span>);
  res.<span class="fn">setHeader</span>(<span class="str">'Content-Disposition'</span>, <span class="str">\`attachment; filename="invoice-\${invoice.id}.pdf"\`</span>);
  pdfRes.body.<span class="fn">pipe</span>(res);
});`}</pre>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">3-step setup</h2>
          <div className="steps-list">
            {[
              { n:1, title:'Get your free API key', body:'Sign up at renderlyapi.com — your API key is generated instantly. No credit card, 50 free PDFs/month included.' },
              { n:2, title:'Set RENDERLY_API_KEY in your .env', body:'Store your key as an environment variable. Never hard-code it in source files.' },
              { n:3, title:'Call the API', body:'POST your HTML string to /v1/pdf/from-html. You\'ll receive a binary PDF response in under 200ms.' },
            ].map(s => (
              <div className="step" key={s.n}>
                <div className="step-n">{s.n}</div>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Also available for</h2>
          <div className="also-links">
            <a href="/pdf-api/python" className="also-link">Python</a>
            <a href="/pdf-api/php" className="also-link">PHP</a>
            <a href="/pdf-api/go" className="also-link">Go</a>
          </div>
        </section>

        <section className="cta-section">
          <h2>Generate your first PDF</h2>
          <p>Free account · API key in 60 seconds · No credit card</p>
          <a href="/auth/register" className="btn btn-primary btn-lg">Get started free →</a>
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
