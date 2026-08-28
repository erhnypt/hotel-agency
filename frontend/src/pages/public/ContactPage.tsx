import { Link } from 'react-router-dom'
import { useT } from '../../i18n/useT'
import { PublicPage } from './PublicPage'
import { CONTACT } from './PublicChrome'

export function ContactPage() {
  const { t } = useT()
  return (
    <PublicPage title={t('contact.title')} lead={t('contact.lead')}>
      <div className="lp-contact">
        <div className="lp-contact__card">
          <h2>{t('contact.office')}</h2>
          <address>
            <span>
              <strong>{CONTACT.name}</strong>
            </span>
            {CONTACT.street.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <span>{t('contact.country')}</span>
          </address>
          <p className="lp-page__lead" style={{ marginTop: '10px' }}>
            {t('footer.hours')}
          </p>
        </div>

        <div className="lp-contact__card">
          <h2>{t('contact.direct')}</h2>
          <dl className="lp-contact__list">
            <div>
              <dt>{t('contact.phone')}</dt>
              <dd>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
                  {CONTACT.whatsapp}
                </a>
              </dd>
            </div>
            <div>
              <dt>{t('contact.emailLabel')}</dt>
              <dd>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <h2>{t('contact.reserveHeading')}</h2>
      <p>{t('contact.reserveBody')}</p>
      <p>
        <Link to="/">{t('contact.goSearch')}</Link>
      </p>
    </PublicPage>
  )
}
