export default function LandingPage() {
  return (
    <>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; color:#111827; }
        .container { max-width:1040px; margin:0 auto; padding:0 1.5rem; }
        .btn { display:inline-flex;align-items:center;gap:8px;padding:11px 22px;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;text-decoration:none;border:none; }
        .btn-primary { background:#2E75B6;color:#fff; }
        .btn-secondary { background:#fff;color:#111827;border:1px solid #E5E7EB; }
        pre { background:#0F172A;color:#E2E8F0;border-radius:10px;padding:1.25rem;font-size:13px;line-height:1.7;overflow-x:auto; }
        .kw{color:#93C5FD} .str{color:#86EFAC} .cm{color:#64748B}
      `}</style>

      {/* Nav */}
      <nav style={{borderBottom:'1px solid #E5E7EB',background:'#fff',position:'sticky',top:0,zIndex:10}}>
        <div className="container" style={{height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontWeight:800,fontSize:20,color:'#1F4E79',letterSpacing:'-0.5px'}}>Renderly</span>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <a href="/docs" style={{fontSize:14,color:'#6B7280',textDecoration:'none'}}>Docs</a>
            <a href="/pricing" style={{fontSize:14,color:'#6B7280',textDecoration:'none',marginRight:4}}>Pricing</a>
            <a href="/auth/login" className="btn btn-secondary" style={{padding:'7px 16px',fontSize:14}}>Sign in</a>
            <a href="/auth/register" className="btn btn-primary" style={{padding:'7px 16px',fontSize:14}}>Get started free</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{padding:'5rem 0 4rem',textAlign:'center',background:'#F8FAFD'}}>
        <div className="container">
          <div style={{display:'inline-block',background:'#DEEAF1',color:'#1F4E79',padding:'4px 14px',borderRadius:100,fontSize:13,fontWeight:500,marginBottom:24}}>
            50 free PDFs/month · No credit card needed
          </div>
          <h1 style={{fontSize:52,fontWeight:800,lineHeight:1.1,letterSpacing:'-1.5px',color:'#111827',marginBottom:20}}>
            HTML to PDF<br/>in one API call.
          </h1>
          <p style={{fontSize:18,color:'#6B7280',maxWidth:520,margin:'0 auto 36px',lineHeight:1.7}}>
            POST your HTML. Get a pixel-perfect PDF back. Dead-simple, developer-friendly, priced for builders.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <a href="/auth/register" className="btn btn-primary" style={{fontSize:16,padding:'13px 28px'}}>Start for free →</a>
            <a href="/docs" className="btn btn-secondary" style={{fontSize:16,padding:'13px 28px'}}>Read the docs</a>
          </div>
        </div>
      </section>

      {/* Code demo */}
      <section style={{padding:'4rem 0',background:'#fff'}}>
        <div className="container" style={{maxWidth:720}}>
          <pre>{`<span class="cm"># Generate a PDF from HTML in under 100ms</span>

<span class="kw">curl</span> -X POST https://api.renderly.dev/v1/pdf/from-html \\
  -H <span class="str">"Authorization: Bearer rly_live_your_key"</span> \\
  -H <span class="str">"Content-Type: application/json"</span> \\
  -d <span class="str">'{"html": "&lt;h1&gt;Invoice #42&lt;/h1&gt;&lt;p&gt;Due: $1,200&lt;/p&gt;",
     "options": {"format": "A4", "margin": "1cm"}}'</span> \\
  --output invoice.pdf

<span class="cm"># → invoice.pdf saved  ✓  (avg 180ms)</span>`}</pre>
          <p style={{textAlign:'center',marginTop:20,fontSize:14,color:'#6B7280'}}>
            Works with any language · <a href="/docs#node">Node.js</a> · <a href="/docs#python">Python</a> · <a href="/docs#php">PHP</a> · any HTTP client
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{padding:'4rem 0',background:'#F8FAFD'}}>
        <div className="container">
          <h2 style={{fontSize:30,fontWeight:700,textAlign:'center',marginBottom:'2.5rem',color:'#1F4E79'}}>Everything you need, nothing you don't</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
            {[
              {icon:'⚡', title:'Blazing fast', body:'Warm browser pool means your first render is ready in under 200ms. No cold starts.'},
              {icon:'🎨', title:'Pixel-perfect rendering', body:'Powered by Chromium — the same engine your users see in Chrome. CSS, fonts, images all render correctly.'},
              {icon:'📐', title:'Full layout control', body:'A4, Letter, custom page sizes. Configurable margins, orientation, scale, headers, and footers.'},
              {icon:'🔑', title:'API key auth', body:'Simple Bearer token auth. Create, rotate, and revoke keys from the dashboard with one click.'},
              {icon:'📊', title:'Usage dashboard', body:'See exactly how many PDFs you've rendered this month. Know before you hit a limit.'},
              {icon:'⚙️', title:'Async webhooks', body:'For large documents, fire-and-forget. We call your webhook URL when the PDF is ready.'},
            ].map(f => (
              <div key={f.title} style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:12,padding:'1.25rem'}}>
                <div style={{fontSize:24,marginBottom:10}}>{f.icon}</div>
                <p style={{fontWeight:600,marginBottom:6}}>{f.title}</p>
                <p style={{fontSize:14,color:'#6B7280',lineHeight:1.6}}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section style={{padding:'4rem 0',background:'#fff',textAlign:'center'}}>
        <div className="container">
          <h2 style={{fontSize:30,fontWeight:700,marginBottom:12,color:'#1F4E79'}}>Pricing that scales with you</h2>
          <p style={{color:'#6B7280',marginBottom:'2rem',fontSize:16}}>Free forever for small projects. Upgrade when you're ready.</p>
          <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap',marginBottom:'2rem'}}>
            {[{plan:'Free',price:'$0',docs:'50/mo'},{plan:'Starter',price:'$19',docs:'500/mo'},{plan:'Pro',price:'$49',docs:'2k/mo'},{plan:'Scale',price:'$99',docs:'10k/mo'}].map(p=>(
              <div key={p.plan} style={{background:'#F8FAFD',border:'1px solid #E5E7EB',borderRadius:10,padding:'1rem 1.5rem',minWidth:120}}>
                <p style={{fontWeight:600,marginBottom:4}}>{p.plan}</p>
                <p style={{fontSize:22,fontWeight:700,color:'#2E75B6'}}>{p.price}</p>
                <p style={{fontSize:12,color:'#9CA3AF'}}>{p.docs}</p>
              </div>
            ))}
          </div>
          <a href="/pricing" className="btn btn-secondary">See full pricing →</a>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'4rem 0',background:'#1F4E79',textAlign:'center'}}>
        <div className="container">
          <h2 style={{fontSize:32,fontWeight:700,color:'#fff',marginBottom:12}}>Ready to generate your first PDF?</h2>
          <p style={{color:'#BDD7EE',marginBottom:28,fontSize:16}}>Free account. API key in 60 seconds. No credit card.</p>
          <a href="/auth/register" className="btn btn-primary" style={{background:'#fff',color:'#1F4E79',fontSize:16,padding:'13px 28px'}}>Get started free →</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:'1px solid #E5E7EB',padding:'2rem 0',background:'#fff'}}>
        <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
          <span style={{fontWeight:700,color:'#1F4E79'}}>Renderly</span>
          <div style={{display:'flex',gap:24}}>
            {['Docs','Pricing','Sign in','Register'].map(l=>(
              <a key={l} href={`/${l.toLowerCase().replace(' ','-')}`} style={{fontSize:13,color:'#6B7280',textDecoration:'none'}}>{l}</a>
            ))}
          </div>
          <span style={{fontSize:12,color:'#9CA3AF'}}>© 2026 Renderly</span>
        </div>
      </footer>
    </>
  );
}
