import { Link } from 'react-router-dom'
import { useT } from '../../i18n/useT'
import { PublicPage } from './PublicPage'
import { CONTACT } from './PublicChrome'

const N = [1, 2, 3, 4, 5]

export function PrivacyPage() {
  const { t } = useT()
  return (
    <PublicPage title={t('privacy.title')} lead={t('privacy.lead')}>
      {N.map((i) => (
        <div key={i}>
          <h2>{t(`privacy.h${i}`)}</h2>
          <p>{t(`privacy.p${i}`, { email: CONTACT.email })}</p>
        </div>
      ))}
      <p>
        <Link to="/iletisim">{t('legal.contactPrompt')}</Link>
      </p>
    </PublicPage>
  )
}
