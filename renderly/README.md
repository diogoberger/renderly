# Renderly — HTML to PDF API

> POST your HTML. Get a pixel-perfect PDF back. Dead-simple, developer-friendly, priced for builders.

---

## Copy this project to your Desktop

Open **Terminal** and run this single command:

```bash
cp -r ~/Documents/Claude/Projects/FBA/renderly ~/Desktop/Renderly
```

Your project will appear as a **Renderly** folder on your Desktop. You can then open it in VS Code:

```bash
code ~/Desktop/Renderly
```

---

## Project Structure

```
renderly/
├── api/                  ← Node.js + Fastify backend (renders PDFs)
│   ├── src/
│   │   ├── db/           ← PostgreSQL client, migrations, stripe-setup
│   │   ├── middleware/   ← API key auth
│   │   ├── routes/       ← PDF, keys, usage, auth, billing, webhooks
│   │   └── services/     ← renderer (Puppeteer), metering, billing
│   ├── tests/            ← Integration & unit tests
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── dashboard/            ← Next.js 14 frontend (marketing + user dashboard)
│   ├── app/
│   │   ├── page.jsx      ← Landing page
│   │   ├── pricing/      ← Pricing page
│   │   ├── auth/         ← Login & register
│   │   └── dashboard/    ← User dashboard, API key management
│   ├── lib/              ← Auth (JWT sessions), API fetch helper
│   ├── vercel.json
│   └── package.json
├── docs/
│   └── index.html        ← Static API reference docs
└── railway.json          ← Railway deployment config
```

---

## Local Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (local install or Docker)
- A free [Stripe account](https://stripe.com) (test mode is fine)

### 1. Clone / move to your working directory

```bash
# If you ran the Desktop copy above, navigate there:
cd ~/Desktop/Renderly
```

### 2. Set up the API

```bash
cd api
cp .env.example .env
npm install
```

Edit `.env` with your values:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/renderly
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
DASHBOARD_URL=http://localhost:3000
API_URL=http://localhost:3001
```

**Create the database:**

```bash
psql -U postgres -c "CREATE DATABASE renderly;"
```

**Run migrations:**

```bash
npm run migrate
```

**Create Stripe products (run once):**

```bash
STRIPE_SECRET_KEY=sk_test_... node src/db/stripe-setup.js
```

Paste the output price IDs into your `.env`:

```env
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_SCALE=price_xxx
```

**Start the API:**

```bash
npm run dev
# → API running at http://localhost:3001
```

### 3. Set up the Dashboard

```bash
cd ../dashboard
cp .env.example .env.local
npm install
npm run dev
# → Dashboard running at http://localhost:3000
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
JWT_SECRET=any-random-32-char-string-here
```

### 4. Test it works

```bash
# Register an account
curl -X POST http://localhost:3001/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"secret123"}'

# Use the returned api_key to generate a PDF
curl -X POST http://localhost:3001/v1/pdf/from-html \
  -H "Authorization: Bearer rly_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>Hello, Renderly!</h1>"}' \
  --output hello.pdf

open hello.pdf   # macOS — opens the PDF
```

---

## Running Tests

```bash
cd api
npm test
```

Tests use Node's built-in test runner (no Jest required). The suite covers:
- Health endpoint
- Auth register/login flows
- Metering / plan limits

---

## Deployment

### API → Railway

1. Push the project to GitHub
2. Create a new Railway project → **Deploy from GitHub**
3. Add a PostgreSQL service (Railway auto-sets `DATABASE_URL`)
4. Set all environment variables from `.env.example` in the Railway dashboard
5. Railway picks up `railway.json` automatically — deploys the Dockerfile

**Important:** Set the Stripe webhook endpoint in the Stripe dashboard to:
```
https://YOUR_RAILWAY_URL/v1/webhooks/stripe
```

### Dashboard → Vercel

1. Import the `dashboard/` folder as a new Vercel project
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` → your Railway API URL
   - `JWT_SECRET` → a strong random secret
3. Deploy — Vercel picks up `vercel.json` automatically

---

## API Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/pdf/from-html` | Convert HTML string → PDF |
| `POST` | `/v1/pdf/from-url` | Render a live URL → PDF |
| `GET`  | `/v1/usage` | Current period usage & limits |
| `POST` | `/v1/keys` | Create a new API key |
| `GET`  | `/v1/keys` | List all keys (prefixes only) |
| `DELETE` | `/v1/keys/:id` | Revoke a key |
| `GET`  | `/v1/health` | Health check |

Full docs: `docs/index.html` (open in browser) or deploy alongside the dashboard.

---

## Pricing

| Plan | Price | PDFs/month |
|------|-------|-----------|
| Free | $0 | 50 |
| Starter | $19/mo | 500 |
| Pro | $49/mo | 2,000 |
| Scale | $99/mo | 10,000 |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API server | Node.js + Fastify |
| PDF rendering | Puppeteer (Chromium) |
| Database | PostgreSQL |
| Auth | bcrypt + Bearer tokens |
| Billing | Stripe Billing |
| Dashboard | Next.js 14 App Router |
| Sessions | jose (JWT, httpOnly cookie) |
| API hosting | Railway |
| Dashboard hosting | Vercel |

---

© 2026 Renderly
