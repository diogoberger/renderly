export const metadata = {
  title: 'Generate PDF Contracts via API — Renderly',
  description: 'Automate contract PDF generation. Turn HTML contract templates into signed-ready PDFs with a single API call.',
};

export default function ContractsPage() {
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
        .hero{padding:5rem 0 3rem;text-align:center}
        .use-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);color:#A5B4FC;padding:5px 14px;border-radius:100px;font-size:12px;font-weight:600;margin-bottom:20px}
        .hero h1{font-size:clamp(32px,5vw,52px);font-weight:900;letter-spacing:-1.5px;color:#F8FAFC;margin-bottom:16px;line-height:1.1}
        .hero h1 span{background:linear-gradient(135deg,#818CF8,#C084FC);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hero p{font-size:17px;color:#64748B;max-width:600px;margin:0 auto 36px;line-height:1.7}
        .hero-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:3rem}
        .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;padding:2.5rem 0}
        .feature-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:1.5rem}
        .feature-icon{font-size:24px;margin-bottom:10px}
        .feature-title{font-size:15px;font-weight:700;color:#F8FAFC;margin-bottom:6px}
        .feature-body{font-size:13px;color:#64748B;line-height:1.6}
        .section-title{font-size:22px;font-weight:800;color:#F8FAFC;margin-bottom:0.75rem;letter-spacing:-0.3px}
        .code-block{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;margin:1rem 0 2.5rem}
        .code-header{padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;gap:8px;align-items:center}
        .code-title{font-size:12px;color:#64748B;margin-left:4px}
        .dot{width:10px;height:10px;border-radius:50%}
        .dot-r{background:#FF5F57}.dot-y{background:#FFBD2E}.dot-g{background:#28C840}
        pre{padding:20px;font-family:'SF Mono',Monaco,'Fira Code',monospace;font-size:13px;line-height:1.8;color:#CBD5E1;overflow-x:auto;white-space:pre}
        .kw{color:#818CF8}.str{color:#86EFAC}.cm{color:#475569}.fn{color:#F472B6}
        .also-links{display:flex;gap:12px;flex-wrap:wrap;margin:0.5rem 0 2rem}
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
          <div className="use-badge">📝 Use case</div>
          <h1>Generate <span>PDF contracts</span><br/>ready to sign</h1>
          <p>Render service agreements, NDAs, and client contracts as PDFs on the fly. Your template + your data = a clean, professional PDF in milliseconds.</p>
          <div className="hero-ctas">
            <a href="/auth/register" className="btn btn-primary btn-lg">Start free →</a>
            <a href="/docs" className="btn btn-secondary btn-lg">View API docs</a>
          </div>
        </section>

        <div className="features-grid">
          {[
            { icon:'📄', title:'Multi-page contracts', body:'Long contracts paginate naturally. Use CSS page-break rules to control exactly where sections break across pages.' },
            { icon:'🔤', title:'Consistent typography', body:'Embed legal-weight fonts and ensure consistent formatting across every generated contract, regardless of operating system.' },
            { icon:'🖊️', title:'Signature-ready output', body:'Generate the PDF, then pass it to DocuSign, HelloSign, or any e-signature platform via their API for signing.' },
            { icon:'🔢', title:'Page numbers', body:'Add page numbers to every page footer — essential for legal documents — using the header/footer option (Pro+).' },
            { icon:'⚡', title:'Generated in milliseconds', body:'Contracts are ready in under 200ms. No delays when a user clicks "Download contract" in your app.' },
            { icon:'🔒', title:'No data retention', body:'Renderly does not store your HTML content or the generated PDF after delivery. Your contract data stays yours.' },
          ].map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-body">{f.body}</div>
            </div>
          ))}
        </div>

        <h2 className="section-title">Code example (Node.js)</h2>
        <div className="code-block">
          <div className="code-header">
            <span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/>
            <span className="code-title">generate-contract.js</span>
          </div>
          <pre>{`<span class="kw">async function</span> <span class="fn">generateContractPDF</span>(contract) {
  <span class="cm">// Render your Handlebars/EJS/Nunjucks template to HTML</span>
  <span class="kw">const</span> html = <span class="fn">renderTemplate</span>(<span class="str">'contract.html'</span>, {
    clientName:  contract.client.name,
    startDate:   contract.startDate,
    terms:       contract.terms,
    signatureLine: <span class="kw">true</span>,
  });

  <span class="kw">const</span> res = <span class="kw">await</span> fetch(<span class="str">'https://api.renderlyapi.com/v1/pdf/from-html'</span>, {
    method: <span class="str">'POST'</span>,
    headers: {
      <span class="str">'Authorization'</span>: <span class="str">\`Bearer \${process.env.RENDERLY_KEY}\`</span>,
      <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>,
    },
    body: JSON.<span class="fn">stringify</span>({
      html,
      format: <span class="str">'A4'</span>,
      marginTop: <span class="str">'25mm'</span>,
      marginBottom: <span class="str">'25mm'</span>,
      <span class="cm">// footerTemplate: '&lt;div style="font-size:9px;text-align:center"&gt;Page &lt;span class=pageNumber/&gt;&lt;/div&gt;',</span>
    }),
  });

  <span class="kw">return</span> Buffer.<span class="fn">from</span>(<span class="kw">await</span> res.<span class="fn">arrayBuffer</span>());
}`}</pre>
        </div>

        <h2 className="section-title">Other use cases</h2>
        <div className="also-links">
          <a href="/use-cases/invoices" className="also-link">🧾 PDF Invoices</a>
          <a href="/use-cases/reports" className="also-link">📊 PDF Reports</a>
          <a href="/use-cases/certificates" className="also-link">🎓 Certificates</a>
        </div>

        <section className="cta-section">
          <h2>Start generating contracts</h2>
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
