import { useTranslation } from 'react-i18next'

function About() {
    const { t } = useTranslation()

    return (
        <div style={{ marginTop: '60px', padding: '32px' }}>
            <h1>{t('about.title')}</h1>
            <p>{t('about.description')}</p>
        </div>
    )
}

export default About