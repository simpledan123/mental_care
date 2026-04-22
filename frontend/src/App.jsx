import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home    from './pages/Home'
import Write   from './pages/Write'
import History from './pages/History'

const NAV = [
  { to: '/',        label: '대시보드', icon: '▦' },
  { to: '/write',   label: '오늘 기록', icon: '✏' },
  { to: '/history', label: '기록 내역', icon: '☰' },
]

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.layout}>
        {/* sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.logo}>
            하루결
            <span style={styles.logoSub}>routine care</span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? '#1e1e22' : 'transparent',
                color:      isActive ? '#c8f0a0' : '#6b6b78',
              })}>
                <span>{n.icon}</span>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div style={styles.sidebarBottom}>
            청년 루틴 케어<br />
            v0.1.0
          </div>
        </aside>

        {/* main */}
        <main style={styles.main}>
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/write"   element={<Write />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#0f0f11', color: '#e8e8ec' },
  sidebar: {
    width: 220,
    minHeight: '100vh',
    background: '#17171a',
    borderRight: '1px solid #2a2a30',
    padding: '36px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 36,
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
  },
  logo: {
    fontSize: 20,
    fontWeight: 600,
    color: '#c8f0a0',
    letterSpacing: -0.5,
    fontFamily: 'serif',
  },
  logoSub: {
    display: 'block',
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#6b6b78',
    fontWeight: 300,
    marginTop: 2,
  },
  navItem: {
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  main: {
    marginLeft: 220,
    flex: 1,
    padding: '48px 52px',
    maxWidth: 1000,
  },
  sidebarBottom: {
    marginTop: 'auto',
    fontSize: 11,
    color: '#6b6b78',
    fontFamily: 'monospace',
    lineHeight: 1.8,
  },
}
