import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Navigation() {
  const location = useLocation()
  const { t } = useTranslation()

  const routes = [
    { name: t('navigation.home'), path: '/' },
    { name: t('navigation.about'), path: '/about' },
    { name: t('navigation.contact'), path: '/contact' },
    { name: t('common.login'), path: '/login' },
    { name: t('common.language'), path: '/language' },
    { name: 'DateTime', path: '/datetime' },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
      }}
    >
      <nav style={{ display: 'flex', gap: '24px' }}>
        {routes.map(route => (
          <Link
            key={route.path}
            to={route.path}
            style={{
              textDecoration: 'none',
              color: location.pathname === route.path ? '#1d4ed8' : '#6b7280',
              fontWeight: location.pathname === route.path ? 'bold' : 'normal',
              transition: 'color 0.2s ease',
            }}
          >
            {route.name}
          </Link>
        ))}
      </nav>

      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
        {t('navigation.brand')}
      </div>
    </div>
  )
}

export default Navigation
