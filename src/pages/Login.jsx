// src/pages/Login.jsx -- email/password sign-in screen (P0-1 auth).
// Written with React.createElement (no JSX tags) to keep this file simple
// and diff-friendly; functionally identical to a JSX version.
import { useState } from 'react'
import { createElement as h } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Login() {
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSubmitting(true)
        const { error: signInError } = await signIn(email, password)
        setSubmitting(false)
        if (signInError) {
                setError(signInError.message || 'Sign in failed')
                return
        }
        navigate(from, { replace: true })
  }

  return h('div', {
        style: {
                height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--ink)',
        }
  }, h('form', {
        onSubmit: handleSubmit,
        style: {
                width: 340, padding: '32px 28px', borderRadius: 'var(--radius)',
                border: '1px solid var(--line)', background: 'var(--panel)',
        }
  },
           h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 } },
                   h('div', {
                             style: {
                                         width: 34, height: 34, border: '1.5px solid var(--gold)', borderRadius: 8,
                                         display: 'grid', placeItems: 'center', color: 'var(--gold)', fontWeight: 700, fontSize: 16,
                             }
                   }, 'J'),
                   h('div', null,
                             h('div', { style: { fontSize: 15, fontWeight: 600, letterSpacing: 2, color: 'var(--text)' } },
                                         'JOZ',
                                         h('span', { style: { color: 'var(--gold)' } }, 'MARKETING')
                                       ),
                             h('div', { style: { fontSize: 9, color: 'var(--dim)', letterSpacing: 1.5, textTransform: 'uppercase' } }, 'Admin sign in')
                           )
                 ),
           h('label', { style: { display: 'block', fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 } }, 'Email'),
           h('input', {
                   type: 'email', required: true, autoFocus: true, value: email,
                   onChange: e => setEmail(e.target.value),
                   style: {
                             width: '100%', padding: '9px 10px', marginBottom: 16, borderRadius: 6,
                             border: '1px solid var(--line)', background: 'var(--panel-2)', color: 'var(--text)',
                             fontSize: 13, boxSizing: 'border-box',
                   }
           }),
           h('label', { style: { display: 'block', fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 } }, 'Password'),
           h('input', {
                   type: 'password', required: true, value: password,
                   onChange: e => setPassword(e.target.value),
                   style: {
                             width: '100%', padding: '9px 10px', marginBottom: 20, borderRadius: 6,
                             border: '1px solid var(--line)', background: 'var(--panel-2)', color: 'var(--text)',
                             fontSize: 13, boxSizing: 'border-box',
                   }
           }),
           error && h('div', { style: { marginBottom: 16, fontSize: 12, color: 'var(--loss)' } }, error),
           h('button', {
                   type: 'submit', disabled: submitting,
                   style: {
                             width: '100%', padding: '10px 0', borderRadius: 6, fontSize: 11,
                             fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                             cursor: submitting ? 'not-allowed' : 'pointer',
                             border: '1px solid rgba(212,175,55,.5)',
                             background: submitting ? 'transparent' : 'rgba(212,175,55,.08)',
                             color: 'var(--gold)',
                   }
           }, submitting ? 'Signing in...' : 'Sign in')
         ))
}
