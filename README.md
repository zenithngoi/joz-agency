# JOZ Agency — Frontend

> Digital marketing agency operations dashboard
> Bloomberg/trading terminal aesthetic
> Live at: **https://joz-agency-k3ya.vercel.app**

---

## Stack

- **Vite + React** — SPA, 8 pages
- **react-router-dom** — client-side routing with SPA rewrite on Vercel
- **Design system** — Space Grotesk + IBM Plex Mono, `--ink:#0B0E14`, `--gold:#D4AF37`
- **API layer** — `src/api.js` — all backend calls go through this single module

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | KPI strip, agent roster, memory feed, client table |
| `/clients` | Clients | Client roster, profile pages, add client modal |
| `/content` | Content | 6-stage kanban pipeline (Ideas → Analyzed) |
| `/ads` | Ads | Ads book ranked by ROAS, kill/scale approval modal |
| `/memory` | Memory | Searchable memory library with tag/client filters |
| `/reports` | Reports | Weekly + monthly performance reports |
| `/settings` | Settings | API key, agent config, heartbeat schedule |

## Backend

Backend: `https://joz-backend-production.up.railway.app`
Repo: `zenithngoi/joz-backend` (private)

Set `VITE_API_URL` in Vercel environment variables to the Railway backend URL.
The `api.js` module falls back to `http://localhost:3001` for local dev.

## Local Development

```bash
npm install
npm run dev        # http://localhost:5173
```

Backend must be running locally on port 3001 for local dev.

## Deploy

Vercel auto-deploys from `main` branch on GitHub push.
`vercel.json` contains the SPA rewrite rule so all routes serve `index.html`.

## Security

- Anthropic API key lives in Railway env vars only — never in frontend code or browser
- Human approval required for all ad spend decisions — Ads agent only sets `pendingApproval` flag, never auto-executes
- CORS on backend: localhost + Vercel domain + `*.vercel.app` wildcard

## Agents

The 8-agent ApexOps loop runs on the backend:
Orchestrator → Research → Content → SEO/GEO → Publishing → Analytics → Ads → Memory

Trigger a loop from the Dashboard → Agent Roster → Start Loop (select a client).
