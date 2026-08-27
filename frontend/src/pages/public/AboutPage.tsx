import { Link } from 'react-router-dom'
import { PublicPage } from './PublicPage'

export function AboutPage() {
  return (
    <PublicPage
      title="Hakkımızda"
      lead="Cassidy Travel, gezginlerle otel ağı arasında duran bağımsız bir seyahat acentesidir."
    >
      <h2>Ne yapıyoruz</h2>
      <p>
        Dünyanın dört bir yanından binlerce oteli tek bir yerde toplarız. Siz nereye gitmek
        istediğinizi söylersiniz; biz uygunluğu araştırır, fiyatı otelle görüşür ve rezervasyonun
        tamamlanmasını baştan sona takip ederiz. Aramızdaki fark, bir arama motoru değil, işi sizin
        adınıza yürüten bir ekip olmamızdır.
      </p>

      <h2>Nasıl çalışır</h2>
      <ol>
        <li>
          Ana sayfadaki aramadan otelinizi, tarihlerinizi ve misafir sayısını seçip talep
          oluşturursunuz.
        </li>
        <li>
          Talebiniz bir danışmana düşer. Otel ile uygunluğu ve güncel fiyatı teyit ederiz.
        </li>
        <li>
          Aynı iş günü içinde size döner, onayınızı aldıktan sonra rezervasyonu kesinleştiririz.
          Ödeme kural olarak otelde yapılır.
        </li>
      </ol>

      <h2>Neden bir acente ile çalışmalı</h2>
      <ul>
        <li>Yüzlerce oteli sizin adınıza karşılaştırır, en uygun seçeneği öne çıkarırız.</li>
        <li>Fiyat ve koşulları otelle biz görüşürüz; ön ödeme istemeyiz.</li>
        <li>Bir sorun çıkarsa muhatabınız tek bir ekip olur.</li>
      </ul>

      <p>
        Sorularınız için <Link to="/iletisim">iletişim sayfamıza</Link> göz atabilir ya da doğrudan{' '}
        <Link to="/">otel aramasından</Link> talep oluşturabilirsiniz.
      </p>
    </PublicPage>
  )
}
