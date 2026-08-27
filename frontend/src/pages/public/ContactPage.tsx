import { Link } from 'react-router-dom'
import { PublicPage } from './PublicPage'
import { CONTACT } from './PublicChrome'

export function ContactPage() {
  return (
    <PublicPage
      title="İletişim"
      lead="Rezervasyon talepleri ana sayfadaki aramadan alınır. Diğer her konuda bize aşağıdan ulaşabilirsiniz."
    >
      <div className="lp-contact">
        <div className="lp-contact__card">
          <h2>Ofis</h2>
          <address>
            {CONTACT.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <p className="lp-page__lead" style={{ marginTop: '10px' }}>
            {CONTACT.hours}
          </p>
        </div>

        <div className="lp-contact__card">
          <h2>Doğrudan</h2>
          <dl className="lp-contact__list">
            <div>
              <dt>Telefon</dt>
              <dd>
                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              </dd>
            </div>
            <div>
              <dt>E-posta</dt>
              <dd>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <h2>Rezervasyon mu yapmak istiyorsunuz?</h2>
      <p>
        Oteli, tarihi ve misafir sayısını <Link to="/">otel aramasından</Link> seçip talep
        oluşturun; danışmanlarımız 24 saat içinde uygunluk ve fiyat teyidiyle size döner.
      </p>
    </PublicPage>
  )
}
