export const metadata = {
  title: 'Generate PDF Reports via API — Renderly',
  description: 'Automate business report PDF generation. Turn your HTML/CSS dashboards and data tables into shareable PDFs with a single API call.',
};

export default function ReportsPage() {
  const sharedCSS = `
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
    .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;padding:3rem 0}
    .feature-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:1.5rem}
    .feature-icon{font-size:24px;margin-bottom:10px}
    .feature-title{font-size:15px;font-weight:700;color:#F8FAFC;margin-bottom:6px}
    .feature-body{font-size:13px;color:#64748B;line-height:1.6}
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
    h2.section-title{font-size:22px;font-weight:800;color:#F8FAFC;margin-bottom:0.75rem;letter-spacing:-0.3px}
  `;

  return (
    <>
      <style>{sharedCSS}</style>

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
          <div className="use-badge">📊 Use case</div>
          <h1>Turn your data into<br/><span>PDF reports</span> instantly</h1>
          <p>Schedule weekly reports, generate on-demand dashboards, or let users export data — all with a single API call. No PDF library, no server setup.</p>
          <div className="hero-ctas">
            <a href="/auth/register" className="btn btn-primary btn-lg">Start free →</a>
            <a href="/docs" className="btn btn-secondary btn-lg">View API docs</a>
          </div>
        </section>

        <div className="features-grid">
          {[
            { icon:'📈', title:'Charts and tables render correctly', body:'Renderly uses full Chrome rendering — your Chart.js, D3, or HTML table renders exactly as it looks in a browser.' },
            { icon:'📅', title:'Scheduled or on-demand', body:'Trigger PDF generation from a cron job, a user button click, or a webhook. Any HTTP client works.' },
            { icon:'📄', title:'Multi-page reports', body:'Long HTML renders naturally across multiple pages. Configure margins and page breaks with CSS print rules.' },
            { icon:'🔤', title:'Custom headers and footers', body:'Add page numbers, report title, and date to every page header and footer using HTML templates (Pro+).' },
            { icon:'⚡', title:'Fast at volume', body:'Generate 100 reports concurrently. No thread pool management or queue tuning on your end.' },
            { icon:'🌍', title:'Any template engine', body:'Use Handlebars, Jinja2, Twig, Blade — any tool that outputs HTML works with Renderly.' },
          ].map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-body">{f.body}</div>
            </div>
          ))}
        </div>

        <h2 className="section-title">Code example (Python)</h2>
        <div className="code-block">
          <div className="code-header">
            <span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/>
            <span className="code-title">weekly_report.py</span>
          </div>
          <pre>{`<span class="kw">import</span> requests
<span class="kw">from</span> jinja2 <span class="kw">import</span> Template

template = Template(<span class="fn">open</span>(<span class="str">"report.html"</span>).<span class="fn">read</span>())
html = template.<span class="fn">render</span>(data=<span class="fn">get_weekly_data</span>())

res = requests.<span class="fn">post</span>(
    <span class="str">"https://api.renderlyapi.com/v1/pdf/from-html"</span>,
    headers={<span class="str">"Authorization"</span>: <span class="str">f"Bearer {RENDERLY_KEY}"</span>},
    json={<span class="str">"html"</span>: html, <span class="str">"format"</span>: <span class="str">"A4"</span>, <span class="str">"landscape"</span>: <span class="kw">True</span>},
)
<span class="fn">email_report</span>(res.content)  <span class="cm"># attach PDF to weekly email</span>`}</pre>
        </div>

        <h2 className="section-title">Other use cases</h2>
        <div className="also-links">
          <a href="/use-cases/invoices" className="also-link">🧾 PDF Invoices</a>
          <a href="/use-cases/certificates" className="also-link">🎓 Certificates</a>
          <a href="/use-cases/contracts" className="also-link">📝 Contracts</a>
        </div>

        <section className="cta-section">
          <h2>Start generating reports</h2>
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
