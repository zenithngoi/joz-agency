// src/supabaseClient.js -- Supabase Auth client for the admin dashboard login.
// Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel env vars
// (and .env.local for local dev). These are meant to be public -- the anon key
// is safe to ship in a browser bundle; it's the JWT it issues after a real
// login, verified server-side, that actually gates the API (see api.js).

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error(
          'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set -- login will not work until they are configured.'
        )
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '')

// -- Access-token cache ------------------------------------------------------
// api.js needs the current JWT synchronously on every request. Supabase's own
// session lookup is async, so we mirror the token here via the auth-state
// listener rather than awaiting getSession() on every call.
let currentAccessToken = null

supabase.auth.onAuthStateChange((_event, session) => {
    currentAccessToken = session?.access_token || null
})

// Prime the cache immediately so requests made before the first auth event
// (e.g. during initial page load) still see a token if one already exists.
supabase.auth.getSession().then(({ data }) => {
    currentAccessToken = data.session?.access_token || null
})

export function getAccessToken() {
    return currentAccessToken
}
