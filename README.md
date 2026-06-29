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
| `/settings` | Settings | API key, agent config, heartbeat sc