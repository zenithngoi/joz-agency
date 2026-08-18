// src/App.jsx -- routes + auth guard (P0-1). Written with React.createElement
// (no JSX tags) to keep this file simple and diff-friendly.
import { createElement as h } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Content from './pages/Content'
import Ads from './pages/Ads'
import Memory from './pages/Memory'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'
import './index.css'

function RequireAuth({ children }) {
    const { session, loading } = useAuth()
    const location = useLocation()

  if (loading) {
        return h('div', { style: { height: '100vh', display: 'grid', placeItems: 'center', color: 'var(--muted)' } }, 'Loading...')
  }
    if (!session) {
          return h(Navigate, { to: '/login', state: { from: location }, replace: true })
    }
    return children
}

export default function App() {
    return h(AuthProvider, null,
                 h(BrowserRouter, null,
                         h(Routes, null,
                                   h(Route, { path: '/login', element: h(Login) }),
                                   h(Route, { path: '/', element: h(RequireAuth, null, h(Layout)) },
                                               h(Route, { index: true, element: h(Navigate, { to: '/dashboard', replace: true }) }),
                                               h(Route, { path: 'dashboard', element: h(Dashboard) }),
                                               h(Route, { path: 'clients', element: h(Clients) }),
                                               h(Route, { path: 'content', element: h(Content) }),
                                               h(Route, { path: 'ads', element: h(Ads) }),
                                               h(Route, { path: 'memory', element: h(Memory) }),
                                               h(Route, { path: 'reports', element: h(Reports) }),
                                               h(Route, { path: 'settings', element: h(Settings) })
                                             )
                                 )
                       )
               )
}
