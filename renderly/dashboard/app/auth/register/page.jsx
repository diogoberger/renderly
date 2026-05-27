'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [apiKey, setApiKey]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Registration failed');
      setApiKey(data.api_key);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (apiKey) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--grey-bg)' }}>
        <div style={{ width:'100%', maxWidth:480, padding:'0 1rem' }}>
          <div className="card">
            <h2 style={{ fontSize:20, fontWeight:600, marginBottom:8, color:'var(--green)' }}>Account created!</h2>
            <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:20 }}>
              Your API key is shown below. <strong>Copy it now — it won't be shown again.</strong>
            </p>
            <div style={{ background:'#F9FAFB', border:'1px solid var(--grey-border)', borderRadius:'var(--radius)', padding:'12px 14px', fontFamily:'monospace', fontSize:13, wordBreak:'break-all', marginBottom:20, color:'var(--blue)' }}>
              {apiKey}
            </div>
            <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}
              onClick={() => { navigator.clipboard.writeText(apiKey); router.push('/dashboard'); }}>
              Copy key &amp; go to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--grey-bg)' }}>
      <div style={{ width:'100%', maxWidth:400, padding:'0 1rem' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <h1 style={{ fontSize:28, fontWeight:700, color:'var(--blue)' }}>Renderly</h1>
          <p style={{ color:'var(--text-muted)', marginTop:4 }}>Create your free account</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {error && (
              <div style={{ padding:'10px 14px', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'var(--radius)', color:'var(--danger)', fontSize:14 }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:500, marginBottom:6 }}>Email</label>
              <input type="email" required placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:500, marginBottom:6 }}>Password <span style={{color:'var(--text-muted)',fontWeight:400}}>(min 8 chars)</span></label>
              <input type="password" required minLength={8} placeholder="Create a password"
                value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
            <p style={{ fontSize:12, color:'var(--text-muted)', textAlign:'center' }}>
              50 free PDFs/month. No credit card required.
            </p>
          </form>
        </div>
        <p style={{ textAlign:'center', marginTop:16, fontSize:14, color:'var(--text-muted)' }}>
          Already have an account? <a href="/auth/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}
