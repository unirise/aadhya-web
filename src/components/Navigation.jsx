import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()

  const routes = [
    { name: 'Activities', path: '/activities' },
    { name: 'Pehchan', path: '/pehchan' },
    { name: 'Sajag', path: '/sajag' },
  ]

  const isActive = path => {
    if (path === '/activities') {
      return location.pathname === '/' || location.pathname === '/activities'
    }
    return location.pathname === path
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        <Link
          to='/activities'
          style={{
            textDecoration: 'none',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1d4ed8',
            letterSpacing: '-0.5px',
          }}
        >
          Aadya
        </Link>

        <nav
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {routes.map(route => {
            const active = isActive(route.path)
            return (
              <Link
                key={route.path}
                to={route.path}
                style={{
                  textDecoration: 'none',
                  color: active ? '#1d4ed8' : '#6b7280',
                  fontWeight: active ? '600' : '500',
                  fontSize: '15px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: active ? '#eff6ff' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.target.style.backgroundColor = '#f9fafb'
                    e.target.style.color = '#374151'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.color = '#6b7280'
                  }
                }}
              >
                {route.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Navigation
