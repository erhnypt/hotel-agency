import { Link } from 'react-router-dom'
import { PublicPage } from './PublicPage'

export function TermsPage() {
  return (
    <PublicPage
      title="Kullanım Koşulları"
      lead="Cassidy Travel web sitesini ve talep hizmetini kullanırken aşağıdaki koşullar geçerlidir."
    >
      <h2>Acentenin rolü</h2>
      <p>
        Cassidy Travel, konaklamayı kendisi sağlamaz; gezginle otel arasında aracı bir seyahat
        acentesidir. Konaklama sözleşmesi sizinle otel arasında kurulur.
      </p>

      <h2>Fiyatlar</h2>
      <p>
        Sitede gösterilen gecelik tutarlar göstergedir ve bağlayıcı bir teklif oluşturmaz. Kesin
        fiyat, tarihlerinize ve oda tipine göre otelden alınan teyitle birlikte bildirilir.
      </p>

      <h2>Talep ve rezervasyon</h2>
      <ul>
        <li>Talep oluşturmak tek başına rezervasyon anlamına gelmez.</li>
        <li>Rezervasyon, tarafımızca gönderilen teyit e-postasındaki koşulları onaylamanızla kesinleşir.</li>
        <li>Ödeme, aksi belirtilmedikçe konaklama sırasında otelde yapılır.</li>
      </ul>

      <h2>İptal ve değişiklik</h2>
      <p>
        Onaylanan rezervasyonların iptal ve değişiklik hakları, ilgili otelin koşullarına tabidir ve
        teyit e-postasında yer alır. İptal talebinizi bize ilettiğinizde süreci sizin adınıza
        yürütürüz.
      </p>

      <h2>Sorumluluk</h2>
      <p>
        Otelin sunduğu hizmetin niteliğinden otel sorumludur. Cassidy Travel, bilgilerin doğru ve
        güncel olması için makul özeni gösterir; otel kaynaklı değişiklik ve aksaklıklardan sorumlu
        tutulamaz.
      </p>

      <h2>Değişiklikler</h2>
      <p>Bu koşullar zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.</p>

      <p>
        Sorularınız için <Link to="/iletisim">iletişim sayfamıza</Link> yazabilirsiniz.
      </p>
    </PublicPage>
  )
}
