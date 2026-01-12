import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUser()

  const isHomeActive = location.pathname === '/' || location.pathname === '/home'

  // Don't show navigation on login page
  if (location.pathname === '/login') {
    return null
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
      {/* Left: Home Link */}
      <div style={{ flex: '1', display: 'flex', alignItems: 'center' }}>
        <Link
          to='/'
          style={{
            textDecoration: 'none',
            color: isHomeActive ? '#1d4ed8' : '#6b7280',
            fontWeight: isHomeActive ? '600' : '500',
            fontSize: '15px',
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: isHomeActive ? '#eff6ff' : 'transparent',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            if (!isHomeActive) {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.color = '#374151'
            }
          }}
          onMouseLeave={e => {
            if (!isHomeActive) {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#6b7280'
            }
          }}
        >
          Home
        </Link>
      </div>

      {/* Center: Aadya Logo */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1d4ed8',
          letterSpacing: '-0.5px',
          userSelect: 'none',
        }}
      >
        Aadya
      </div>

      {/* Right: User Info and Profile Link */}
      {isAuthenticated && (
        <div
          style={{
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '16px',
          }}
        >
          <Link
            to='/profile'
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7280',
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.color = '#374151'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
            </span>
            <span>{user?.name || user?.username}</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Navigation
