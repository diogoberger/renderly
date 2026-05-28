export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        html, body { background:#020817 !important; color:#F8FAFC !important; }

        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Inter',system-ui,-apple-system,sans-serif; color:#F8FAFC; background:#020817; }
        .container { max-width:1100px; margin:0 auto; padding:0 1.5rem; }

        /* Buttons */
        .btn { display:inline-flex;align-items:center;gap:8px;padding:11px 22px;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;text-decoration:none;border:none;transition:all 0.2s; }
        .btn-primary { background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;box-shadow:0 0 20px rgba(99,102,241,0.4); }
        .btn-primary:hover { transform:translateY(-1px);box-shadow:0 0 30px rgba(99,102,241,0.6); }
        .btn-secondary { background:rgba(255,255,255,0.06);color:#F8FAFC;border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(8px); }
        .btn-secondary:hover { background:rgba(255,255,255,0.1);transform:translateY(-1px); }
        .btn-dark { background:#fff;color:#0A0F1E;font-weight:600; }
        .btn-dark:hover { background:#F1F5F9;transform:translateY(-1px); }

        /* Nav */
        .nav { border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(2,8,23,0.8);position:sticky;top:0;z-index:50;backdrop-filter:blur(16px); }
        .nav-inner { height:64px;display:flex;align-items:center;justify-content:space-between; }
        .logo { font-weight:800;font-size:20px;background:linear-gradient(135deg,#818CF8,#C084FC);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.5px; }
        .nav-links { display:flex;gap:8px;align-items:center; }
        .nav-link { font-size:14px;color:#94A3B8;text-decoration:none;padding:6px 12px;border-radius:6px;transition:color 0.2s; }
        .nav-link:hover { color:#F8FAFC; }

        /* Hero */
        .hero { padding:6rem 0 5rem;text-align:center;position:relative;overflow:hidden; }
        .hero-glow { position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:800px;height:600px;background:radial-gradient(ellipse,rgba(99,102,241,0.15) 0%,transparent 70%);pointer-events:none; }
        .hero-badge { display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);color:#A5B4FC;padding:6px 16px;border-radius:100px;font-size:13px;font-weight:500;margin-bottom:28px; }
        .badge-dot { width:6px;height:6px;background:#6366F1;border-radius:50%;animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        .hero h1 { font-size:clamp(42px,6vw,72px);font-weight:900;line-height:1.05;letter-spacing:-2px;color:#F8FAFC;margin-bottom:24px; }
        .hero h1 span { background:linear-gradient(135deg,#818CF8 0%,#C084FC 50%,#F472B6 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
        .hero-sub { font-size:18px;color:#94A3B8;max-width:520px;margin:0 auto 40px;line-height:1.7; }
        .hero-ctas { display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:60px; }

        /* Demo visual */
        .demo-visual { max-width:900px;margin:0 auto;display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center; }
        .demo-card { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden; }
        .demo-card-header { padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:8px; }
        .dot { width:10px;height:10px;border-radius:50%; }
        .dot-red{background:#FF5F57} .dot-yellow{background:#FFBD2E} .dot-green{background:#28C840}
        .demo-card-header span { font-size:12px;color:#64748B;margin-left:4px; }
        .demo-code { padding:20px;font-family:'SF Mono',Monaco,'Fira Code',monospace;font-size:12.5px;line-height:1.8;color:#CBD5E1; }
        .kw{color:#818CF8} .str{color:#86EFAC} .cm{color:#475569} .fn{color:#F472B6} .num{color:#FB923C}

        .arrow-col { display:flex;flex-direction:column;align-items:center;gap:8px; }
        .arrow-badge { background:linear-gradient(135deg,#6366F1,#8B5CF6);border-radius:12px;padding:12px 16px;font-size:12px;font-weight:700;color:#fff;text-align:center;white-space:nowrap;box-shadow:0 0 24px rgba(99,102,241,0.5); }
        .arrow-line { width:2px;height:30px;background:linear-gradient(to bottom,rgba(99,102,241,0.6),transparent); }

        /* PDF mockup */
        .pdf-mock { background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5); }
        .pdf-toolbar { background:#F1F5F9;padding:8px 12px;display:flex;align-items:center;gap:6px;border-bottom:1px solid #E2E8F0; }
        .pdf-toolbar span { font-size:11px;color:#64748B;flex:1;text-align:center; }
        .pdf-body { padding:20px;color:#1E293B; }
        .pdf-logo-bar { display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px; }
        .pdf-company { font-size:18px;font-weight:800;color:#1E293B; }
        .pdf-label { font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:1px; }
        .pdf-divider { height:2px;background:linear-gradient(to right,#6366F1,#C084FC);border-radius:2px;margin-bottom:14px; }
        .pdf-row { display:flex;justify-content:space-between;margin-bottom:8px;font-size:11px; }
        .pdf-row .label { color:#64748B; }
        .pdf-row .val { font-weight:600;color:#1E293B; }
        .pdf-items { background:#F8FAFC;border-radius:6px;padding:10px;margin-bottom:10px; }
        .pdf-item { display:flex;justify-content:space-between;font-size:10px;padding:3px 0;color:#475569; }
        .pdf-total { display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#1E293B;border-top:1px solid #E2E8F0;padding-top:8px; }
        .pdf-stamp { display:inline-block;border:2px solid #10B981;color:#10B981;font-size:10px;font-weight:700;padding:3px 10px;border-radius:4px;transform:rotate(-8deg);letter-spacing:1px;margin-top:8px; }

        /* Stats bar */
        .stats-bar { padding:3rem 0;border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06); }
        .stats-grid { display:flex;justify-content:center;gap:4rem;flex-wrap:wrap; }
        .stat { text-align:center; }
        .stat-num { font-size:32px;font-weight:800;background:linear-gradient(135deg,#818CF8,#C084FC);-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
        .stat-label { font-size:13px;color:#64748B;margin-top:4px; }

        /* How it works */
        .hiw { padding:5rem 0; }
        .section-label { font-size:12px;font-weight:600;color:#818CF8;text-transform:uppercase;letter-spacing:2px;text-align:center;margin-bottom:16px; }
        .section-title { font-size:36px;font-weight:800;text-align:center;color:#F8FAFC;margin-bottom:12px;letter-spacing:-0.5px; }
        .section-sub { font-size:16px;color:#64748B;text-align:center;margin-bottom:3rem; }
        .steps { display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1px;background:rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.06); }
        .step { background:#020817;padding:2rem;position:relative; }
        .step-num { font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px; }
        .step-icon { font-size:28px;margin-bottom:12px; }
        .step-title { font-size:16px;font-weight:700;color:#F8FAFC;margin-bottom:8px; }
        .step-body { font-size:14px;color:#64748B;line-height:1.6; }

        /* Features */
        .features { padding:5rem 0;background:rgba(255,255,255,0.01); }
        .features-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-top:3rem; }
        .feature-card { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:1.5rem;transition:all 0.2s; }
        .feature-card:hover { background:rgba(99,102,241,0.05);border-color:rgba(99,102,241,0.3);transform:translateY(-2px); }
        .feature-icon { width:40px;height:40px;background:rgba(99,102,241,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:14px; }
        .feature-title { font-size:15px;font-weight:700;color:#F8FAFC;margin-bottom:6px; }
        .feature-body { font-size:13px;color:#64748B;line-height:1.6; }

        /* Pricing */
        .pricing { padding:5rem 0; }
        .pricing-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:3rem; }
        .pricing-card { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:1.5rem;transition:all 0.2s; }
        .pricing-card.featured { background:rgba(99,102,241,0.08);border-color:rgba(99,102,241,0.4);position:relative; }
        .pricing-badge { position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;font-size:11px;font-weight:700;padding:3px 12px;border-radius:100px;white-space:nowrap; }
        .pricing-plan { font-size:13px;font-weight:600;color:#94A3B8;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px; }
        .pricing-price { font-size:36px;font-weight:800;color:#F8FAFC;margin-bottom:4px; }
        .pricing-price span { font-size:14px;font-weight:400;color:#64748B; }
        .pricing-docs { font-size:13px;color:#64748B;margin-bottom:16px; }
        .pricing-features { list-style:none;display:flex;flex-direction:column;gap:8px; }
        .pricing-features li { font-size:13px;color:#94A3B8;display:flex;align-items:center;gap:8px; }
        .pricing-features li::before { content:'✓';color:#10B981;font-weight:700;font-size:12px; }

        /* CTA */
        .cta-section { padding:6rem 0;text-align:center;position:relative;overflow:hidden; }
        .cta-glow { position:absolute;bottom:-100px;left:50%;transform:translateX(-50%);width:600px;height:400px;background:radial-gradient(ellipse,rgba(99,102,241,0.2) 0%,transparent 70%);pointer-events:none; }
        .cta-section h2 { font-size:clamp(32px,5vw,52px);font-weight:900;letter-spacing:-1px;color:#F8FAFC;margin-bottom:16px; }
        .cta-section p { font-size:17px;color:#64748B;margin-bottom:36px; }

        /* Footer */
        .footer { border-top:1px solid rgba(255,255,255,0.06);padding:2.5rem 0;background:#020817; }
        .footer-inner { display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px; }
        .footer-links { display:flex;gap:24px; }
        .footer-link { font-size:13px;color:#475569;text-decoration:none;transition:color 0.2s; }
        .footer-link:hover { color:#94A3B8; }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <div className="container nav-inner">
          <span className="logo">Renderly</span>
          <div className="nav-links">
            <a href="/docs" className="nav-link">Docs</a>
            <a href="/pricing" className="nav-link">Pricing</a>
            <a href="/auth/login" className="btn btn-secondary" style={{padding:'7px 16px',fontSize:14}}>Sign in</a>
            <a href="/auth/register" className="btn btn-primary" style={{padding:'7px 16px',fontSize:14}}>Get started free</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-glow"/>
        <div className="container">
          <div className="hero-badge">
            <span className="badge-dot"/>
            50 free PDFs/month · No credit card needed
          </div>
          <h1>
            HTML to PDF.<br/>
            <span>One API call.</span>
          </h1>
          <p className="hero-sub">
            POST your HTML, get a pixel-perfect PDF back in milliseconds. Dead-simple, developer-first, built on Chromium.
          </p>
          <div className="hero-ctas">
            <a href="/auth/register" className="btn btn-primary" style={{fontSize:16,padding:'14px 30px'}}>Start for free →</a>
            <a href="/docs" className="btn btn-secondary" style={{fontSize:16,padding:'14px 30px'}}>Read the docs</a>
          </div>

          {/* Visual demo */}
          <div className="demo-visual">
            {/* Input card */}
            <div className="demo-card">
              <div className="demo-card-header">
                <span className="dot dot-red"/><span className="dot dot-yellow"/><span className="dot dot-green"/>
                <span>your-app.js</span>
              </div>
              <div className="demo-code">
                <div><span className="kw">const</span> pdf = <span className="kw">await</span> fetch(</div>
                <div style={{paddingLeft:16}}><span className="str">'https://api.renderlyapi.com</span></div>
                <div style={{paddingLeft:16}}><span className="str">/v1/pdf/from-html'</span>,</div>
                <div>{`  {`}</div>
                <div style={{paddingLeft:16}}><span className="kw">method</span>: <span className="str">'POST'</span>,</div>
                <div style={{paddingLeft:16}}><span className="kw">headers</span>: {`{`}</div>
                <div style={{paddingLeft:32}}><span className="str">'Authorization'</span>:</div>
                <div style={{paddingLeft:40}}><span className="str">'Bearer rly_live_…'</span></div>
                <div style={{paddingLeft:16}}>{`},`}</div>
                <div style={{paddingLeft:16}}><span className="kw">body</span>: JSON.<span className="fn">stringify</span>({`({`}</div>
                <div style={{paddingLeft:32}}><span className="kw">html</span>: invoiceHTML</div>
                <div style={{paddingLeft:16}}>{`})`}</div>
                <div>{`  }`}</div>
                <div>{`)`}</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="arrow-col">
              <div className="arrow-line"/>
              <div className="arrow-badge">⚡ Renderly<br/>API</div>
              <div className="arrow-line"/>
              <div style={{color:'#6366F1',fontSize:20}}>→</div>
            </div>

            {/* PDF output */}
            <div className="pdf-mock">
              <div className="pdf-toolbar">
                <span className="dot dot-red"/><span className="dot dot-yellow"/><span className="dot dot-green"/>
                <span>invoice_042.pdf</span>
              </div>
              <div className="pdf-body">
                <div className="pdf-logo-bar">
                  <div>
                    <div className="pdf-company">Acme Corp</div>
                    <div className="pdf-label">Invoice</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:10,color:'#94A3B8'}}>Invoice #042</div>
                    <div style={{fontSize:10,color:'#94A3B8'}}>May 28, 2026</div>
                  </div>
                </div>
                <div className="pdf-divider"/>
                <div className="pdf-row">
                  <span className="label">Bill to</span>
                  <span className="val">John Smith</span>
                </div>
                <div className="pdf-row">
                  <span className="label">Due date</span>
                  <span className="val">Jun 15, 2026</span>
                </div>
                <div className="pdf-items">
                  <div className="pdf-item">
                    <span>API Platform License</span><span>$1,200.00</span>
                  </div>
                  <div className="pdf-item">
                    <span>Support Package</span><span>$300.00</span>
                  </div>
                </div>
                <div className="pdf-total">
                  <span>Total</span><span>$1,500.00</span>
                </div>
                <div><span className="pdf-stamp">PAID</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {[
              {num:'< 200ms', label:'Average render time'},
              {num:'99.9%',   label:'API uptime SLA'},
              {num:'A4 + Letter', label:'Page format support'},
              {num:'Free',    label:'To get started'},
            ].map(s => (
              <div className="stat" key={s.label}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="hiw">
        <div className="container">
          <div className="section-label">How it works</div>
          <h2 className="section-title">Three steps to your first PDF</h2>
          <p className="section-sub">No SDK required. Any language, any framework.</p>
          <div className="steps">
            {[
              {n:'Step 01', icon:'🔑', title:'Get your API key', body:'Sign up free. Your API key is generated instantly on registration — no waiting, no approval.'},
              {n:'Step 02', icon:'📤', title:'POST your HTML', body:'Send any HTML — from a simple string to a full-page template with CSS, images, and custom fonts.'},
              {n:'Step 03', icon:'📄', title:'Receive your PDF', body:'Get a pixel-perfect PDF in the response body, ready to stream, save, or attach to an email.'},
            ].map(s => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-body">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything you need, nothing you don't</h2>
          <div className="features-grid">
            {[
              {icon:'⚡', title:'Blazing fast renders', body:'Warm browser pool means your first render is ready in under 200ms. No cold starts, no waiting.'},
              {icon:'🎨', title:'Pixel-perfect output', body:'Powered by Chromium — the same engine Chrome uses. CSS Grid, custom fonts, and images all render correctly.'},
              {icon:'📐', title:'Full layout control', body:'A4, Letter, custom sizes. Configurable margins, orientation, scale, headers, and footers per request.'},
              {icon:'🔑', title:'Simple API key auth', body:'Bearer token auth that takes 30 seconds to set up. Create, rotate, and revoke keys from your dashboard.'},
              {icon:'📊', title:'Usage dashboard', body:'See exactly how many PDFs you have rendered this month. Know your usage before you hit a limit.'},
              {icon:'🌐', title:'URL to PDF too', body:'Pass a URL instead of raw HTML and we will navigate to the page and capture it as a perfect PDF.'},
            ].map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-body">{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing">
        <div className="container">
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Scales with you</h2>
          <p className="section-sub">Free forever for small projects. Upgrade when you need more.</p>
          <div className="pricing-grid">
            {[
              {plan:'Free', price:'$0', period:'', docs:'50 PDFs/mo', features:['API key access','From-HTML endpoint','From-URL endpoint','Usage dashboard'], featured:false},
              {plan:'Starter', price:'$19', period:'/mo', docs:'500 PDFs/mo', features:['Everything in Free','Priority rendering','Email support','Webhook callbacks'], featured:true},
              {plan:'Pro', price:'$49', period:'/mo', docs:'2,000 PDFs/mo', features:['Everything in Starter','Custom headers/footers','Team API keys','SLA guarantee'], featured:false},
              {plan:'Scale', price:'$99', period:'/mo', docs:'10,000 PDFs/mo', features:['Everything in Pro','Volume discounts','Dedicated support','Custom retention'], featured:false},
            ].map(p => (
              <div className={`pricing-card${p.featured ? ' featured' : ''}`} key={p.plan}>
                {p.featured && <div className="pricing-badge">Most popular</div>}
                <div className="pricing-plan">{p.plan}</div>
                <div className="pricing-price">{p.price}<span>{p.period}</span></div>
                <div className="pricing-docs">{p.docs}</div>
                <ul className="pricing-features">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'2rem'}}>
            <a href="/pricing" className="btn btn-secondary">See full pricing details →</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-glow"/>
        <div className="container">
          <h2>Ready to generate<br/>your first PDF?</h2>
          <p>Free account. API key in 60 seconds. No credit card required.</p>
          <a href="/auth/register" className="btn btn-primary" style={{fontSize:17,padding:'15px 36px'}}>
            Get started free →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="logo" style={{fontSize:16}}>Renderly</span>
          <div className="footer-links">
            {[['Docs','/docs'],['Pricing','/pricing'],['Sign in','/auth/login'],['Register','/auth/register']].map(([l,h])=>(
              <a key={l} href={h} className="footer-link">{l}</a>
            ))}
          </div>
          <span style={{fontSize:12,color:'#334155'}}>© 2026 Renderly</span>
        </div>
      </footer>
    </>
  );
}
