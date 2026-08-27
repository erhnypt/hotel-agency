import { Link } from 'react-router-dom'
import { PublicPage } from './PublicPage'

const FAQ = [
  {
    q: 'Ödemeyi ne zaman yaparım?',
    a: 'Kural olarak konaklama sırasında otelde. Talep oluştururken ön ödeme istemeyiz; bazı özel tarifelerde otel peşin ödeme şartı koyarsa, bunu teyit e-postasında açıkça belirtiriz.',
  },
  {
    q: 'Talebime ne kadar sürede dönüş yapılır?',
    a: 'Aynı iş günü içinde, en geç 24 saatte. Danışman uygunluğu ve güncel fiyatı otelle teyit ettikten sonra e-posta ile size döner.',
  },
  {
    q: 'Talep oluşturmak beni bağlar mı?',
    a: 'Hayır. Talep yalnızca bir bilgi isteğidir. Rezervasyon, siz teyit e-postasındaki koşulları onayladıktan sonra kesinleşir.',
  },
  {
    q: 'Fiyatlar neden "gösterge" olarak yazıyor?',
    a: 'Sitede gördüğünüz gecelik tutarlar, otel tipi ve bölgeye göre hesaplanan yaklaşık başlangıç fiyatlarıdır. Kesin fiyat, tarihlerinize ve oda tipine göre otelden teyit alındığında netleşir.',
  },
  {
    q: 'Listede olmayan bir otel için ne yapmalıyım?',
    a: 'Ana sayfadaki "Talep oluştur" alanına aklınızdaki oteli veya bölgeyi yazın; danışmanlarımız sizin için araştırıp seçenek sunar.',
  },
  {
    q: 'Rezervasyonu iptal edebilir miyim?',
    a: 'Onaylanan rezervasyonlar, otelin iptal koşullarına tabidir. Bu koşullar teyit e-postasında yer alır; iptal talebinizi bize iletmeniz yeterli, süreci sizin adınıza yürütürüz.',
  },
  {
    q: 'Kişisel verilerim ne oluyor?',
    a: 'Yalnızca talebinizi işlemek için gereken bilgileri (ad, e-posta, telefon, tarih, otel) toplarız ve ilgili otelle paylaşırız. Ayrıntılar için Gizlilik Politikası sayfasına bakın.',
  },
]

export function FaqPage() {
  return (
    <PublicPage title="Sıkça Sorulan Sorular" lead="Talep, ödeme ve rezervasyon süreciyle ilgili en çok sorulanlar.">
      <div className="lp-faq">
        {FAQ.map((item) => (
          <details key={item.q} className="lp-faq__item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
      <p>
        Aradığınız yanıt yok mu? <Link to="/iletisim">Bize yazın.</Link>
      </p>
    </PublicPage>
  )
}
