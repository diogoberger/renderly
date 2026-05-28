'use client';

import { useState, useEffect } from 'react';

const PROXY = '/api/proxy';

export default function KeysPage() {
  const [keys, setKeys]         = useState([]);
  const [newKey, setNewKey]     = useState('');
  const [keyName, setKeyName]   = useState('');
  const [loading, setLoading]   = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => { loadKeys(); }, []);

  async function loadKeys() {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${PROXY}?path=keys`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to load keys'); setKeys([]); }
      else setKeys(data.keys ?? []);
    } catch { setError('Network error — please refresh.'); }
    setLoading(false);
  }

  async function createKey() {
    setCreating(true);
    setError('');
    try {
      const res  = await fetch(`${PROXY}?path=keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName.trim() || 'New Key' }),
      });
      const data = await res.json();
      if (data.key) { setNewKey(data.key); setKeyName(''); loadKeys(); }
      else setError(data.error ?? 'Failed to create key');
    } catch { setError('Network error.'); }
    setCreating(false);
  }

  async function revokeKey(id) {
    if (!confirm('Revoke this key? Any app using it will stop working immediately.')) return;
    try {
      await fetch(`${PROXY}?path=keys/${id}`, { method: 'DELETE' });
      loadKeys();
    } catch { setError('Failed to revoke key.'); }
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <style>{`
        html, body { background:#020817 !important; color:#F8FAFC !important; }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Inter',system-ui,-apple-system,sans-serif; background:#020817; color:#F8FAFC; }

        .nav { border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(2,8,23,0.9); position:sticky; top:0; z-index:50; backdrop-filter:blur(16px); }
        .nav-inner { max-width:760px; margin:0 auto; padding:0 1.5rem; height:64px; display:flex; align-items:center; justify-content:space-between; }
        .logo { font-weight:800; font-size:20px; background:linear-gradient(135deg,#818CF8,#C084FC); -webkit-background-clip:text; -webkit-text-fill-color:transparent; text-decoration:none; }
        .nav-title { font-size:14px; font-weight:500; color:#64748B; }

        .container { max-width:760px; margin:0 auto; padding:2.5rem 1.5rem; display:flex; flex-direction:column; gap:14px; }

        .page-title { font-size:24px; font-weight:800; letter-spacing:-0.5px; color:#F8FAFC; margin-bottom:1.5rem; }

        .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:1.5rem; }

        .error-box { background:rgba(220,38,38,0.08); border:1px solid rgba(220,38,38,0.2); border-radius:10px; padding:12px 16px; font-size:13px; color:#FCA5A5; }

        .success-box { background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2); border-radius:10px; padding:1rem; }
        .success-title { font-size:13px; font-weight:600; color:#34D399; margin-bottom:8px; }
        .key-display { display:flex; gap:8px; align-items:center; }
        .key-code { flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:8px 12px; font-size:12.5px; font-family:monospace; color:#E2E8F0; word-break:break-all; }

        .input-row { display:flex; gap:8px; }
        input[type="text"] {
          flex:1; padding:10px 14px; background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1); border-radius:8px;
          font-size:14px; color:#F8FAFC; outline:none;
          transition:border-color .2s;
        }
        input[type="text"]::placeholder { color:#475569; }
        input[type="text"]:focus { border-color:rgba(99,102,241,0.6); box-shadow:0 0 0 3px rgba(99,102,241,0.15); }

        .btn { display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:none; transition:all .2s; white-space:nowrap; }
        .btn:disabled { opacity:0.5; cursor:not-allowed; }
        .btn-primary { background:linear-gradient(135deg,#6366F1,#8B5CF6); color:#fff; box-shadow:0 0 16px rgba(99,102,241,0.3); }
        .btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 0 24px rgba(99,102,241,0.45); }
        .btn-copy { background:rgba(255,255,255,0.08); color:#F8FAFC; border:1px solid rgba(255,255,255,0.12); padding:8px 14px; }
        .btn-copy:hover { background:rgba(255,255,255,0.13); }
        .btn-revoke { background:rgba(220,38,38,0.1); color:#FCA5A5; border:1px solid rgba(220,38,38,0.2); padding:6px 14px; font-size:12px; }
        .btn-revoke:hover { background:rgba(220,38,38,0.18); }

        .section-title { font-size:14px; font-weight:600; color:#F8FAFC; margin-bottom:14px; }

        .key-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
        .key-row:last-child { border-bottom:none; padding-bottom:0; }
        .key-name { font-size:14px; font-weight:500; color:#F8FAFC; margin-bottom:4px; }
        .key-prefix { font-size:12px; font-family:monospace; color:#475569; margin-bottom:2px; }
        .key-meta { font-size:11px; color:#334155; }

        .empty-state { font-size:13px; color:#475569; padding:8px 0; }

        .info-box { background:rgba(99,102,241,0.06); border:1px solid rgba(99,102,241,0.15); border-radius:10px; padding:14px 16px; font-size:13px; color:#64748B; line-height:1.6; }
        .info-box strong { color:#818CF8; }

        @media (max-width:520px) {
          .input-row { flex-direction:column; }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">
          <a href="/dashboard" className="logo">← Renderly</a>
          <span className="nav-title">API Keys</span>
        </div>
      </nav>

      <div className="container">
        <h1 className="page-title">API Keys</h1>

        {error && <div className="error-box">{error}</div>}

        {newKey && (
          <div className="success-box">
            <p className="success-title">✓ Key created — copy it now. It won&apos;t be shown again.</p>
            <div className="key-display">
              <code className="key-code">{newKey}</code>
              <button className="btn btn-copy" onClick={() => copy(newKey)}>{copied ? '✓ Copied!' : 'Copy'}</button>
            </div>
          </div>
        )}

        {/* Create key */}
        <div className="card">
          <p className="section-title">Create a new key</p>
          <div className="input-row">
            <input
              type="text"
              placeholder="Key name (e.g. Production)"
              value={keyName}
              onChange={e => setKeyName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createKey()}
            />
            <button className="btn btn-primary" onClick={createKey} disabled={creating}>
              {creating ? 'Creating…' : '+ Create key'}
            </button>
          </div>
        </div>

        {/* Key list */}
        <div className="card">
          <p className="section-title">Your API keys</p>

          {loading && <p className="empty-state">Loading keys…</p>}

          {!loading && keys.length === 0 && !error && (
            <p className="empty-state">No active keys. Create one above.</p>
          )}

          {keys.map(k => (
            <div key={k.id} className="key-row">
              <div>
                <p className="key-name">{k.name}</p>
                <p className="key-prefix">{k.key_prefix}••••••••••••••••</p>
                <p className="key-meta">
                  Created {new Date(k.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                  {k.last_used_at
                    ? ` · Last used ${new Date(k.last_used_at).toLocaleDateString('en-US', { month:'short', day:'numeric' })}`
                    : ' · Never used'}
                </p>
              </div>
              <button className="btn btn-revoke" onClick={() => revokeKey(k.id)}>Revoke</button>
            </div>
          ))}
        </div>

        <div className="info-box">
          <strong>Keep your keys secret.</strong> Never expose them in client-side code or public repositories. If a key is compromised, revoke it immediately and create a new one.
        </div>
      </div>
    </>
  );
}
