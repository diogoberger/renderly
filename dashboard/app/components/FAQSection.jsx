'use client';
import { useState } from 'react';

const FAQS = [
  {
    q: 'What exactly does Renderly do?',
    a: 'Renderly converts HTML + CSS into a PDF via a single REST API call. You POST your HTML (plus any options like page size or margins) and get a binary PDF back in the response. No browser to spin up, no Puppeteer to configure, no Chromium binaries to bundle.',
  },
  {
    q: 'Do I need to install an SDK or library?',
    a: 'No. Renderly is a plain HTTP API — use fetch, axios, curl, or any HTTP client in any language. There is nothing to install. Your API key is the only credential you need.',
  },
  {
    q: 'What HTML and CSS features are supported?',
    a: 'Everything Chromium supports, which is essentially the full modern web platform — CSS Grid, Flexbox, custom web fonts (via @font-face or Google Fonts), SVGs, images, CSS variables, media queries, and more. If it renders in Chrome, it renders in Renderly.',
  },
  {
    q: 'How fast is a typical render?',
    a: 'Most requests complete in under 200 ms. Renderly keeps a warm pool of browser instances running, so there are no cold starts. Render time scales with the complexity of your HTML — a simple invoice is near-instant, a 50-page report with heavy assets takes a bit longer.',
  },
  {
    q: 'Can I add headers, footers, page numbers, and custom margins?',
    a: 'Yes. Every request accepts optional fields for headerTemplate, footerTemplate (HTML strings with page number placeholders), margin (top/right/bottom/left), format (A4, Letter, etc.), and orientation (portrait or landscape).',
  },
  {
    q: 'What happens when I hit my monthly PDF limit?',
    a: 'Requests beyond your plan limit return a 429 response. Your existing PDFs and API keys are never deleted. You can upgrade your plan at any time from the dashboard and the new quota takes effect immediately.',
  },
  {
    q: 'Does Renderly store my HTML or generated PDFs?',
    a: 'No. HTML sent in the request body is processed in memory and discarded once the PDF is returned. Renderly does not store, log, or cache your content. Only aggregate usage counts (number of renders) are stored for billing purposes.',
  },
  {
    q: 'Can I pass a URL instead of raw HTML?',
    a: 'Yes. Use the from-url endpoint and pass a public URL. Renderly navigates to the page, waits for it to fully render (including JavaScript), and returns the PDF — identical to printing from Chrome.',
  },
  {
    q: 'Is there a free plan? Do I need a credit card to start?',
    a: 'The Free plan gives you 50 PDFs per month with no credit card required. Upgrade to a paid plan only when you need more volume or advanced features like webhook callbacks or team API keys.',
  },
  {
    q: 'Where do I find the full API reference?',
    a: 'The complete API reference — including all request parameters, response formats, error codes, and code examples in JavaScript, Python, PHP, and curl — is in the Docs.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <>
      <style>{`
        .faq { padding:5rem 0; }
        .faq-list { margin-top:3rem; display:flex; flex-direction:column; gap:1px;
                    border-radius:14px; overflow:hidden;
                    border:1px solid rgba(255,255,255,0.07); }
        .faq-item { background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.06); }
        .faq-item:last-child { border-bottom:none; }
        .faq-question {
          width:100%; background:none; border:none; cursor:pointer;
          display:flex; justify-content:space-between; align-items:center;
          padding:1.25rem 1.5rem; text-align:left; gap:1rem;
          transition:background 0.15s;
        }
        .faq-question:hover { background:rgba(99,102,241,0.05); }
        .faq-question-text { font-size:15px; font-weight:600; color:#F8FAFC; line-height:1.4; }
        .faq-chevron {
          flex-shrink:0; width:20px; height:20px;
          color:#6366F1; transition:transform 0.2s;
        }
        .faq-chevron.open { transform:rotate(180deg); }
        .faq-answer {
          overflow:hidden;
          max-height:0;
          transition:max-height 0.25s ease, padding 0.2s;
        }
        .faq-answer.open {
          max-height:300px;
        }
        .faq-answer-inner {
          padding:0 1.5rem 1.25rem;
          font-size:14px; color:#94A3B8; line-height:1.75;
        }
        .faq-answer-inner a { color:#818CF8; text-decoration:none; }
        .faq-answer-inner a:hover { text-decoration:underline; }

        @media(max-width:768px) {
          .faq-question { padding:1rem 1.25rem; }
          .faq-question-text { font-size:14px; }
          .faq-answer-inner { padding:0 1.25rem 1rem; }
        }
      `}</style>

      <section className="faq">
        <div className="container">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">Common questions</h2>
          <p className="section-sub">Everything you need to know before your first API call.</p>

          <div className="faq-list" role="list">
            {FAQS.map((item, i) => (
              <div className="faq-item" key={i} role="listitem">
                <button
                  className="faq-question"
                  onClick={() => toggle(i)}
                  aria-expanded={open === i}
                >
                  <span className="faq-question-text">{item.q}</span>
                  <svg
                    className={`faq-chevron${open === i ? ' open' : ''}`}
                    viewBox="0 0 20 20" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="5 8 10 13 15 8" />
                  </svg>
                </button>
                <div className={`faq-answer${open === i ? ' open' : ''}`} aria-hidden={open !== i}>
                  <div className="faq-answer-inner">
                    {i === FAQS.length - 1
                      ? <>The complete API reference — including all request parameters, response formats, error codes, and code examples in JavaScript, Python, PHP, and curl — is in <a href="/docs">the Docs</a>.</>
                      : item.a
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p style={{textAlign:'center',marginTop:'2rem',fontSize:14,color:'#475569'}}>
            Still have questions?{' '}
            <a href="mailto:hello@renderlyapi.com" style={{color:'#818CF8',textDecoration:'none'}}>
              hello@renderlyapi.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
