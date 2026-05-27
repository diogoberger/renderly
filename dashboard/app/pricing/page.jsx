export default function PricingPage() {
  const plans = [
    { name:'Free', price:0, docs:50, features:['50 PDFs/month','5MB max HTML','A4, Letter, A3 formats','Community support'], cta:'Get started', href:'/auth/register', highlight:false },
    { name:'Starter', price:19, docs:500, features:['500 PDFs/month','20MB max HTML','Custom headers & footers','Email support','Overage at $0.06/doc'], cta:'Upgrade to Starter', href:'#', plan:'starter', highlight:false },
    { name:'Pro', price:49, docs:2000, features:['2,000 PDFs/month','50MB max HTML','Async + webhooks','Priority rendering','99.5% SLA','Overage at $0.04/doc'], cta:'Upgrade to Pro', href:'#', plan:'pro', highlight:true },
    { name:'Scale', price:99, docs:10000, features:['10,000 PDFs/month','100MB max HTML','All Pro features','99.9% SLA','Priority email support','Overage at $0.025/doc'], cta:'Upgrade to Scale', href:'#', plan:'scale', highlight:false },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'var(--grey-bg)' }}>
      <nav style={{ background:'#fff', borderBottom:'1px solid var(--grey-border)', padding:'0 2rem', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ fontWeight:700, fontSize:18, color:'var(--blue)', textDecoration:'none' }}>Renderly</a>
        <div style={{ display:'flex', gap:12 }}>
          <a href="/auth/login" className="btn btn-secondary btn-sm">Sign in</a>
          <a href="/auth/register" className="btn btn-primary btn-sm">Get started free</a>
        </div>
      </nav>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'3rem 1.5rem' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <h1 style={{ fontSize:36, fontWeight:700, color:'var(--blue)' }}>Simple, transparent pricing</h1>
          <p style={{ color:'var(--text-muted)', marginTop:12, fontSize:16 }}>Start free. Upgrade when you need more PDFs.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
          {plans.map(plan => (
            <div key={plan.name} className="card" style={{ position:'relative', border: plan.highlight ? '2px solid var(--blue-mid)' : undefined }}>
              {plan.highlight && (
                <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', background:'var(--blue-mid)', color:'#fff', fontSize:11, fontWeight:600, padding:'3px 14px', borderRadius:100 }}>
                  Most popular
                </div>
              )}
              <p style={{ fontWeight:700, fontSize:18, marginBottom:4 }}>{plan.name}</p>
              <div style={{ marginBottom:16 }}>
                <span style={{ fontSize:32, fontWeight:700, color:'var(--blue)' }}>${plan.price}</span>
                {plan.price > 0 && <span style={{ fontSize:14, color:'var(--text-muted)' }}>/month</span>}
              </div>
              <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:16 }}>{plan.docs.toLocaleString()} PDFs/month</p>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize:13, color:'var(--text-muted)', display:'flex', gap:8 }}>
                    <span style={{ color:'var(--blue-mid)', fontWeight:700, flexShrink:0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href={plan.href} className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width:'100%', justifyContent:'center', textDecoration:'none' }}
                data-plan={plan.plan}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p style={{ textAlign:'center', marginTop:'2rem', fontSize:13, color:'var(--text-muted)' }}>
          All plans include HTTPS, 99% uptime, and API key management. No contracts. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
