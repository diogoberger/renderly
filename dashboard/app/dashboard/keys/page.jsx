'use client';

import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function KeysPage() {
  const [keys, setKeys]         = useState([]);
  const [newKey, setNewKey]     = useState('');
  const [keyName, setKeyName]   = useState('');
  const [loading, setLoading]   = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied]     = useState(false);

  // NOTE: In a real implementation the Bearer token would come from a cookie/session.
  // For now, the user pastes their API key — this is fine for MVP.
  const [bearerToken, setBearerToken] = useState('');

  async function loadKeys() {
    if (!bearerToken) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API}/v1/keys`, { headers: { Authorization: `Bearer ${bearerToken}` } });
      const data = await res.json();
      setKeys(data.keys ?? []);
    } catch {}
    setLoading(false);
  }

  async function createKey() {
    if (!bearerToken) return;
    setCreating(true);
    try {
      const res  = await fetch(`${API}/v1/keys`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, 'Content-Type':'application/json' },
        body: JSON.stringify({ name: keyName || 'New Key' }),
      });
      const data = await res.json();
      if (data.key) { setNewKey(data.key); loadKeys(); }
    } catch {}
    setCreating(false);
  }

  async function revokeKey(id) {
    if (!confirm('Revoke this key? Any app using it will stop working immediately.')) return;
    await fetch(`${API}/v1/keys/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    loadKeys();
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

        {/* Auth input (MVP approach) */}
        <div className="card">
          <p style={{ fontSize:13, fontWeight:500, marginBottom:8 }}>Enter your API key to manage keys</p>
          <div style={{ display:'flex', gap:8 }}>
            <input type="password" placeholder="rly_live_..." value={bearerToken}
              onChange={e => setBearerToken(e.target.value)} style={{ flex:1 }} />
            <button className="btn btn-primary btn-sm" onClick={loadKeys}>Load</button>
          </div>
        </div>

        {/* New key revealed */}
        {newKey && (
          <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'var(--radius)', padding:'1rem' }}>
            <p style={{ fontSize:13, fontWeight:600, color:'var(--green)', marginBottom:8 }}>New key created — copy it now, it won't be shown again.</p>
            <div style={{ display:'flex', gap:8 }}>
              <code style={{ flex:1, background:'#fff', border:'1px solid #BBF7D0', borderRadius:'var(--radius)', padding:'8px 12px', fontSize:13, wordBreak:'break-all' }}>{newKey}</code>
              <button className="btn btn-secondary btn-sm" onClick={() => copy(newKey)}>{copied ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>
        )}

        {/* Create new key */}
        <div className="card">
          <p style={{ fontWeight:600, marginBottom:12 }}>Create new key</p>
          <div style={{ display:'flex', gap:8 }}>
            <input placeholder="Key name (e.g. Production)" value={keyName} onChange={e => setKeyName(e.target.value)} style={{ flex:1 }} />
            <button className="btn btn-primary btn-sm" onClick={createKey} disabled={creating}>
              {creating ? 'Creating…' : '+ Create key'}
            </button>
          </div>
        </div>

        {/* Key list */}
        <div className="card">
          <p style={{ fontWeight:600, marginBottom:16 }}>Active keys</p>
          {!bearerToken && <p style={{ fontSize:13, color:'var(--text-muted)' }}>Enter your API key above to load your keys.</p>}
          {bearerToken && loading && <p style={{ fontSize:13, color:'var(--text-muted)' }}>Loading…</p>}
          {bearerToken && !loading && keys.length === 0 && <p style={{ fontSize:13, color:'var(--text-muted)' }}>No active keys found.</p>}
          {keys.map(k => (
            <div key={k.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--grey-border)' }}>
              <div>
                <p style={{ fontWeight:500, fontSize:14 }}>{k.name}</p>
                <p style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'monospace' }}>{k.key_prefix}••••••••</p>
                <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>
                  Created {new Date(k.created_at).toLocaleDateString()}
                  {k.last_used_at ? ` · Last used ${new Date(k.last_used_at).toLocaleDateString()}` : ' · Never used'}
                </p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => revokeKey(k.id)}>Revoke</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
