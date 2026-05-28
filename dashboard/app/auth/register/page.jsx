'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const authStyle = `
  html, body { background:#020817 !important; color:#F8FAFC !important; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Inter',system-ui,-apple-system,sans-serif; background:#020817; color:#F8FAFC; }
  .wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1.5rem; }
  .box { width:100%; max-width:420px; }
  .logo-row { text-align:center; margin-bottom:2rem; }
  .logo { font-weight:800; font-size:24px; background:linear-gradient(135deg,#818CF8,#C084FC); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .tagline { font-size:14px; color:#475569; margin-top:6px; }
  .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:1.75rem; }
  .form { display:flex; flex-direction:column; gap:16px; }
  .field { display:flex; flex-direction:column; gap:6px; }
  .label { font-size:13px; font-weight:500; color:#94A3B8; }
  .label-hint { font-size:12px; color:#334155; font-weight:400; }
  input { padding:10px 14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; font-size:14px; color:#F8FAFC; outline:none; width:100%; transition:border-color .2s; }
  input::placeholder { color:#334155; }
  input:focus { border-color:rgba(99,102,241,0.6); box-shadow:0 0 0 3px rgba(99,102,241,0.12); }
  .btn-submit { display:flex; align-items:center; justify-content:center; width:100%; padding:11px 20px; background:linear-gradient(135deg,#6366F1,#8B5CF6); color:#fff; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; box-shadow:0 0 20px rgba(99,102,241,0.3); transition:all .2s; }
  .btn-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 0 28px rgba(99,102,241,0.45); }
  .btn-submit:disabled { opacity:0.6; cursor:not-allowed; }
  .error { background:rgba(220,38,38,0.08); border:1px solid rgba(220,38,38,0.2); border-radius:8px; padding:10px 14px; font-size:13px; color:#FCA5A5; }
  .free-note { font-size:12px; color:#334155; text-align:center; }
  .footer-link { text-align:center; margin-top:16px; font-size:13px; color:#475569; }
  .footer-link a { color:#818CF8; text-decoration:none; }
  .footer-link a:hover { text-decoration:underline; }
  .success-card { background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.2); border-radius:16px; padding:1.75rem; }
  .success-title { font-size:20px; font-weight:700; color:#34D399; margin-bottom:8px; }
  .success-sub { font-size:14px; color:#64748B; margin-bottom:20px; line-height:1.6; }
  .key-box { background:rgba(255,255,255,0.04); border:1px solid rgba(16,185,129,0.25); border-radius:8px; padding:12px 14px; font-family:monospace; font-size:13px; color:#A7F3D0; word-break:break-all; margin-bottom:16px; }
  .btn-copy { display:flex; align-items:center; justify-content:center; width:100%; padding:11px 20px; background:linear-gradient(135deg,#6366F1,#8B5CF6); color:#fff; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; box-shadow:0 0 20px rgba(99,102,241,0.3); transition:all .2s; }
  .btn-copy:hover { transform:translateY(-1px); }
`;

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
      <>
        <style>{authStyle}</style>
        <div className="wrap">
          <div className="box">
            <div className="logo-row">
              <div className="logo">Renderly</div>
            </div>
            <div className="success-card">
              <h2 className="success-title">🎉 Account created!</h2>
              <p className="success-sub">
                Your API key is below. <strong style={{color:'#F8FAFC'}}>Copy it now — it won&apos;t be shown again.</strong>
              </p>
              <div className="key-box">{apiKey}</div>
              <button className="btn-copy"
                onClick={() => { navigator.clipboard.writeText(apiKey); router.push('/dashboard'); }}>
                Copy key &amp; go to dashboard →
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{authStyle}</style>
      <div className="wrap">
        <div className="box">
          <div className="logo-row">
            <div className="logo">Renderly</div>
            <p className="tagline">Create your free account</p>
          </div>
          <div className="card">
            <form className="form" onSubmit={handleSubmit}>
              {error && <div className="error">{error}</div>}
              <div className="field">
                <label className="label">Email</label>
                <input type="email" required placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
              </div>
              <div className="field">
                <label className="label">
                  Password <span className="label-hint">(min 8 chars)</span>
                </label>
                <input type="password" required minLength={8} placeholder="Create a password"
                  value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Creating account…' : 'Create free account'}
              </button>
              <p className="free-note">50 free PDFs/month · No credit card required</p>
            </form>
          </div>
          <p className="footer-link">
            Already have an account? <a href="/auth/login">Sign in →</a>
          </p>
        </div>
      </div>
    </>
  );
}
