import { useTranslation } from 'react-i18next'
import { formatDateTime, formatRelativeTime, now } from '../lib/dateUtils'
// import { useStats } from '../hooks/useQueries'
// import { ChartWrapper } from '../components/charts'

function Home() {
    const { t } = useTranslation()
    // const { data: stats, isLoading, error } = useStats()

    return (
        <div style={{ marginTop: '60px', padding: '32px' }}>
            <h1>{t('home.title')}</h1>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '24px' }}>
                {t('home.subtitle')}
            </p>
            <p style={{ lineHeight: '1.6', marginBottom: '32px' }}>
                {t('home.description')}
            </p>

            {/* Current DateTime Display */}
            <div style={{
                marginBottom: '32px',
                padding: '16px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #dbeafe'
            }}>
                <h3 style={{ marginBottom: '8px' }}>Current Date & Time</h3>
                <p style={{ margin: '4px 0', fontSize: '16px' }}>
                    <strong>Now:</strong> {formatDateTime(now())}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                    Powered by Day.js • <a href="/datetime" style={{ color: '#2563eb' }}>View DateTime Demo</a>
                </p>
            </div>

            {/* TanStack Query integration ready - will show data when API is connected */}
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3>{t('home.quickStats')}</h3>
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                    Statistics will appear here when you connect your API
                </p>
            </div>

            {/* Sample Charts Section */}
            <div style={{ marginTop: '40px' }}>
                <h2>{t('home.dataVisualization')}</h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                    Charts will appear here when you add your data
                </p>
            </div>

            {/* Features Section */}
            <div style={{ marginTop: '40px' }}>
                <h2>{t('home.features.title')}</h2>
                <ul style={{ lineHeight: '1.8', color: '#374151' }}>
                    <li>{t('home.features.reactRouter')}</li>
                    <li>{t('home.features.tanstackQuery')}</li>
                    <li>{t('home.features.reactHookForm')}</li>
                    <li>{t('home.features.recharts')}</li>
                    <li>{t('home.features.testing')}</li>
                </ul>
            </div>
        </div>
    )
}

export default Home