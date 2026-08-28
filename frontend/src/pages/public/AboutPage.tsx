import { Link } from 'react-router-dom'
import { useT } from '../../i18n/useT'
import { PublicPage } from './PublicPage'

export function AboutPage() {
  const { t } = useT()
  return (
    <PublicPage title={t('about.title')} lead={t('about.lead')}>
      <h2>{t('about.h1')}</h2>
      <p>{t('about.p1')}</p>

      <h2>{t('about.h2')}</h2>
      <ol>
        <li>{t('about.step1')}</li>
        <li>{t('about.step2')}</li>
        <li>{t('about.step3')}</li>
      </ol>

      <h2>{t('about.h3')}</h2>
      <ul>
        <li>{t('about.b1')}</li>
        <li>{t('about.b2')}</li>
        <li>{t('about.b3')}</li>
      </ul>

      <p>{t('about.closing')}</p>
      <p>
        <Link to="/iletisim">{t('footer.contactPage')}</Link>
        {' · '}
        <Link to="/">{t('contact.goSearch')}</Link>
      </p>
    </PublicPage>
  )
}
