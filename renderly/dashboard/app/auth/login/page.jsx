'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Login failed');
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--grey-bg)' }}>
      <div style={{ width:'100%', maxWidth:400, padding:'0 1rem' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <h1 style={{ fontSize:28, fontWeight:700, color:'var(--blue)' }}>Renderly</h1>
          <p style={{ color:'var(--text-muted)', marginTop:4 }}>Sign in to your account</p>
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
              <label style={{ display:'block', fontSize:13, fontWeight:500, marginBottom:6 }}>Password</label>
              <input type="password" required placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
        <p style={{ textAlign:'center', marginTop:16, fontSize:14, color:'var(--text-muted)' }}>
          No account? <a href="/auth/register">Sign up free</a>
        </p>
      </div>
    </div>
  );
}
