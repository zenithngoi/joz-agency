// Frontend API service — calls joz-backend
// In dev: http://localhost:3001
// In prod: set VITE_API_URL in Vercel env vars

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function req(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

export const api = {
  // health
  health:           ()             => req('GET',   '/api/health'),

  // agents
  getAgents:        ()             => req('GET',   '/api/agents'),
  getLoopStatus:    ()             => req('GET',   '/api/agents/loop/status'),
  startLoop:        (clientId)     => req('POST',  '/api/agents/loop/start', { clientId }),
  runAgent:         (id, clientId, context) => req('POST', `/api/agents/${id}/run`, { clientId, context }),

  // clients
  getClients:       ()             => req('GET',   '/api/clients'),
  getClient:        (id)           => req('GET',   `/api/clients/${id}`),
  createClient:     (data)         => req('POST',  '/api/clients', data),
  updateClient:     (id, data)     => req('PATCH', `/api/clients/${id}`, data),

  // memory
  getMemory:        (params = {})  => req('GET',   '/api/memory?' + new URLSearchParams(params)),
  addMemory:        (data)         => req('POST',  '/api/memory', data),
  recordMemoryWin:  (id, win)      => req('PATCH', `/api/memory/${id}/win`, { win }),

  // ads
  getAds:           (client)       => req('GET',   `/api/ads${client ? '?client='+client : ''}`),
  approveAd:        (id, action)   => req('POST',  `/api/ads/${id}/approve`, { action }),

  // pipeline
  getPipeline:      ()             => req('GET',   '/api/pipeline'),
  addCard:          (data)         => req('POST',  '/api/pipeline/card', data),
  moveCard:         (id, toStage)  => req('PATCH', `/api/pipeline/card/${id}/move`, { toStage }),

  // heartbeat
  getHeartbeat:     (limit = 50)   => req('GET',   `/api/heartbeat?limit=${limit}`),
}
