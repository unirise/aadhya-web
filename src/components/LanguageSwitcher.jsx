import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
]

function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  const changeLanguage = languageCode => {
    i18n.changeLanguage(languageCode)
  }

  const currentLanguage =
    languages.find(lang => lang.code === i18n.language) || languages[0]

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>{t('languageSwitcher.title')}</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        {t('languageSwitcher.description')}
      </p>

      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontWeight: '500', marginBottom: '8px' }}>
          {t('languageSwitcher.currentLanguage', {
            language: currentLanguage.name,
          })}
        </p>
        <span style={{ fontSize: '24px' }}>{currentLanguage.flag}</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {languages.map(language => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              border:
                i18n.language === language.code
                  ? '2px solid #1d4ed8'
                  : '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor:
                i18n.language === language.code ? '#eff6ff' : 'white',
              color: i18n.language === language.code ? '#1d4ed8' : '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (i18n.language !== language.code) {
                e.target.style.backgroundColor = '#f9fafb'
                e.target.style.borderColor = '#9ca3af'
              }
            }}
            onMouseLeave={e => {
              if (i18n.language !== language.code) {
                e.target.style.backgroundColor = 'white'
                e.target.style.borderColor = '#d1d5db'
              }
            }}
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3
          style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}
        >
          {t('languageSwitcher.title')}
        </h3>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          {t('languageSwitcher.description')}
        </p>
      </div>
    </div>
  )
}

export default LanguageSwitcher
