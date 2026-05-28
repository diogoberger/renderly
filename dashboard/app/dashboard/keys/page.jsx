'use client';

import { useState, useEffect } from 'react';

// All calls go through the Next.js proxy which injects the session cookie
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
    <div style={{ minHeight:'100vh', background:'var(--grey-bg)' }}>
      <nav style={{ background:'#fff', borderBottom:'1px solid var(--grey-border)', padding:'0 2rem', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/dashboard" style={{ fontWeight:700, fontSize:18, color:'var(--blue)', textDecoration:'none' }}>← Renderly</a>
        <span style={{ fontSize:14, fontWeight:500 }}>API Keys</span>
      </nav>

      <div style={{ maxWidth:760, margin:'0 auto', padding:'2rem 1.5rem', display:'flex', flexDirection:'column', gap:20 }}>

        {/* Error banner */}
        {error && (
          <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'var(--radius)', padding:'12px 16px', fontSize:13, color:'var(--danger)' }}>
            {error}
          </div>
        )}

        {/* New key revealed */}
        {newKey && (
          <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'var(--radius)', padding:'1rem' }}>
            <p style={{ fontSize:13, fontWeight:600, color:'var(--green)', marginBottom:8 }}>
              ✓ New key created — copy it now. It won&apos;t be shown again.
            </p>
            <div style={{ display:'flex', gap:8 }}>
              <code style={{ flex:1, background:'#fff', border:'1px solid #BBF7D0', borderRadius:'var(--radius)', padding:'8px 12px', fontSize:13, wordBreak:'break-all' }}>{newKey}</code>
              <button className="btn btn-secondary btn-sm" onClick={() => copy(newKey)}>{copied ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>
        )}

        {/* Create new key */}
        <div className="card">
          <p style={{ fontWeight:600, marginBottom:12 }}>Create a new key</p>
          <div style={{ display:'flex', gap:8 }}>
            <input
              placeholder="Key name (e.g. Production)"
              value={keyName}
              onChange={e => setKeyName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createKey()}
              style={{ flex:1 }}
            />
            <button className="btn btn-primary btn-sm" onClick={createKey} disabled={creating}>
              {creating ? 'Creating…' : '+ Create key'}
            </button>
          </div>
        </div>

        {/* Key list */}
        <div className="card">
          <p style={{ fontWeight:600, marginBottom:16 }}>Your API keys</p>

          {loading && (
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>Loading keys…</p>
          )}

          {!loading && keys.length === 0 && !error && (
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>No active keys. Create one above.</p>
          )}

          {keys.map((k, i) => (
            <div key={k.id} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'12px 0',
              borderBottom: i < keys.length - 1 ? '1px solid var(--grey-border)' : 'none',
            }}>
              <div>
                <p style={{ fontWeight:500, fontSize:14 }}>{k.name}</p>
                <p style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'monospace', marginTop:2 }}>
                  {k.key_prefix}••••••••••••••••
                </p>
                <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>
                  Created {new Date(k.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                  {k.last_used_at
                    ? ` · Last used ${new Date(k.last_used_at).toLocaleDateString('en-US', { month:'short', day:'numeric' })}`
                    : ' · Never used'}
                </p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => revokeKey(k.id)}>Revoke</button>
            </div>
          ))}
        </div>

        {/* Info */}
        <div style={{ background:'var(--blue-light)', borderRadius:'var(--radius)', padding:'1rem', fontSize:13, color:'var(--blue)' }}>
          <strong>Keep your keys secret.</strong> Never expose them in client-side code or public repositories. If a key is compromised, revoke it immediately and create a new one.
        </div>
      </div>
    </div>
  );
}
