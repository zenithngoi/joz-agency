// Frontend API service -- calls joz-backend
// In dev: http://localhost:3001
// In prod: set VITE_API_URL in Vercel env vars

import { getAccessToken } from './supabaseClient.js'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// -- Cold-start resilience ----------------------------------------------
// Railway free/hobby tier backends can cold-start, so a request may hang or
// 502/503 for a few seconds while the container boots. We give every request
// a generous timeout, retry a few times with a gap, and broadcast a status
// so the UI (Layout.jsx) can show a "waking up" banner instead of a hard
// error. This wraps fetch() only -- callers still get the same return shape
// (parsed JSON) or a thrown Error, exactly as before.
const TIMEOUT_MS    = 20000
const MAX_RETRIES   = 3
const RETRY_GAP_MS  = 3000
const RETRYABLE_STATUS = new Set([502, 503, 504])

const statusListeners = new Set()

function emitStatus(status, extra = {}) {
    const detail = { status, ...extra }
    statusListeners.forEach(fn => { try { fn(detail) } catch { /* listener error is not our problem */ } })
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new CustomEvent('apexops:backend-status', { detail }))
    }
}

// Subscribe to backend connectivity status. fn receives { status: 'retrying'|'ok'|'failed', attempt?, max? }.
// Returns an unsubscribe function. Also mirrored as a 'apexops:backend-status' window CustomEvent.
export function onBackendStatus(fn) {
    statusListeners.add(fn)
    return () => statusListeners.delete(fn)
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function fetchWithTimeout(url, opts) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
          return await fetch(url, { ...opts, signal: controller.signal })
    } finally {
          clearTimeout(timer)
    }
}

async function req(method, path, body) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } }
    const token = getAccessToken()
    if (token) opts.headers['Authorization'] = `Bearer ${token}`
    if (body) opts.body = JSON.stringify(body)
    const url = `${BASE}${path}`

  let attempt = 0
    let wasRetrying = false

  while (true) {
        try {
                const res = await fetchWithTimeout(url, opts)

          // Gateway-ish errors are typical of a Railway cold start -- retry.
          if (RETRYABLE_STATUS.has(res.status) && attempt < MAX_RETRIES) {
                    attempt += 1
                    wasRetrying = true
                    emitStatus('retrying', { attempt, max: MAX_RETRIES })
                    await sleep(RETRY_GAP_MS)
                    continue
          }

          if (!res.ok) {
                    if (wasRetrying) emitStatus('failed')
                    if (res.status === 401 && typeof window !== 'undefined') {
                                // Missing/expired/invalid session -- let AuthContext sign out and
                      // bounce to the login screen rather than leaving the UI stuck
                      // retrying calls that will never succeed.
                      window.dispatchEvent(new CustomEvent('apexops:unauthorized'))
                    }
                    const err = await res.json().catch(() => ({ error: res.statusText }))
                    throw new Error(err.error || res.statusText)
          }

          if (wasRetrying) emitStatus('ok')
                return await res.json()
        } catch (e) {
                // Network failure (offline / connection refused) or our own abort-timeout -- retry.
          const isNetworkOrTimeout = e.name === 'AbortError' || e instanceof TypeError
                if (isNetworkOrTimeout && attempt < MAX_RETRIES) {
                          attempt += 1
                          wasRetrying = true
                          emitStatus('retrying', { attempt, max: MAX_RETRIES })
                          await sleep(RETRY_GAP_MS)
                          continue
                }
                if (isNetworkOrTimeout) {
                          emitStatus('failed')
                          throw new Error(e.name === 'AbortError' ? 'Request timed out' : 'Network error -- backend unreachable', { cause: e })
                }
                // Application-level error (thrown above from the !res.ok branch) -- rethrow as-is.
          throw e
        }
  }
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

    // reports
    getWeeklyReport:  (clientId)     => req('GET',   `/api/reports/weekly?client=${encodeURIComponent(clientId)}`),
    getMonthlyReport: (clientId)     => req('GET',   `/api/reports/monthly?client=${encodeURIComponent(clientId)}`),

    // settings
    getSettings:      ()             => req('GET',   '/api/settings'),
    saveSettings:     (data)         => req('POST',  '/api/settings', data),
}
