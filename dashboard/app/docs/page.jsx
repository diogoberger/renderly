export const metadata = {
  title: 'Renderly API Docs — HTML to PDF',
  description: 'Complete API reference for Renderly. POST HTML, get a PDF back in milliseconds.',
};

export default function DocsPage() {
  return (
    <>
      <style>{`
        html, body { background:#020817 !important; color:#F8FAFC !important; }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Inter',system-ui,-apple-system,sans-serif; background:#020817; color:#F8FAFC; line-height:1.6; }

        a { color:#818CF8; text-decoration:none; }
        a:hover { text-decoration:underline; }

        /* Nav */
        .nav { border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(2,8,23,0.9); position:sticky; top:0; z-index:50; backdrop-filter:blur(16px); }
        .nav-inner { max-width:1200px; margin:0 auto; padding:0 1.5rem; height:60px; display:flex; align-items:center; justify-content:space-between; }
        .logo { font-weight:800; font-size:18px; background:linear-gradient(135deg,#818CF8,#C084FC); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .nav-right { display:flex; gap:16px; align-items:center; font-size:14px; }

        /* Layout */
        .layout { max-width:1200px; margin:0 auto; padding:0 1.5rem; display:grid; grid-template-columns:220px 1fr; gap:3rem; min-height:calc(100vh - 60px); }

        /* Sidebar */
        .sidebar { padding:2rem 0; position:sticky; top:60px; height:calc(100vh - 60px); overflow-y:auto; }
        .sidebar-section { margin-bottom:1.5rem; }
        .sidebar-heading { font-size:11px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:8px; }
        .sidebar-link { display:block; font-size:14px; color:#94A3B8; padding:5px 0; transition:color 0.15s; }
        .sidebar-link:hover { color:#F8FAFC; text-decoration:none; }
        .sidebar-link.active { color:#818CF8; }

        /* Content */
        .content { padding:2rem 0 4rem; }
        .content h1 { font-size:32px; font-weight:800; color:#F8FAFC; letter-spacing:-0.5px; margin-bottom:12px; }
        .content h2 { font-size:22px; font-weight:700; color:#F8FAFC; margin:3rem 0 12px; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.06); }
        .content h3 { font-size:16px; font-weight:700; color:#F8FAFC; margin:1.5rem 0 8px; }
        .content p { font-size:15px; color:#94A3B8; margin-bottom:12px; }
        .content ul { padding-left:1.5rem; color:#94A3B8; font-size:15px; margin-bottom:12px; }
        .content ul li { margin-bottom:4px; }

        /* Badges */
        .method { display:inline-block; padding:2px 10px; border-radius:6px; font-size:12px; font-weight:700; font-family:monospace; margin-right:8px; }
        .post { background:rgba(99,102,241,0.2); color:#818CF8; }
        .get  { background:rgba(16,185,129,0.15); color:#34D399; }

        /* Endpoint */
        .endpoint { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:1.5rem; margin:1rem 0 2rem; }
        .endpoint-path { font-family:monospace; font-size:15px; color:#F8FAFC; font-weight:600; }

        /* Code blocks */
        pre { background:#0F172A; border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:1.25rem; font-size:13px; line-height:1.8; overflow-x:auto; margin:0.75rem 0 1.5rem; color:#CBD5E1; }
        code { font-family:'SF Mono',Monaco,'Fira Code',monospace; font-size:13px; }
        .inline-code { background:rgba(255,255,255,0.08); padding:2px 7px; border-radius:5px; font-family:monospace; font-size:13px; color:#E2E8F0; }

        /* Parameter table */
        .param-table { width:100%; border-collapse:collapse; margin:0.75rem 0 1.5rem; font-size:14px; }
        .param-table th { text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase; letter-spacing:1px; padding:8px 12px; border-bottom:1px solid rgba(255,255,255,0.06); }
        .param-table td { padding:10px 12px; border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:top; }
        .param-table td:first-child { font-family:monospace; font-size:13px; color:#818CF8; white-space:nowrap; }
        .param-table td:nth-child(2) { color:#94A3B8; }
        .param-table td:last-child { color:#64748B; }

        /* Response block */
        .response-block { background:rgba(16,185,129,0.05); border:1px solid rgba(16,185,129,0.15); border-radius:10px; padding:1.25rem; margin:0.75rem 0 1.5rem; }
        .response-status { font-size:12px; font-weight:700; color:#34D399; margin-bottom:8px; text-transform:uppercase; letter-spacing:1px; }

        /* Alert */
        .alert { border-radius:10px; padding:1rem 1.25rem; margin:1rem 0; font-size:14px; }
        .alert-info  { background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.2); color:#A5B4FC; }
        .alert-warn  { background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); color:#FCD34D; }

        /* Plans table */
        .plans-table { width:100%; border-collapse:collapse; margin:0.75rem 0 1.5rem; font-size:14px; }
        .plans-table th { text-align:left; padding:10px 14px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:12px; color:#475569; text-transform:uppercase; letter-spacing:1px; }
        .plans-table td { padding:12px 14px; border-bottom:1px solid rgba(255,255,255,0.04); color:#94A3B8; }
        .plans-table td:first-child { font-weight:600; color:#F8FAFC; }

        /* Syntax highlighting */
        .kw  { color:#818CF8; }
        .str { color:#86EFAC; }
        .cm  { color:#475569; }
        .num { color:#FB923C; }

        /* Keyword chips */
        .chip { display:inline-block; background:rgba(255,255,255,0.06); border-radius:5px; padding:1px 8px; font-size:12px; color:#94A3B8; margin:0 3px; font-family:monospace; }

        /* Mobile */
        @media (max-width:768px) {
          .layout { grid-template-columns:1fr; }
          .sidebar { display:none; }
          .content h1 { font-size:24px; }
          .content h2 { font-size:18px; }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">Renderly</a>
          <div className="nav-right">
            <a href="/auth/login" style={{color:'#94A3B8'}}>Dashboard</a>
            <a href="/auth/register" style={{background:'linear-gradient(135deg,#6366F1,#8B5CF6)',color:'#fff',padding:'6px 16px',borderRadius:8,fontSize:13,fontWeight:500}}>Get started free</a>
          </div>
        </div>
      </nav>

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-heading">Getting started</div>
            <a href="#quickstart" className="sidebar-link">Quickstart</a>
            <a href="#authentication" className="sidebar-link">Authentication</a>
            <a href="#base-url" className="sidebar-link">Base URL</a>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-heading">Endpoints</div>
            <a href="#from-html" className="sidebar-link">POST /pdf/from-html</a>
            <a href="#from-url" className="sidebar-link">POST /pdf/from-url</a>
            <a href="#usage" className="sidebar-link">GET /usage</a>
            <a href="#keys" className="sidebar-link">GET /keys</a>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-heading">Reference</div>
            <a href="#options" className="sidebar-link">PDF options</a>
            <a href="#errors" className="sidebar-link">Errors</a>
            <a href="#rate-limits" className="sidebar-link">Rate limits</a>
            <a href="#plans" className="sidebar-link">Plans & limits</a>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-heading">Examples</div>
            <a href="#example-invoice" className="sidebar-link">Invoice PDF</a>
            <a href="#example-curl" className="sidebar-link">cURL</a>
            <a href="#example-node" className="sidebar-link">Node.js</a>
            <a href="#example-python" className="sidebar-link">Python</a>
          </div>
        </aside>

        {/* Main content */}
        <main className="content">
          <h1>API Reference</h1>
          <p style={{fontSize:17, color:'#94A3B8', marginBottom:'2rem'}}>
            POST your HTML, get a pixel-perfect PDF back. Built on Chromium — every CSS property, custom font, and image renders exactly as it does in Chrome.
          </p>

          <div className="alert alert-info">
            <strong>Base URL:</strong> <span className="inline-code">https://api.renderlyapi.com</span>
          </div>

          {/* Quickstart */}
          <h2 id="quickstart">Quickstart</h2>
          <p>Get your first PDF in under 60 seconds:</p>
          <p><strong style={{color:'#F8FAFC'}}>1.</strong> <a href="/auth/register">Create a free account</a> — your API key is generated instantly.</p>
          <p><strong style={{color:'#F8FAFC'}}>2.</strong> Make a POST request with your HTML:</p>
          <pre><code>{`curl -X POST https://api.renderlyapi.com/v1/pdf/from-html \\
  -H "Authorization: Bearer rly_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"html":"<h1 style=\\"font-family:sans-serif\\">Hello!</h1>"}' \\
  --output hello.pdf`}</code></pre>
          <p>You'll get a PDF file back immediately. That's it.</p>

          {/* Authentication */}
          <h2 id="authentication">Authentication</h2>
          <p>All API requests must include your API key in the <span className="inline-code">Authorization</span> header:</p>
          <pre><code>Authorization: Bearer rly_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx</code></pre>
          <p>You can manage your API keys from the <a href="/dashboard/keys">dashboard</a>. Keys start with <span className="inline-code">rly_live_</span>.</p>
          <div className="alert alert-warn">
            Never expose your API key in client-side JavaScript or public repositories. If a key is compromised, revoke it immediately from your dashboard.
          </div>

          {/* FROM-HTML */}
          <h2 id="from-html">POST /v1/pdf/from-html</h2>
          <p>Convert an HTML string to a PDF. The most common endpoint.</p>

          <div className="endpoint">
            <span className="method post">POST</span>
            <span className="endpoint-path">https://api.renderlyapi.com/v1/pdf/from-html</span>
          </div>

          <h3>Request body</h3>
          <table className="param-table">
            <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td>html</td><td>string</td><td>✓ required</td><td>Full HTML string to render. Can include inline CSS, external fonts, images.</td></tr>
              <tr><td>format</td><td>string</td><td>optional</td><td><span className="chip">A4</span><span className="chip">Letter</span><span className="chip">Legal</span> — defaults to <span className="inline-code">A4</span></td></tr>
              <tr><td>landscape</td><td>boolean</td><td>optional</td><td>Rotate to landscape. Default <span className="inline-code">false</span></td></tr>
              <tr><td>margin</td><td>object</td><td>optional</td><td>Page margins. Keys: <span className="chip">top</span><span className="chip">right</span><span className="chip">bottom</span><span className="chip">left</span> — values like <span className="inline-code">"1cm"</span>, <span className="inline-code">"20px"</span></td></tr>
              <tr><td>scale</td><td>number</td><td>optional</td><td>Viewport scale factor 0.1–2.0. Default <span className="inline-code">1</span></td></tr>
              <tr><td>print_background</td><td>boolean</td><td>optional</td><td>Include CSS backgrounds. Default <span className="inline-code">true</span></td></tr>
              <tr><td>wait_for</td><td>string</td><td>optional</td><td><span className="chip">load</span><span className="chip">domcontentloaded</span><span className="chip">networkidle0</span><span className="chip">networkidle2</span></td></tr>
            </tbody>
          </table>

          <h3>Example</h3>
          <pre><code>{`{
  "html": "<html><body style='font-family:sans-serif; padding:40px'><h1>Invoice #001</h1><p>Amount: €500</p></body></html>",
  "format": "A4",
  "margin": { "top": "1cm", "right": "1cm", "bottom": "1cm", "left": "1cm" }
}`}</code></pre>

          <div className="response-block">
            <div className="response-status">200 OK — application/pdf</div>
            <code>Binary PDF data in response body</code>
          </div>

          {/* FROM-URL */}
          <h2 id="from-url">POST /v1/pdf/from-url</h2>
          <p>Navigate to a URL and capture it as a PDF. Useful for generating PDFs from existing web pages.</p>

          <div className="endpoint">
            <span className="method post">POST</span>
            <span className="endpoint-path">https://api.renderlyapi.com/v1/pdf/from-url</span>
          </div>

          <h3>Request body</h3>
          <table className="param-table">
            <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td>url</td><td>string</td><td>✓ required</td><td>Publicly accessible URL to capture. Must include <span className="inline-code">https://</span></td></tr>
              <tr><td>format</td><td>string</td><td>optional</td><td>Same as from-html. Default <span className="inline-code">A4</span></td></tr>
              <tr><td>landscape</td><td>boolean</td><td>optional</td><td>Default <span className="inline-code">false</span></td></tr>
              <tr><td>margin</td><td>object</td><td>optional</td><td>Page margins</td></tr>
              <tr><td>wait_for</td><td>string</td><td>optional</td><td>Wait condition. Default <span className="inline-code">networkidle2</span></td></tr>
            </tbody>
          </table>

          <h3>Example</h3>
          <pre><code>{`{
  "url": "https://example.com/report",
  "format": "A4",
  "landscape": false,
  "wait_for": "networkidle2"
}`}</code></pre>

          <div className="response-block">
            <div className="response-status">200 OK — application/pdf</div>
            <code>Binary PDF data in response body</code>
          </div>

          {/* USAGE */}
          <h2 id="usage">GET /v1/usage</h2>
          <p>Returns your current period usage and 6-month history.</p>

          <div className="endpoint">
            <span className="method get">GET</span>
            <span className="endpoint-path">https://api.renderlyapi.com/v1/usage</span>
          </div>

          <h3>Response</h3>
          <pre><code>{`{
  "plan": "free",
  "period": "2026-05",
  "docs_rendered": 12,
  "docs_limit": 50,
  "docs_remaining": 38,
  "reset_date": "2026-06-01",
  "history": [
    { "period": "2026-05", "docs_rendered": 12 },
    { "period": "2026-04", "docs_rendered": 31 }
  ]
}`}</code></pre>

          {/* PDF OPTIONS */}
          <h2 id="options">PDF options reference</h2>
          <table className="param-table">
            <thead><tr><th>Option</th><th>Values</th><th>Default</th></tr></thead>
            <tbody>
              <tr><td>format</td><td><span className="chip">A4</span><span className="chip">A3</span><span className="chip">A5</span><span className="chip">Letter</span><span className="chip">Legal</span><span className="chip">Tabloid</span></td><td>A4</td></tr>
              <tr><td>landscape</td><td>true / false</td><td>false</td></tr>
              <tr><td>margin.top</td><td>CSS length (e.g. "1cm", "20px", "0")</td><td>"0"</td></tr>
              <tr><td>margin.right</td><td>CSS length</td><td>"0"</td></tr>
              <tr><td>margin.bottom</td><td>CSS length</td><td>"0"</td></tr>
              <tr><td>margin.left</td><td>CSS length</td><td>"0"</td></tr>
              <tr><td>scale</td><td>0.1 – 2.0</td><td>1</td></tr>
              <tr><td>print_background</td><td>true / false</td><td>true</td></tr>
              <tr><td>wait_for</td><td><span className="chip">load</span><span className="chip">domcontentloaded</span><span className="chip">networkidle0</span><span className="chip">networkidle2</span></td><td>load</td></tr>
            </tbody>
          </table>

          {/* ERRORS */}
          <h2 id="errors">Errors</h2>
          <p>All errors follow the same shape:</p>
          <pre><code>{`{
  "error": {
    "code": "unauthorized",
    "message": "Missing or invalid API key."
  }
}`}</code></pre>
          <table className="param-table">
            <thead><tr><th>HTTP status</th><th>Code</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td>400</td><td>invalid_input</td><td>Missing required field or bad value</td></tr>
              <tr><td>401</td><td>unauthorized</td><td>Missing, invalid, or revoked API key</td></tr>
              <tr><td>429</td><td>rate_limited</td><td>Too many requests — slow down</td></tr>
              <tr><td>402</td><td>quota_exceeded</td><td>Monthly PDF limit reached for your plan</td></tr>
              <tr><td>500</td><td>internal_error</td><td>Something went wrong on our end</td></tr>
            </tbody>
          </table>

          {/* RATE LIMITS */}
          <h2 id="rate-limits">Rate limits</h2>
          <p>Requests are rate-limited per API key to prevent abuse. When you exceed the limit you'll receive a <span className="inline-code">429</span> response. Limits are:</p>
          <ul>
            <li>60 requests per minute per API key</li>
            <li>Monthly PDF limits depend on your plan (see below)</li>
          </ul>

          {/* PLANS */}
          <h2 id="plans">Plans & limits</h2>
          <table className="plans-table">
            <thead><tr><th>Plan</th><th>PDFs / month</th><th>Max HTML size</th><th>Price</th></tr></thead>
            <tbody>
              <tr><td>Free</td><td>50</td><td>5 MB</td><td>€0</td></tr>
              <tr><td>Starter</td><td>500</td><td>20 MB</td><td>€19/mo</td></tr>
              <tr><td>Pro</td><td>2,000</td><td>50 MB</td><td>€49/mo</td></tr>
              <tr><td>Scale</td><td>10,000</td><td>100 MB</td><td>€99/mo</td></tr>
            </tbody>
          </table>
          <p><a href="/pricing">View full pricing details →</a></p>

          {/* EXAMPLES */}
          <h2 id="example-invoice">Example — Invoice PDF</h2>
          <pre><code>{`const res = await fetch('https://api.renderlyapi.com/v1/pdf/from-html', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer rly_live_YOUR_KEY',
    'Content-Type':  'application/json',
  },
  body: JSON.stringify({
    html: \`
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', sans-serif; padding: 48px; color: #111; }
            h1   { font-size: 28px; margin-bottom: 4px; }
            .meta  { color: #888; font-size: 14px; margin-bottom: 32px; }
            table  { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; }
            th     { font-size: 12px; text-transform: uppercase; color: #888; }
            .total { font-weight: 700; font-size: 18px; }
          </style>
        </head>
        <body>
          <h1>Invoice #001</h1>
          <p class="meta">Acme Corp · May 28, 2026</p>
          <table>
            <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
            <tr><td>API Platform License</td><td>1</td><td>€1,200.00</td></tr>
            <tr><td>Support Package</td><td>1</td><td>€300.00</td></tr>
            <tr><td class="total">Total</td><td></td><td class="total">€1,500.00</td></tr>
          </table>
        </body>
      </html>
    \`,
    format: 'A4',
    margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
  }),
});

const buffer = await res.arrayBuffer();
fs.writeFileSync('invoice.pdf', Buffer.from(buffer));`}</code></pre>

          <h2 id="example-curl">cURL</h2>
          <pre><code>{`curl -X POST https://api.renderlyapi.com/v1/pdf/from-html \\
  -H "Authorization: Bearer rly_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"html":"<h1>Hello Renderly</h1>","format":"A4"}' \\
  --output document.pdf`}</code></pre>

          <h2 id="example-node">Node.js</h2>
          <pre><code>{`// Works with node-fetch, undici, or the built-in fetch (Node 18+)
import fs from 'fs';

async function renderPDF(html) {
  const res = await fetch('https://api.renderlyapi.com/v1/pdf/from-html', {
    method: 'POST',
    headers: {
      Authorization:  'Bearer rly_live_YOUR_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ html, format: 'A4' }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error.message);
  }

  const buffer = await res.arrayBuffer();
  fs.writeFileSync('output.pdf', Buffer.from(buffer));
}

await renderPDF('<h1>My document</h1>');`}</code></pre>

          <h2 id="example-python">Python</h2>
          <pre><code>{`import requests

def render_pdf(html: str, output_path: str = "output.pdf"):
    res = requests.post(
        "https://api.renderlyapi.com/v1/pdf/from-html",
        headers={
            "Authorization": "Bearer rly_live_YOUR_KEY",
            "Content-Type":  "application/json",
        },
        json={"html": html, "format": "A4"},
    )
    res.raise_for_status()
    with open(output_path, "wb") as f:
        f.write(res.content)

render_pdf("<h1>Hello from Python!</h1>")`}</code></pre>

        </main>
      </div>
    </>
  );
}
