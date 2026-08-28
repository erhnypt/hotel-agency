import { Link } from 'react-router-dom'
import { BrandMark } from '../../components/BrandMark'
import { LanguageSwitcher } from '../../i18n/LanguageSwitcher'
import { useT } from '../../i18n/useT'
import '../landing/LandingPage.css'

export const CONTACT = {
  address: ['Levent Mah. Büyükdere Cad. No: 000', 'Kat 5, Şişli / İstanbul'],
  phone: '+90 212 555 0 100',
  phoneHref: 'tel:+902125550100',
  email: 'hello@travellsites.com',
}

export function PublicHeader() {
  const { t } = useT()
  return (
    <header className="lp-header">
      <Link to="/" className="lp-brand" aria-label={t('nav.home')}>
        <BrandMark size={24} className="lp-brand__mark" />
      </Link>
      <div className="lp-header__right">
        <LanguageSwitcher variant="light" />
        <Link to="/login" className="lp-header__login">
          {t('landing.loginCta')}
        </Link>
      </div>
    </header>
  )
}

function SocialIcon({ name }: { name: 'instagram' | 'facebook' | 'x' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {name === 'instagram' && (
        <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.37-1.06-.42-2.23C2.21 15.6 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.42 2.21 8.8 2.2 12 2.2Zm0 1.98c-3.14 0-3.5.01-4.74.07-.9.04-1.38.19-1.7.32-.43.16-.73.36-1.05.68-.32.32-.52.62-.68 1.05-.13.32-.28.8-.32 1.7-.06 1.24-.07 1.6-.07 4.74s0 3.5.07 4.74c.04.9.19 1.38.32 1.7.16.43.36.73.68 1.05.32.32.62.52 1.05.68.32.13.8.28 1.7.32 1.24.06 1.6.07 4.74.07s3.5 0 4.74-.07c.9-.04 1.38-.19 1.7-.32.43-.16.73-.36 1.05-.68.32-.32.52-.62.68-1.05.13-.32.28-.8.32-1.7.06-1.24.07-1.6.07-4.74s0-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.7a2.8 2.8 0 0 0-.68-1.05 2.8 2.8 0 0 0-1.05-.68c-.32-.13-.8-.28-1.7-.32-1.24-.06-1.6-.07-4.74-.07Zm0 3.37a5.05 5.05 0 1 1 0 10.1 5.05 5.05 0 0 1 0-10.1Zm0 8.33a3.28 3.28 0 1 0 0-6.56 3.28 3.28 0 0 0 0 6.56Zm6.43-8.55a1.18 1.18 0 1 1-2.36 0 1.18 1.18 0 0 1 2.36 0Z" />
      )}
      {name === 'facebook' && (
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
      )}
      {name === 'x' && (
        <path d="M18.24 2.25h3.3l-7.2 8.23L22.8 21.75h-6.63l-5.2-6.8-5.94 6.8H1.72l7.7-8.8L1.2 2.25h6.8l4.7 6.2 5.54-6.2Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
      )}
    </svg>
  )
}

export function PublicFooter() {
  const { t } = useT()
  return (
    <footer className="lp-footer">
      <div className="lp-footer__grid">
        <div className="lp-footer__brand">
          <div className="lp-brand lp-brand--footer">
            <BrandMark size={20} className="lp-brand__mark" />
          </div>
          <p className="lp-footer__blurb">{t('footer.blurb')}</p>
          <address className="lp-footer__address">
            {CONTACT.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </div>

        <nav className="lp-footer__col" aria-label={t('footer.corporate')}>
          <h3>{t('footer.corporate')}</h3>
          <Link to="/hakkimizda">{t('footer.about')}</Link>
          <Link to="/iletisim">{t('footer.contactPage')}</Link>
          <Link to="/sss">{t('footer.faq')}</Link>
        </nav>

        <nav className="lp-footer__col" aria-label={t('footer.legal')}>
          <h3>{t('footer.legal')}</h3>
          <Link to="/gizlilik">{t('footer.privacy')}</Link>
          <Link to="/kosullar">{t('footer.terms')}</Link>
        </nav>

        <div className="lp-footer__col">
          <h3>{t('footer.contact')}</h3>
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <span className="lp-footer__muted">{t('footer.hours')}</span>
          <div className="lp-footer__social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <SocialIcon name="instagram" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <SocialIcon name="facebook" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">
              <SocialIcon name="x" />
            </a>
          </div>
        </div>
      </div>

      <div className="lp-footer__bottom">
        <span>{t('footer.rights', { year: new Date().getFullYear() })}</span>
        <Link to="/login" className="lp-footer__login">
          {t('footer.staffLogin')}
        </Link>
      </div>
    </footer>
  )
}
