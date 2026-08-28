import { Link } from 'react-router-dom'
import { useT } from '../../i18n/useT'
import { PublicPage } from './PublicPage'

const N = [1, 2, 3, 4, 5, 6]

export function TermsPage() {
  const { t } = useT()
  return (
    <PublicPage title={t('terms.title')} lead={t('terms.lead')}>
      {N.map((i) => (
        <div key={i}>
          <h2>{t(`terms.h${i}`)}</h2>
          <p>{t(`terms.p${i}`)}</p>
        </div>
      ))}
      <p>
        <Link to="/iletisim">{t('legal.contactPrompt')}</Link>
      </p>
    </PublicPage>
  )
}
