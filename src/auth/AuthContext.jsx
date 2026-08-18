// src/auth/AuthContext.jsx -- app-wide Supabase auth session state.
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    // undefined = still checking for an existing session, null = signed out
  const [session, setSession] = useState(undefined)

  useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null))
        const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
        return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = useCallback(
        (email, password) => supabase.auth.signInWithPassword({ email, password }),
        []
      )

  const signOut = useCallback(() => supabase.auth.signOut(), [])

  // The backend rejects our JWT (expired, revoked) -> force a clean sign-out
  // so the UI drops back to the login screen instead of spinning on 401s.
  useEffect(() => {
        const handler = () => signOut()
        window.addEventListener('apexops:unauthorized', handler)
        return () => window.removeEventListener('apexops:unauthorized', handler)
  }, [signOut])

  return (<AuthContext.Provider value={{ session, loading: session === undefined, signIn, signOut }}>{children}</AuthContext.Provider>)
}

// hook pairs with AuthProvider by design; splitting into another file adds
// indirection for no benefit in this small a codebase.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}
