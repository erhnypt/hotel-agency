import { Link } from 'react-router-dom'
import { PublicPage } from './PublicPage'
import { CONTACT } from './PublicChrome'

export function PrivacyPage() {
  return (
    <PublicPage
      title="Gizlilik Politikası"
      lead="Bu sayfa, Cassidy Travel'ın rezervasyon talepleri kapsamında kişisel verileri nasıl işlediğini açıklar."
    >
      <h2>Hangi verileri topluyoruz</h2>
      <p>
        Ana sayfadaki talep formundan yalnızca şu bilgileri alırız: ad soyad, e-posta adresi,
        telefon numarası, seçtiğiniz otel ve destinasyon, giriş/çıkış tarihleri, misafir sayısı ve
        varsa notunuz.
      </p>

      <h2>Ne için kullanıyoruz</h2>
      <ul>
        <li>Talebinizi değerlendirmek, uygunluk ve fiyat teyidi için ilgili otelle iletişime geçmek.</li>
        <li>Size dönüş yapmak ve rezervasyon sürecini yürütmek.</li>
        <li>Yasal yükümlülüklerimizi yerine getirmek.</li>
      </ul>

      <h2>Kimlerle paylaşıyoruz</h2>
      <p>
        Verileriniz yalnızca talebinizin muhatabı olan otel ve rezervasyonu tamamlamak için
        gereken hizmet sağlayıcılarla paylaşılır. Pazarlama amacıyla üçüncü taraflara satılmaz veya
        devredilmez.
      </p>

      <h2>Saklama süresi</h2>
      <p>
        Talep kayıtları, süreç tamamlandıktan sonra makul bir muhasebe ve uyuşmazlık süresi boyunca
        saklanır, ardından silinir veya anonim hâle getirilir.
      </p>

      <h2>Haklarınız</h2>
      <p>
        Verilerinize erişme, düzeltme veya silinmesini isteme hakkına sahipsiniz. Bu taleplerinizi{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> adresine iletebilirsiniz.
      </p>

      <p>
        Sorularınız için <Link to="/iletisim">iletişim sayfamıza</Link> göz atabilirsiniz.
      </p>
    </PublicPage>
  )
}
