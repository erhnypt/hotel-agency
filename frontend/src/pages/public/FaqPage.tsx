import { Link } from 'react-router-dom'
import { useT } from '../../i18n/useT'
import { PublicPage } from './PublicPage'

const N = [1, 2, 3, 4, 5, 6, 7]

export function FaqPage() {
  const { t } = useT()
  return (
    <PublicPage title={t('faq.title')} lead={t('faq.lead')}>
      <div className="lp-faq">
        {N.map((i) => (
          <details key={i} className="lp-faq__item">
            <summary>{t(`faq.q${i}`)}</summary>
            <p>{t(`faq.a${i}`)}</p>
          </details>
        ))}
      </div>
      <p>
        {t('faq.noAnswer')} <Link to="/iletisim">{t('faq.writeUs')}</Link>
      </p>
    </PublicPage>
  )
}
