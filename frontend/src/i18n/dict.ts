export type Lang = 'tr' | 'en' | 'ru' | 'de' | 'es' | 'ar'

export const LANGS: Lang[] = ['tr', 'en', 'ru', 'de', 'es', 'ar']
export const RTL_LANGS: Lang[] = ['ar']
export const LANG_NAMES: Record<Lang, string> = {
  tr: 'Türkçe',
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
  es: 'Español',
  ar: 'العربية',
}

type Dict = Record<string, string>

const tr: Dict = {
  'lang.label': 'Dil',

  'nav.dashboard': 'Panel',
  'nav.home': 'Ana sayfa',
  'nav.hotels': 'Oteller',
  'nav.reservations': 'Rezervasyonlar',
  'nav.newReservation': 'Yeni Rezervasyon',
  'nav.requests': 'Talepler',
  'nav.customers': 'Müşteriler',
  'nav.staff': 'Çalışanlar',
  'nav.settings': 'Ayarlar',
  'nav.hotelProfile': 'Otel Profili',
  'nav.roomTypes': 'Oda Tipleri',
  'nav.services': 'Hizmetler',
  'nav.prices': 'Fiyatlar',

  'panel.admin': 'Acente Admin Paneli',
  'panel.staff': 'Acente Çalışanı Paneli',
  'panel.hotel': 'Otel Paneli',

  'shell.tagline': 'Otel Acentesi Merkezi',
  'shell.logout': 'Çıkış Yap',

  'common.save': 'Kaydet',
  'common.saving': 'Kaydediliyor...',
  'common.cancel': 'Vazgeç',
  'common.edit': 'Düzenle',
  'common.delete': 'Sil',
  'common.add': 'Ekle',
  'common.loading': 'Yükleniyor...',
  'common.loadError': 'Veriler yüklenemedi.',

  'login.subtitle': 'Hesabınıza giriş yapın',
  'login.email': 'E-posta',
  'login.password': 'Şifre',
  'login.submit': 'Giriş Yap',
  'login.submitting': 'Giriş yapılıyor...',
  'login.error': 'Giriş başarısız oldu.',
  'login.footer': 'Yeni otel kaydı?',
  'login.haveAccount': 'Zaten hesabın var mı?',
  'login.register': 'Kayıt Ol',

  'register.subtitle': 'Yeni Otel Kaydı',
  'register.name': 'Otel Adı',
  'register.contactPerson': 'İletişim Kişi Adı',
  'register.email': 'E-posta',
  'register.password': 'Şifre (En az 8 karakter)',
  'register.phone': 'Telefon',
  'register.address': 'Adres',
  'register.city': 'Şehir',
  'register.country': 'Ülke',
  'register.description': 'Açıklama',
  'register.descriptionPlaceholder': 'Otel hakkında kısa bilgi...',
  'register.submit': 'Otel Kaydı Yap',
  'register.submitting': 'Kaydediliyor...',
  'register.error': 'Bir hata oluştu.',
  'register.doneTitle': 'Kaydınız Alındı',
  'register.doneBody':
    '{name} için otel başvurunuz alınmıştır. Başvurunuz acente ekibimiz tarafından incelenmektedir; onay durumu {email} adresine e-posta ile bildirilecektir.',
  'register.doneFooterPre': 'Onaylandıktan sonra belirlediğiniz şifre ile',
  'register.doneFooterLink': 'giriş yapabilirsiniz',

  'gate.pendingTitle': 'Başvurunuz İnceleniyor',
  'gate.pendingBody':
    'Otel kaydınız acente ekibimiz tarafından incelenmektedir. Onaylandığında panel erişiminiz açılacak ve size e-posta ile bilgi verilecektir.',
  'gate.rejectedTitle': 'Başvurunuz Reddedildi',
  'gate.rejectedBody':
    'Otel başvurunuz acente tarafından reddedilmiştir. Detaylı bilgi için acente ile iletişime geçebilirsiniz.',

  'landing.loginCta': 'Kurumsal Giriş',
  'landing.heroTitle1': 'Bir sonraki tatiliniz',
  'landing.heroTitle2': 'bir talep uzağınızda',
  'landing.heroLede':
    '{count} otel arasından seçin, gerisini uzman danışmanlarımız halletsin. Uygunluk ve fiyat teyidi 24 saat içinde, ön ödemesiz.',
  'landing.heroLedeNoCount':
    'Binlerce otel arasından seçin, gerisini uzman danışmanlarımız halletsin. Uygunluk ve fiyat teyidi 24 saat içinde, ön ödemesiz.',
  'landing.searchTitle': 'Otel arayın',
  'landing.fieldHotel': 'Otel',
  'landing.fieldCheckIn': 'Giriş',
  'landing.fieldCheckOut': 'Çıkış',
  'landing.fieldGuests': 'Misafir',
  'landing.searchPlaceholder': 'Otel adı veya şehir…',
  'landing.loadingHotels': 'Oteller yükleniyor…',
  'landing.catalogError': 'Katalog yüklenemedi.',
  'landing.estimate': 'Tahmini tutar',
  'landing.estimateNote': '{nights} gece · gösterge, teyitle kesinleşir',
  'landing.continue': 'Devam et',
  'landing.contactTitle': 'İletişim bilgileriniz',
  'landing.name': 'Ad Soyad',
  'landing.email': 'E-posta',
  'landing.phone': 'Telefon',
  'landing.note': 'Not (opsiyonel)',
  'landing.notePlaceholder': 'Oda tercihi, özel istekler…',
  'landing.submit': 'Talebi gönder',
  'landing.submitting': 'Gönderiliyor…',
  'landing.backToSearch': '← Arama',
  'landing.errorSubmit': 'Talep gönderilemedi. Lütfen tekrar deneyin.',
  'landing.doneTitle': 'Talebiniz alındı',
  'landing.doneRef': 'Referans no',
  'landing.doneNote':
    '{hotel} — {city}, {country}. {checkIn} / {checkOut}, {guests} misafir. E-postanıza bir onay göndereceğiz.',
  'landing.newRequest': 'Yeni talep oluştur',
  'landing.destTitle': 'Popüler destinasyonlar',
  'landing.fromPrice': "{price} {currency}'den",
  'landing.trustHeading': 'Neden bir acente?',
  'landing.trustLede':
    'Yüzlerce otel arasından sizin adınıza karşılaştırır, pazarlığı yapar ve rezervasyonu baştan sona takip ederiz. Siz sadece nereye gitmek istediğinizi söyleyin.',
  'landing.trust1Title': 'Ön ödeme yok',
  'landing.trust1Body': 'Ödemeyi otelde yaparsınız. Biz uygunluğu ve en iyi fiyatı ayarlarız.',
  'landing.trust2Title': '24 saatte yanıt',
  'landing.trust2Body': 'Talebiniz bir danışmana düşer, aynı iş günü içinde dönüş yapılır.',
  'landing.trust3Title': 'Binlerce otel',
  'landing.trust3Body': 'Şehir merkezinden sahil resort’a, dünyanın dört bir yanından seçenek.',
  'landing.bandTitle': 'Aradığınız oteli bulamadınız mı?',
  'landing.bandBody': 'Aklınızdaki oteli veya bölgeyi yazın; danışmanlarımız sizin için araştırsın.',
  'landing.bandCta': 'Talep oluştur',

  'footer.blurb':
    'Gezginlerle otel ağı arasında duran bağımsız seyahat acentesi. Uygunluğu araştırır, fiyatı görüşür, rezervasyonu baştan sona biz takip ederiz.',
  'footer.corporate': 'Kurumsal',
  'footer.legal': 'Yasal',
  'footer.contact': 'Bize Ulaşın',
  'footer.about': 'Hakkımızda',
  'footer.contactPage': 'İletişim',
  'footer.faq': 'Sıkça Sorulan Sorular',
  'footer.privacy': 'Gizlilik Politikası',
  'footer.terms': 'Kullanım Koşulları',
  'footer.hours': 'Hafta içi 09:00 – 18:00',
  'footer.rights': '© {year}',
  'footer.staffLogin': 'Kurumsal Giriş',

  'about.title': 'Hakkımızda',
  'about.lead': 'Cassidy Travel, gezginlerle otel ağı arasında duran bağımsız bir seyahat acentesidir.',
  'about.h1': 'Ne yapıyoruz',
  'about.p1':
    'Dünyanın dört bir yanından binlerce oteli tek bir yerde toplarız. Siz nereye gitmek istediğinizi söylersiniz; biz uygunluğu araştırır, fiyatı otelle görüşür ve rezervasyonun tamamlanmasını baştan sona takip ederiz. Aramızdaki fark, bir arama motoru değil, işi sizin adınıza yürüten bir ekip olmamızdır.',
  'about.h2': 'Nasıl çalışır',
  'about.step1':
    'Ana sayfadaki aramadan otelinizi, tarihlerinizi ve misafir sayısını seçip talep oluşturursunuz.',
  'about.step2': 'Talebiniz bir danışmana düşer. Otel ile uygunluğu ve güncel fiyatı teyit ederiz.',
  'about.step3':
    'Aynı iş günü içinde size döner, onayınızı aldıktan sonra rezervasyonu kesinleştiririz. Ödeme kural olarak otelde yapılır.',
  'about.h3': 'Neden bir acente ile çalışmalı',
  'about.b1': 'Yüzlerce oteli sizin adınıza karşılaştırır, en uygun seçeneği öne çıkarırız.',
  'about.b2': 'Fiyat ve koşulları otelle biz görüşürüz; ön ödeme istemeyiz.',
  'about.b3': 'Bir sorun çıkarsa muhatabınız tek bir ekip olur.',
  'about.closing': 'Sorularınız için iletişim sayfamıza göz atabilir ya da doğrudan otel aramasından talep oluşturabilirsiniz.',

  'contact.title': 'İletişim',
  'contact.lead':
    'Rezervasyon talepleri ana sayfadaki aramadan alınır. Diğer her konuda bize aşağıdan ulaşabilirsiniz.',
  'contact.office': 'Ofis',
  'contact.direct': 'Doğrudan',
  'contact.phone': 'Telefon',
  'contact.emailLabel': 'E-posta',
  'contact.reserveHeading': 'Rezervasyon mu yapmak istiyorsunuz?',
  'contact.reserveBody':
    'Oteli, tarihi ve misafir sayısını otel aramasından seçip talep oluşturun; danışmanlarımız 24 saat içinde uygunluk ve fiyat teyidiyle size döner.',
  'contact.goSearch': 'Otel aramasına git',

  'faq.title': 'Sıkça Sorulan Sorular',
  'faq.lead': 'Talep, ödeme ve rezervasyon süreciyle ilgili en çok sorulanlar.',
  'faq.noAnswer': 'Aradığınız yanıt yok mu?',
  'faq.writeUs': 'Bize yazın.',
  'faq.q1': 'Ödemeyi ne zaman yaparım?',
  'faq.a1':
    'Kural olarak konaklama sırasında otelde. Talep oluştururken ön ödeme istemeyiz; bazı özel tarifelerde otel peşin ödeme şartı koyarsa, bunu teyit e-postasında açıkça belirtiriz.',
  'faq.q2': 'Talebime ne kadar sürede dönüş yapılır?',
  'faq.a2':
    'Aynı iş günü içinde, en geç 24 saatte. Danışman uygunluğu ve güncel fiyatı otelle teyit ettikten sonra e-posta ile size döner.',
  'faq.q3': 'Talep oluşturmak beni bağlar mı?',
  'faq.a3':
    'Hayır. Talep yalnızca bir bilgi isteğidir. Rezervasyon, siz teyit e-postasındaki koşulları onayladıktan sonra kesinleşir.',
  'faq.q4': 'Fiyatlar neden "gösterge" olarak yazıyor?',
  'faq.a4':
    'Sitede gördüğünüz gecelik tutarlar, otel tipi ve bölgeye göre hesaplanan yaklaşık başlangıç fiyatlarıdır. Kesin fiyat, tarihlerinize ve oda tipine göre otelden teyit alındığında netleşir.',
  'faq.q5': 'Listede olmayan bir otel için ne yapmalıyım?',
  'faq.a5':
    'Ana sayfadaki "Talep oluştur" alanına aklınızdaki oteli veya bölgeyi yazın; danışmanlarımız sizin için araştırıp seçenek sunar.',
  'faq.q6': 'Rezervasyonu iptal edebilir miyim?',
  'faq.a6':
    'Onaylanan rezervasyonlar, otelin iptal koşullarına tabidir. Bu koşullar teyit e-postasında yer alır; iptal talebinizi bize iletmeniz yeterli, süreci sizin adınıza yürütürüz.',
  'faq.q7': 'Kişisel verilerim ne oluyor?',
  'faq.a7':
    'Yalnızca talebinizi işlemek için gereken bilgileri (ad, e-posta, telefon, tarih, otel) toplarız ve ilgili otelle paylaşırız. Ayrıntılar için Gizlilik Politikası sayfasına bakın.',

  'privacy.title': 'Gizlilik Politikası',
  'privacy.lead':
    "Bu sayfa, Cassidy Travel'ın rezervasyon talepleri kapsamında kişisel verileri nasıl işlediğini açıklar.",
  'privacy.h1': 'Hangi verileri topluyoruz',
  'privacy.p1':
    'Ana sayfadaki talep formundan yalnızca şu bilgileri alırız: ad soyad, e-posta adresi, telefon numarası, seçtiğiniz otel ve destinasyon, giriş/çıkış tarihleri, misafir sayısı ve varsa notunuz.',
  'privacy.h2': 'Ne için kullanıyoruz',
  'privacy.p2':
    'Verileri; talebinizi değerlendirmek ve ilgili otelle uygunluk/fiyat teyidi için iletişime geçmek, size dönüş yapıp rezervasyon sürecini yürütmek ve yasal yükümlülüklerimizi yerine getirmek için kullanırız.',
  'privacy.h3': 'Kimlerle paylaşıyoruz',
  'privacy.p3':
    'Verileriniz yalnızca talebinizin muhatabı olan otel ve rezervasyonu tamamlamak için gereken hizmet sağlayıcılarla paylaşılır. Pazarlama amacıyla üçüncü taraflara satılmaz veya devredilmez.',
  'privacy.h4': 'Saklama süresi',
  'privacy.p4':
    'Talep kayıtları, süreç tamamlandıktan sonra makul bir muhasebe ve uyuşmazlık süresi boyunca saklanır, ardından silinir veya anonim hâle getirilir.',
  'privacy.h5': 'Haklarınız',
  'privacy.p5':
    'Verilerinize erişme, düzeltme veya silinmesini isteme hakkına sahipsiniz. Bu taleplerinizi {email} adresine iletebilirsiniz.',

  'terms.title': 'Kullanım Koşulları',
  'terms.lead':
    'Cassidy Travel web sitesini ve talep hizmetini kullanırken aşağıdaki koşullar geçerlidir.',
  'terms.h1': 'Acentenin rolü',
  'terms.p1':
    'Cassidy Travel, konaklamayı kendisi sağlamaz; gezginle otel arasında aracı bir seyahat acentesidir. Konaklama sözleşmesi sizinle otel arasında kurulur.',
  'terms.h2': 'Fiyatlar',
  'terms.p2':
    'Sitede gösterilen gecelik tutarlar göstergedir ve bağlayıcı bir teklif oluşturmaz. Kesin fiyat, tarihlerinize ve oda tipine göre otelden alınan teyitle birlikte bildirilir.',
  'terms.h3': 'Talep ve rezervasyon',
  'terms.p3':
    'Talep oluşturmak tek başına rezervasyon anlamına gelmez. Rezervasyon, tarafımızca gönderilen teyit e-postasındaki koşulları onaylamanızla kesinleşir. Ödeme, aksi belirtilmedikçe konaklama sırasında otelde yapılır.',
  'terms.h4': 'İptal ve değişiklik',
  'terms.p4':
    'Onaylanan rezervasyonların iptal ve değişiklik hakları, ilgili otelin koşullarına tabidir ve teyit e-postasında yer alır. İptal talebinizi bize ilettiğinizde süreci sizin adınıza yürütürüz.',
  'terms.h5': 'Sorumluluk',
  'terms.p5':
    'Otelin sunduğu hizmetin niteliğinden otel sorumludur. Cassidy Travel, bilgilerin doğru ve güncel olması için makul özeni gösterir; otel kaynaklı değişiklik ve aksaklıklardan sorumlu tutulamaz.',
  'terms.h6': 'Değişiklikler',
  'terms.p6': 'Bu koşullar zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.',

  'legal.contactPrompt': 'Sorularınız için iletişim sayfamıza yazabilirsiniz.',
}

const en: Dict = {
  'lang.label': 'Language',

  'nav.dashboard': 'Dashboard',
  'nav.home': 'Home',
  'nav.hotels': 'Hotels',
  'nav.reservations': 'Reservations',
  'nav.newReservation': 'New Reservation',
  'nav.requests': 'Requests',
  'nav.customers': 'Customers',
  'nav.staff': 'Staff',
  'nav.settings': 'Settings',
  'nav.hotelProfile': 'Hotel Profile',
  'nav.roomTypes': 'Room Types',
  'nav.services': 'Services',
  'nav.prices': 'Prices',

  'panel.admin': 'Agency Admin Panel',
  'panel.staff': 'Agency Staff Panel',
  'panel.hotel': 'Hotel Panel',

  'shell.tagline': 'Hotel Agency Hub',
  'shell.logout': 'Log out',

  'common.save': 'Save',
  'common.saving': 'Saving…',
  'common.cancel': 'Cancel',
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.add': 'Add',
  'common.loading': 'Loading…',
  'common.loadError': 'Could not load data.',

  'login.subtitle': 'Sign in to your account',
  'login.email': 'Email',
  'login.password': 'Password',
  'login.submit': 'Sign in',
  'login.submitting': 'Signing in…',
  'login.error': 'Sign-in failed.',
  'login.footer': 'New hotel registration?',
  'login.haveAccount': 'Already have an account?',
  'login.register': 'Register',

  'register.subtitle': 'New Hotel Registration',
  'register.name': 'Hotel Name',
  'register.contactPerson': 'Contact Person',
  'register.email': 'Email',
  'register.password': 'Password (at least 8 characters)',
  'register.phone': 'Phone',
  'register.address': 'Address',
  'register.city': 'City',
  'register.country': 'Country',
  'register.description': 'Description',
  'register.descriptionPlaceholder': 'A short note about the hotel…',
  'register.submit': 'Register Hotel',
  'register.submitting': 'Saving…',
  'register.error': 'Something went wrong.',
  'register.doneTitle': 'Application Received',
  'register.doneBody':
    'Your application for {name} has been received. Our agency team is reviewing it; the outcome will be emailed to {email}.',
  'register.doneFooterPre': 'Once approved, you can',
  'register.doneFooterLink': 'sign in with the password you chose',

  'gate.pendingTitle': 'Application Under Review',
  'gate.pendingBody':
    'Your hotel registration is being reviewed by our agency team. Once approved, panel access will open and you will be notified by email.',
  'gate.rejectedTitle': 'Application Rejected',
  'gate.rejectedBody':
    'Your hotel application was rejected by the agency. Please contact the agency for details.',

  'landing.loginCta': 'Staff Login',
  'landing.heroTitle1': 'Your next holiday',
  'landing.heroTitle2': 'is one request away',
  'landing.heroLede':
    'Choose from {count} hotels and let our team handle the rest. Availability and price confirmed within 24 hours, no prepayment.',
  'landing.heroLedeNoCount':
    'Choose from thousands of hotels and let our team handle the rest. Availability and price confirmed within 24 hours, no prepayment.',
  'landing.searchTitle': 'Search hotels',
  'landing.fieldHotel': 'Hotel',
  'landing.fieldCheckIn': 'Check-in',
  'landing.fieldCheckOut': 'Check-out',
  'landing.fieldGuests': 'Guests',
  'landing.searchPlaceholder': 'Hotel name or city…',
  'landing.loadingHotels': 'Loading hotels…',
  'landing.catalogError': 'Could not load the catalog.',
  'landing.estimate': 'Estimated total',
  'landing.estimateNote': '{nights} nights · indicative, confirmed on approval',
  'landing.continue': 'Continue',
  'landing.contactTitle': 'Your contact details',
  'landing.name': 'Full name',
  'landing.email': 'Email',
  'landing.phone': 'Phone',
  'landing.note': 'Note (optional)',
  'landing.notePlaceholder': 'Room preference, special requests…',
  'landing.submit': 'Send request',
  'landing.submitting': 'Sending…',
  'landing.backToSearch': '← Search',
  'landing.errorSubmit': 'Could not send the request. Please try again.',
  'landing.doneTitle': 'Request received',
  'landing.doneRef': 'Reference no.',
  'landing.doneNote':
    '{hotel} — {city}, {country}. {checkIn} / {checkOut}, {guests} guests. We will email you a confirmation.',
  'landing.newRequest': 'Create a new request',
  'landing.destTitle': 'Popular destinations',
  'landing.fromPrice': 'from {price} {currency}',
  'landing.trustHeading': 'Why an agency?',
  'landing.trustLede':
    'We compare hundreds of hotels on your behalf, negotiate the price and follow the booking through from start to finish. All you do is tell us where you want to go.',
  'landing.trust1Title': 'No prepayment',
  'landing.trust1Body': 'You pay at the hotel. We arrange availability and the best price.',
  'landing.trust2Title': 'Reply within 24h',
  'landing.trust2Body': 'Your request reaches a consultant and is answered the same business day.',
  'landing.trust3Title': 'Thousands of hotels',
  'landing.trust3Body': 'From city-centre stays to beach resorts, options from around the world.',
  'landing.bandTitle': "Didn't find the hotel you were looking for?",
  'landing.bandBody': 'Tell us the hotel or area you have in mind and our consultants will research it for you.',
  'landing.bandCta': 'Create a request',

  'footer.blurb':
    'An independent travel agency between travellers and a hotel network. We check availability, negotiate the price and follow the booking through from start to finish.',
  'footer.corporate': 'Company',
  'footer.legal': 'Legal',
  'footer.contact': 'Contact',
  'footer.about': 'About Us',
  'footer.contactPage': 'Contact',
  'footer.faq': 'Frequently Asked Questions',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Use',
  'footer.hours': 'Weekdays 09:00 – 18:00',
  'footer.rights': '© {year}',
  'footer.staffLogin': 'Staff Login',

  'about.title': 'About Us',
  'about.lead': 'Cassidy Travel is an independent travel agency between travellers and a hotel network.',
  'about.h1': 'What we do',
  'about.p1':
    'We bring thousands of hotels from around the world together in one place. You tell us where you want to go; we check availability, negotiate the price with the hotel and follow the booking through to completion. The difference is that we are not a search engine but a team that does the work on your behalf.',
  'about.h2': 'How it works',
  'about.step1':
    'From the search on the home page you pick your hotel, dates and number of guests and create a request.',
  'about.step2': 'Your request reaches a consultant. We confirm availability and the current price with the hotel.',
  'about.step3':
    'We reply the same business day and, once you approve, finalise the booking. Payment is normally made at the hotel.',
  'about.h3': 'Why work with an agency',
  'about.b1': 'We compare hundreds of hotels on your behalf and highlight the best option.',
  'about.b2': 'We negotiate the price and terms with the hotel; we do not ask for prepayment.',
  'about.b3': 'If anything goes wrong, you have a single team to deal with.',
  'about.closing': 'For questions, see our contact page or create a request directly from the hotel search.',

  'contact.title': 'Contact',
  'contact.lead':
    'Reservation requests are taken from the search on the home page. For anything else, reach us below.',
  'contact.office': 'Office',
  'contact.direct': 'Direct',
  'contact.phone': 'Phone',
  'contact.emailLabel': 'Email',
  'contact.reserveHeading': 'Want to make a reservation?',
  'contact.reserveBody':
    'Pick the hotel, dates and number of guests from the hotel search and create a request; our consultants will reply within 24 hours with availability and price.',
  'contact.goSearch': 'Go to hotel search',

  'faq.title': 'Frequently Asked Questions',
  'faq.lead': 'The most common questions about the request, payment and reservation process.',
  'faq.noAnswer': "Didn't find the answer you were looking for?",
  'faq.writeUs': 'Write to us.',
  'faq.q1': 'When do I pay?',
  'faq.a1':
    'Normally at the hotel during your stay. We do not ask for prepayment when you create a request; if a special rate requires the hotel to be paid upfront, we state this clearly in the confirmation email.',
  'faq.q2': 'How soon will I get a reply?',
  'faq.a2':
    'The same business day, within 24 hours at the latest. The consultant replies by email after confirming availability and the current price with the hotel.',
  'faq.q3': 'Does creating a request commit me?',
  'faq.a3':
    'No. A request is only an enquiry. The reservation becomes firm once you approve the terms in the confirmation email.',
  'faq.q4': 'Why are prices shown as "indicative"?',
  'faq.a4':
    'The nightly amounts on the site are approximate starting prices calculated by hotel type and region. The exact price is set once the hotel confirms it for your dates and room type.',
  'faq.q5': 'What if the hotel I want is not listed?',
  'faq.a5':
    'Type the hotel or area you have in mind into the "Create a request" field on the home page; our consultants will research it and offer options.',
  'faq.q6': 'Can I cancel the reservation?',
  'faq.a6':
    'Confirmed reservations are subject to the hotel\'s cancellation terms, which are included in the confirmation email. Just send us your cancellation request and we handle the process on your behalf.',
  'faq.q7': 'What happens to my personal data?',
  'faq.a7':
    'We only collect the information needed to process your request (name, email, phone, dates, hotel) and share it with the relevant hotel. See the Privacy Policy page for details.',

  'privacy.title': 'Privacy Policy',
  'privacy.lead':
    'This page explains how Cassidy Travel processes personal data in the context of reservation requests.',
  'privacy.h1': 'What data we collect',
  'privacy.p1':
    'From the request form on the home page we only take: full name, email address, phone number, the hotel and destination you select, check-in/check-out dates, number of guests and your note if any.',
  'privacy.h2': 'What we use it for',
  'privacy.p2':
    'We use the data to assess your request and contact the relevant hotel for availability and price confirmation, to reply to you and run the reservation process, and to meet our legal obligations.',
  'privacy.h3': 'Who we share it with',
  'privacy.p3':
    'Your data is shared only with the hotel your request concerns and the service providers needed to complete the reservation. It is not sold or transferred to third parties for marketing.',
  'privacy.h4': 'Retention period',
  'privacy.p4':
    'Request records are kept for a reasonable accounting and dispute period after the process is complete, then deleted or anonymised.',
  'privacy.h5': 'Your rights',
  'privacy.p5':
    'You have the right to access, correct or request deletion of your data. You can send such requests to {email}.',

  'terms.title': 'Terms of Use',
  'terms.lead':
    'The following terms apply when you use the Cassidy Travel website and request service.',
  'terms.h1': 'The role of the agency',
  'terms.p1':
    'Cassidy Travel does not provide the accommodation itself; it is a travel agency acting as an intermediary between the traveller and the hotel. The accommodation contract is between you and the hotel.',
  'terms.h2': 'Prices',
  'terms.p2':
    'The nightly amounts shown on the site are indicative and do not constitute a binding offer. The exact price is notified together with the confirmation obtained from the hotel for your dates and room type.',
  'terms.h3': 'Request and reservation',
  'terms.p3':
    'Creating a request alone does not amount to a reservation. The reservation becomes firm when you approve the terms in the confirmation email we send. Payment is made at the hotel during the stay unless stated otherwise.',
  'terms.h4': 'Cancellation and changes',
  'terms.p4':
    'Cancellation and change rights for confirmed reservations are subject to the hotel\'s terms and are included in the confirmation email. When you send us your cancellation request, we handle the process on your behalf.',
  'terms.h5': 'Liability',
  'terms.p5':
    'The hotel is responsible for the nature of the service it provides. Cassidy Travel takes reasonable care to keep information accurate and up to date; it cannot be held responsible for changes or disruptions originating from the hotel.',
  'terms.h6': 'Changes',
  'terms.p6': 'These terms may be updated from time to time. The current version is always published on this page.',

  'legal.contactPrompt': 'For questions, you can write to us on our contact page.',
}

const ru: Dict = {
  'lang.label': 'Язык',

  'nav.dashboard': 'Панель',
  'nav.home': 'Главная',
  'nav.hotels': 'Отели',
  'nav.reservations': 'Брони',
  'nav.newReservation': 'Новая бронь',
  'nav.requests': 'Заявки',
  'nav.customers': 'Клиенты',
  'nav.staff': 'Сотрудники',
  'nav.settings': 'Настройки',
  'nav.hotelProfile': 'Профиль отеля',
  'nav.roomTypes': 'Типы номеров',
  'nav.services': 'Услуги',
  'nav.prices': 'Цены',

  'panel.admin': 'Панель администратора агентства',
  'panel.staff': 'Панель сотрудника агентства',
  'panel.hotel': 'Панель отеля',

  'shell.tagline': 'Центр отельного агентства',
  'shell.logout': 'Выйти',

  'common.save': 'Сохранить',
  'common.saving': 'Сохранение…',
  'common.cancel': 'Отмена',
  'common.edit': 'Изменить',
  'common.delete': 'Удалить',
  'common.add': 'Добавить',
  'common.loading': 'Загрузка…',
  'common.loadError': 'Не удалось загрузить данные.',

  'login.subtitle': 'Войдите в свой аккаунт',
  'login.email': 'Эл. почта',
  'login.password': 'Пароль',
  'login.submit': 'Войти',
  'login.submitting': 'Вход…',
  'login.error': 'Не удалось войти.',
  'login.footer': 'Регистрация нового отеля?',
  'login.haveAccount': 'Уже есть аккаунт?',
  'login.register': 'Зарегистрироваться',

  'register.subtitle': 'Регистрация нового отеля',
  'register.name': 'Название отеля',
  'register.contactPerson': 'Контактное лицо',
  'register.email': 'Эл. почта',
  'register.password': 'Пароль (не менее 8 символов)',
  'register.phone': 'Телефон',
  'register.address': 'Адрес',
  'register.city': 'Город',
  'register.country': 'Страна',
  'register.description': 'Описание',
  'register.descriptionPlaceholder': 'Краткая информация об отеле…',
  'register.submit': 'Зарегистрировать отель',
  'register.submitting': 'Сохранение…',
  'register.error': 'Произошла ошибка.',
  'register.doneTitle': 'Заявка принята',
  'register.doneBody':
    'Ваша заявка на отель «{name}» принята. Команда агентства рассматривает её; о результате сообщим на адрес {email}.',
  'register.doneFooterPre': 'После одобрения вы сможете',
  'register.doneFooterLink': 'войти с выбранным паролем',

  'gate.pendingTitle': 'Заявка на рассмотрении',
  'gate.pendingBody':
    'Регистрация вашего отеля рассматривается командой агентства. После одобрения доступ к панели откроется, и вы получите уведомление по эл. почте.',
  'gate.rejectedTitle': 'Заявка отклонена',
  'gate.rejectedBody':
    'Ваша заявка на отель отклонена агентством. За подробностями обратитесь в агентство.',

  'landing.loginCta': 'Вход для сотрудников',
  'landing.heroTitle1': 'Ваш следующий отпуск',
  'landing.heroTitle2': 'всего в одной заявке',
  'landing.heroLede':
    'Выберите из {count} отелей, остальное сделает наша команда. Наличие мест и цена — в течение 24 часов, без предоплаты.',
  'landing.heroLedeNoCount':
    'Выберите из тысяч отелей, остальное сделает наша команда. Наличие мест и цена — в течение 24 часов, без предоплаты.',
  'landing.searchTitle': 'Поиск отелей',
  'landing.fieldHotel': 'Отель',
  'landing.fieldCheckIn': 'Заезд',
  'landing.fieldCheckOut': 'Выезд',
  'landing.fieldGuests': 'Гости',
  'landing.searchPlaceholder': 'Название отеля или город…',
  'landing.loadingHotels': 'Загрузка отелей…',
  'landing.catalogError': 'Не удалось загрузить каталог.',
  'landing.estimate': 'Ориентировочная сумма',
  'landing.estimateNote': '{nights} ноч. · ориентировочно, уточняется при подтверждении',
  'landing.continue': 'Продолжить',
  'landing.contactTitle': 'Ваши контактные данные',
  'landing.name': 'Имя и фамилия',
  'landing.email': 'Эл. почта',
  'landing.phone': 'Телефон',
  'landing.note': 'Примечание (необязательно)',
  'landing.notePlaceholder': 'Пожелания по номеру, особые просьбы…',
  'landing.submit': 'Отправить заявку',
  'landing.submitting': 'Отправка…',
  'landing.backToSearch': '← Поиск',
  'landing.errorSubmit': 'Не удалось отправить заявку. Попробуйте ещё раз.',
  'landing.doneTitle': 'Заявка принята',
  'landing.doneRef': 'Номер заявки',
  'landing.doneNote':
    '{hotel} — {city}, {country}. {checkIn} / {checkOut}, гостей: {guests}. Мы отправим вам подтверждение по эл. почте.',
  'landing.newRequest': 'Создать новую заявку',
  'landing.destTitle': 'Популярные направления',
  'landing.fromPrice': 'от {price} {currency}',
  'landing.trustHeading': 'Зачем агентство?',
  'landing.trustLede':
    'Мы сравниваем сотни отелей за вас, договариваемся о цене и ведём бронирование от начала до конца. Вам нужно только сказать, куда вы хотите поехать.',
  'landing.trust1Title': 'Без предоплаты',
  'landing.trust1Body': 'Вы платите в отеле. Мы обеспечиваем наличие мест и лучшую цену.',
  'landing.trust2Title': 'Ответ за 24 часа',
  'landing.trust2Body': 'Заявка попадает к консультанту, ответ — в тот же рабочий день.',
  'landing.trust3Title': 'Тысячи отелей',
  'landing.trust3Body': 'От отелей в центре города до пляжных курортов — варианты со всего мира.',
  'landing.bandTitle': 'Не нашли нужный отель?',
  'landing.bandBody': 'Напишите отель или район, который вас интересует, и наши консультанты изучат его для вас.',
  'landing.bandCta': 'Создать заявку',

  'footer.blurb':
    'Независимое туристическое агентство между путешественниками и сетью отелей. Проверяем наличие мест, договариваемся о цене и ведём бронирование от начала до конца.',
  'footer.corporate': 'Компания',
  'footer.legal': 'Правовое',
  'footer.contact': 'Контакты',
  'footer.about': 'О нас',
  'footer.contactPage': 'Контакты',
  'footer.faq': 'Частые вопросы',
  'footer.privacy': 'Политика конфиденциальности',
  'footer.terms': 'Условия использования',
  'footer.hours': 'Будни 09:00 – 18:00',
  'footer.rights': '© {year}',
  'footer.staffLogin': 'Вход для сотрудников',

  'about.title': 'О нас',
  'about.lead': 'Cassidy Travel — независимое туристическое агентство между путешественниками и сетью отелей.',
  'about.h1': 'Чем мы занимаемся',
  'about.p1':
    'Мы собираем тысячи отелей со всего мира в одном месте. Вы говорите, куда хотите поехать; мы проверяем наличие мест, договариваемся с отелем о цене и доводим бронирование до конца. Отличие в том, что мы не поисковик, а команда, которая делает работу за вас.',
  'about.h2': 'Как это работает',
  'about.step1':
    'В поиске на главной странице вы выбираете отель, даты и число гостей и создаёте заявку.',
  'about.step2': 'Заявка попадает к консультанту. Мы подтверждаем наличие мест и актуальную цену у отеля.',
  'about.step3':
    'Мы отвечаем в тот же рабочий день и после вашего согласия оформляем бронь. Оплата, как правило, в отеле.',
  'about.h3': 'Почему стоит работать с агентством',
  'about.b1': 'Мы сравниваем сотни отелей за вас и выделяем лучший вариант.',
  'about.b2': 'Мы договариваемся о цене и условиях с отелем; предоплату не просим.',
  'about.b3': 'Если что-то пойдёт не так, у вас один ответственный — наша команда.',
  'about.closing': 'По вопросам загляните на страницу контактов или создайте заявку прямо из поиска отелей.',

  'contact.title': 'Контакты',
  'contact.lead':
    'Заявки на бронирование принимаются через поиск на главной странице. По остальным вопросам свяжитесь с нами ниже.',
  'contact.office': 'Офис',
  'contact.direct': 'Напрямую',
  'contact.phone': 'Телефон',
  'contact.emailLabel': 'Эл. почта',
  'contact.reserveHeading': 'Хотите забронировать?',
  'contact.reserveBody':
    'Выберите отель, даты и число гостей в поиске отелей и создайте заявку; наши консультанты ответят в течение 24 часов с наличием мест и ценой.',
  'contact.goSearch': 'Перейти к поиску отелей',

  'faq.title': 'Частые вопросы',
  'faq.lead': 'Самые частые вопросы о заявке, оплате и процессе бронирования.',
  'faq.noAnswer': 'Не нашли нужный ответ?',
  'faq.writeUs': 'Напишите нам.',
  'faq.q1': 'Когда я оплачиваю?',
  'faq.a1':
    'Как правило, в отеле во время проживания. При создании заявки предоплату мы не просим; если по специальному тарифу отель требует оплату заранее, мы прямо укажем это в письме с подтверждением.',
  'faq.q2': 'Как быстро мне ответят?',
  'faq.a2':
    'В тот же рабочий день, максимум в течение 24 часов. Консультант отвечает по эл. почте после подтверждения наличия мест и актуальной цены у отеля.',
  'faq.q3': 'Обязывает ли меня создание заявки?',
  'faq.a3':
    'Нет. Заявка — это только запрос. Бронирование становится окончательным после того, как вы согласуете условия в письме с подтверждением.',
  'faq.q4': 'Почему цены указаны как «ориентировочные»?',
  'faq.a4':
    'Суммы за ночь на сайте — это примерные стартовые цены, рассчитанные по типу отеля и региону. Точная цена определяется после подтверждения отелем на ваши даты и тип номера.',
  'faq.q5': 'Что делать, если нужного отеля нет в списке?',
  'faq.a5':
    'Впишите интересующий отель или район в поле «Создать заявку» на главной странице; наши консультанты изучат его и предложат варианты.',
  'faq.q6': 'Могу ли я отменить бронь?',
  'faq.a6':
    'Подтверждённые брони подчиняются условиям отмены отеля, которые указаны в письме с подтверждением. Достаточно отправить нам запрос на отмену — процесс мы ведём за вас.',
  'faq.q7': 'Что происходит с моими персональными данными?',
  'faq.a7':
    'Мы собираем только данные, нужные для обработки заявки (имя, эл. почта, телефон, даты, отель), и передаём их соответствующему отелю. Подробнее — на странице «Политика конфиденциальности».',

  'privacy.title': 'Политика конфиденциальности',
  'privacy.lead':
    'На этой странице описано, как Cassidy Travel обрабатывает персональные данные в рамках заявок на бронирование.',
  'privacy.h1': 'Какие данные мы собираем',
  'privacy.p1':
    'Из формы заявки на главной странице мы берём только: имя и фамилию, адрес эл. почты, номер телефона, выбранные вами отель и направление, даты заезда/выезда, число гостей и примечание, если оно есть.',
  'privacy.h2': 'Для чего мы их используем',
  'privacy.p2':
    'Данные используются для оценки вашей заявки и связи с отелем по наличию мест и цене, для ответа вам и ведения процесса бронирования, а также для выполнения наших юридических обязанностей.',
  'privacy.h3': 'С кем мы делимся',
  'privacy.p3':
    'Ваши данные передаются только отелю, к которому относится заявка, и поставщикам услуг, необходимым для завершения бронирования. Они не продаются и не передаются третьим лицам для маркетинга.',
  'privacy.h4': 'Срок хранения',
  'privacy.p4':
    'Записи заявок хранятся в течение разумного бухгалтерского и претензионного срока после завершения процесса, затем удаляются или обезличиваются.',
  'privacy.h5': 'Ваши права',
  'privacy.p5':
    'Вы имеете право на доступ, исправление или удаление ваших данных. Такие запросы можно направить на адрес {email}.',

  'terms.title': 'Условия использования',
  'terms.lead':
    'При использовании сайта и сервиса заявок Cassidy Travel действуют следующие условия.',
  'terms.h1': 'Роль агентства',
  'terms.p1':
    'Cassidy Travel не предоставляет проживание сам по себе; это туристическое агентство-посредник между путешественником и отелем. Договор на проживание заключается между вами и отелем.',
  'terms.h2': 'Цены',
  'terms.p2':
    'Указанные на сайте суммы за ночь являются ориентировочными и не являются офертой. Точная цена сообщается вместе с подтверждением, полученным от отеля на ваши даты и тип номера.',
  'terms.h3': 'Заявка и бронирование',
  'terms.p3':
    'Создание заявки само по себе не является бронированием. Бронь становится окончательной, когда вы согласуете условия в отправленном нами письме с подтверждением. Оплата производится в отеле во время проживания, если не указано иное.',
  'terms.h4': 'Отмена и изменения',
  'terms.p4':
    'Права на отмену и изменение подтверждённых броней подчиняются условиям соответствующего отеля и указаны в письме с подтверждением. Когда вы направляете нам запрос на отмену, процесс мы ведём за вас.',
  'terms.h5': 'Ответственность',
  'terms.p5':
    'За характер предоставляемой услуги отвечает отель. Cassidy Travel прилагает разумные усилия, чтобы информация была точной и актуальной; агентство не несёт ответственности за изменения и сбои, исходящие от отеля.',
  'terms.h6': 'Изменения',
  'terms.p6': 'Эти условия могут время от времени обновляться. Актуальная версия всегда публикуется на этой странице.',

  'legal.contactPrompt': 'По вопросам вы можете написать нам на странице контактов.',
}

const de: Dict = {
  'lang.label': 'Sprache',

  'nav.dashboard': 'Übersicht',
  'nav.home': 'Startseite',
  'nav.hotels': 'Hotels',
  'nav.reservations': 'Reservierungen',
  'nav.newReservation': 'Neue Reservierung',
  'nav.requests': 'Anfragen',
  'nav.customers': 'Kunden',
  'nav.staff': 'Mitarbeiter',
  'nav.settings': 'Einstellungen',
  'nav.hotelProfile': 'Hotelprofil',
  'nav.roomTypes': 'Zimmertypen',
  'nav.services': 'Leistungen',
  'nav.prices': 'Preise',

  'panel.admin': 'Agentur-Admin-Bereich',
  'panel.staff': 'Agentur-Mitarbeiterbereich',
  'panel.hotel': 'Hotelbereich',

  'shell.tagline': 'Hotelagentur-Zentrale',
  'shell.logout': 'Abmelden',

  'common.save': 'Speichern',
  'common.saving': 'Wird gespeichert…',
  'common.cancel': 'Abbrechen',
  'common.edit': 'Bearbeiten',
  'common.delete': 'Löschen',
  'common.add': 'Hinzufügen',
  'common.loading': 'Wird geladen…',
  'common.loadError': 'Daten konnten nicht geladen werden.',

  'login.subtitle': 'Bei Ihrem Konto anmelden',
  'login.email': 'E-Mail',
  'login.password': 'Passwort',
  'login.submit': 'Anmelden',
  'login.submitting': 'Anmeldung läuft…',
  'login.error': 'Anmeldung fehlgeschlagen.',
  'login.footer': 'Neue Hotelregistrierung?',
  'login.haveAccount': 'Sie haben bereits ein Konto?',
  'login.register': 'Registrieren',

  'register.subtitle': 'Neue Hotelregistrierung',
  'register.name': 'Hotelname',
  'register.contactPerson': 'Ansprechpartner',
  'register.email': 'E-Mail',
  'register.password': 'Passwort (mindestens 8 Zeichen)',
  'register.phone': 'Telefon',
  'register.address': 'Adresse',
  'register.city': 'Stadt',
  'register.country': 'Land',
  'register.description': 'Beschreibung',
  'register.descriptionPlaceholder': 'Kurze Information zum Hotel…',
  'register.submit': 'Hotel registrieren',
  'register.submitting': 'Wird gespeichert…',
  'register.error': 'Ein Fehler ist aufgetreten.',
  'register.doneTitle': 'Antrag eingegangen',
  'register.doneBody':
    'Ihr Hotelantrag für {name} ist eingegangen. Unser Agenturteam prüft ihn; das Ergebnis wird an {email} per E-Mail mitgeteilt.',
  'register.doneFooterPre': 'Nach der Freigabe können Sie sich',
  'register.doneFooterLink': 'mit dem gewählten Passwort anmelden',

  'gate.pendingTitle': 'Antrag in Prüfung',
  'gate.pendingBody':
    'Ihre Hotelregistrierung wird von unserem Agenturteam geprüft. Nach der Freigabe wird der Bereichszugang geöffnet und Sie werden per E-Mail benachrichtigt.',
  'gate.rejectedTitle': 'Antrag abgelehnt',
  'gate.rejectedBody':
    'Ihr Hotelantrag wurde von der Agentur abgelehnt. Für Details wenden Sie sich bitte an die Agentur.',

  'landing.loginCta': 'Mitarbeiter-Login',
  'landing.heroTitle1': 'Ihr nächster Urlaub',
  'landing.heroTitle2': 'ist nur eine Anfrage entfernt',
  'landing.heroLede':
    'Wählen Sie aus {count} Hotels, den Rest übernimmt unser Team. Verfügbarkeit und Preis innerhalb von 24 Stunden, ohne Vorauszahlung.',
  'landing.heroLedeNoCount':
    'Wählen Sie aus Tausenden Hotels, den Rest übernimmt unser Team. Verfügbarkeit und Preis innerhalb von 24 Stunden, ohne Vorauszahlung.',
  'landing.searchTitle': 'Hotels suchen',
  'landing.fieldHotel': 'Hotel',
  'landing.fieldCheckIn': 'Anreise',
  'landing.fieldCheckOut': 'Abreise',
  'landing.fieldGuests': 'Gäste',
  'landing.searchPlaceholder': 'Hotelname oder Stadt…',
  'landing.loadingHotels': 'Hotels werden geladen…',
  'landing.catalogError': 'Katalog konnte nicht geladen werden.',
  'landing.estimate': 'Geschätzter Gesamtbetrag',
  'landing.estimateNote': '{nights} Nächte · Richtwert, bei Bestätigung final',
  'landing.continue': 'Weiter',
  'landing.contactTitle': 'Ihre Kontaktdaten',
  'landing.name': 'Vor- und Nachname',
  'landing.email': 'E-Mail',
  'landing.phone': 'Telefon',
  'landing.note': 'Anmerkung (optional)',
  'landing.notePlaceholder': 'Zimmerwunsch, besondere Wünsche…',
  'landing.submit': 'Anfrage senden',
  'landing.submitting': 'Wird gesendet…',
  'landing.backToSearch': '← Suche',
  'landing.errorSubmit': 'Anfrage konnte nicht gesendet werden. Bitte erneut versuchen.',
  'landing.doneTitle': 'Anfrage eingegangen',
  'landing.doneRef': 'Referenz-Nr.',
  'landing.doneNote':
    '{hotel} — {city}, {country}. {checkIn} / {checkOut}, {guests} Gäste. Wir senden Ihnen eine Bestätigung per E-Mail.',
  'landing.newRequest': 'Neue Anfrage erstellen',
  'landing.destTitle': 'Beliebte Reiseziele',
  'landing.fromPrice': 'ab {price} {currency}',
  'landing.trustHeading': 'Warum eine Agentur?',
  'landing.trustLede':
    'Wir vergleichen Hunderte Hotels für Sie, verhandeln den Preis und begleiten die Buchung von Anfang bis Ende. Sie sagen uns nur, wohin Sie möchten.',
  'landing.trust1Title': 'Keine Vorauszahlung',
  'landing.trust1Body': 'Sie zahlen im Hotel. Wir organisieren Verfügbarkeit und den besten Preis.',
  'landing.trust2Title': 'Antwort in 24 Stunden',
  'landing.trust2Body': 'Ihre Anfrage erreicht einen Berater und wird am selben Werktag beantwortet.',
  'landing.trust3Title': 'Tausende Hotels',
  'landing.trust3Body': 'Vom Stadthotel bis zum Strandresort — Optionen aus aller Welt.',
  'landing.bandTitle': 'Nicht das gesuchte Hotel gefunden?',
  'landing.bandBody': 'Nennen Sie uns das Hotel oder die Region, an die Sie denken, und unsere Berater recherchieren es für Sie.',
  'landing.bandCta': 'Anfrage erstellen',

  'footer.blurb':
    'Eine unabhängige Reiseagentur zwischen Reisenden und einem Hotelnetzwerk. Wir prüfen die Verfügbarkeit, verhandeln den Preis und begleiten die Buchung von Anfang bis Ende.',
  'footer.corporate': 'Unternehmen',
  'footer.legal': 'Rechtliches',
  'footer.contact': 'Kontakt',
  'footer.about': 'Über uns',
  'footer.contactPage': 'Kontakt',
  'footer.faq': 'Häufige Fragen',
  'footer.privacy': 'Datenschutz',
  'footer.terms': 'Nutzungsbedingungen',
  'footer.hours': 'Werktags 09:00 – 18:00',
  'footer.rights': '© {year}',
  'footer.staffLogin': 'Mitarbeiter-Login',

  'about.title': 'Über uns',
  'about.lead': 'Cassidy Travel ist eine unabhängige Reiseagentur zwischen Reisenden und einem Hotelnetzwerk.',
  'about.h1': 'Was wir tun',
  'about.p1':
    'Wir bringen Tausende Hotels aus aller Welt an einem Ort zusammen. Sie sagen uns, wohin Sie möchten; wir prüfen die Verfügbarkeit, verhandeln den Preis mit dem Hotel und begleiten die Buchung bis zum Abschluss. Der Unterschied: Wir sind keine Suchmaschine, sondern ein Team, das die Arbeit für Sie erledigt.',
  'about.h2': 'So funktioniert es',
  'about.step1':
    'Über die Suche auf der Startseite wählen Sie Ihr Hotel, die Daten und die Gästezahl und erstellen eine Anfrage.',
  'about.step2': 'Ihre Anfrage erreicht einen Berater. Wir bestätigen Verfügbarkeit und aktuellen Preis beim Hotel.',
  'about.step3':
    'Wir antworten am selben Werktag und schließen die Buchung nach Ihrer Zustimmung ab. Die Zahlung erfolgt in der Regel im Hotel.',
  'about.h3': 'Warum mit einer Agentur arbeiten',
  'about.b1': 'Wir vergleichen Hunderte Hotels für Sie und heben die beste Option hervor.',
  'about.b2': 'Wir verhandeln Preis und Bedingungen mit dem Hotel; eine Vorauszahlung verlangen wir nicht.',
  'about.b3': 'Wenn etwas schiefgeht, haben Sie ein einziges Team als Ansprechpartner.',
  'about.closing': 'Bei Fragen besuchen Sie unsere Kontaktseite oder erstellen Sie direkt aus der Hotelsuche eine Anfrage.',

  'contact.title': 'Kontakt',
  'contact.lead':
    'Reservierungsanfragen werden über die Suche auf der Startseite entgegengenommen. Für alles Weitere erreichen Sie uns unten.',
  'contact.office': 'Büro',
  'contact.direct': 'Direkt',
  'contact.phone': 'Telefon',
  'contact.emailLabel': 'E-Mail',
  'contact.reserveHeading': 'Möchten Sie reservieren?',
  'contact.reserveBody':
    'Wählen Sie Hotel, Daten und Gästezahl in der Hotelsuche und erstellen Sie eine Anfrage; unsere Berater antworten innerhalb von 24 Stunden mit Verfügbarkeit und Preis.',
  'contact.goSearch': 'Zur Hotelsuche',

  'faq.title': 'Häufige Fragen',
  'faq.lead': 'Die häufigsten Fragen zum Anfrage-, Zahlungs- und Reservierungsablauf.',
  'faq.noAnswer': 'Nicht die gesuchte Antwort gefunden?',
  'faq.writeUs': 'Schreiben Sie uns.',
  'faq.q1': 'Wann zahle ich?',
  'faq.a1':
    'In der Regel im Hotel während des Aufenthalts. Beim Erstellen einer Anfrage verlangen wir keine Vorauszahlung; wenn ein Sondertarif eine Vorauszahlung an das Hotel verlangt, weisen wir dies in der Bestätigungs-E-Mail klar aus.',
  'faq.q2': 'Wie schnell erhalte ich eine Antwort?',
  'faq.a2':
    'Am selben Werktag, spätestens innerhalb von 24 Stunden. Der Berater antwortet per E-Mail, nachdem er Verfügbarkeit und aktuellen Preis beim Hotel bestätigt hat.',
  'faq.q3': 'Bindet mich das Erstellen einer Anfrage?',
  'faq.a3':
    'Nein. Eine Anfrage ist nur eine Anfrage. Die Reservierung wird verbindlich, sobald Sie die Bedingungen in der Bestätigungs-E-Mail bestätigen.',
  'faq.q4': 'Warum werden Preise als „Richtwert" angezeigt?',
  'faq.a4':
    'Die Nachtpreise auf der Website sind ungefähre Startpreise, berechnet nach Hoteltyp und Region. Der genaue Preis steht fest, sobald das Hotel ihn für Ihre Daten und Ihren Zimmertyp bestätigt.',
  'faq.q5': 'Was, wenn das gewünschte Hotel nicht gelistet ist?',
  'faq.a5':
    'Geben Sie das gewünschte Hotel oder Gebiet in das Feld „Anfrage erstellen" auf der Startseite ein; unsere Berater recherchieren es und bieten Optionen an.',
  'faq.q6': 'Kann ich die Reservierung stornieren?',
  'faq.a6':
    'Bestätigte Reservierungen unterliegen den Stornobedingungen des Hotels, die in der Bestätigungs-E-Mail enthalten sind. Senden Sie uns einfach Ihre Stornoanfrage — den Ablauf übernehmen wir für Sie.',
  'faq.q7': 'Was passiert mit meinen personenbezogenen Daten?',
  'faq.a7':
    'Wir erheben nur die zur Bearbeitung Ihrer Anfrage nötigen Angaben (Name, E-Mail, Telefon, Daten, Hotel) und geben sie an das betreffende Hotel weiter. Details finden Sie auf der Datenschutzseite.',

  'privacy.title': 'Datenschutz',
  'privacy.lead':
    'Diese Seite erläutert, wie Cassidy Travel personenbezogene Daten im Rahmen von Reservierungsanfragen verarbeitet.',
  'privacy.h1': 'Welche Daten wir erheben',
  'privacy.p1':
    'Aus dem Anfrageformular auf der Startseite erheben wir nur: Vor- und Nachname, E-Mail-Adresse, Telefonnummer, das von Ihnen gewählte Hotel und Reiseziel, An-/Abreisedaten, Gästezahl und ggf. Ihre Anmerkung.',
  'privacy.h2': 'Wofür wir sie nutzen',
  'privacy.p2':
    'Wir nutzen die Daten, um Ihre Anfrage zu prüfen und das betreffende Hotel zu Verfügbarkeit und Preis zu kontaktieren, um Ihnen zu antworten und den Reservierungsablauf durchzuführen sowie um unseren gesetzlichen Pflichten nachzukommen.',
  'privacy.h3': 'An wen wir sie weitergeben',
  'privacy.p3':
    'Ihre Daten werden nur an das Hotel, das Ihre Anfrage betrifft, und an die zur Abwicklung der Reservierung nötigen Dienstleister weitergegeben. Sie werden nicht zu Marketingzwecken an Dritte verkauft oder übertragen.',
  'privacy.h4': 'Speicherdauer',
  'privacy.p4':
    'Anfragedatensätze werden nach Abschluss des Vorgangs für einen angemessenen Buchhaltungs- und Streitzeitraum aufbewahrt und danach gelöscht oder anonymisiert.',
  'privacy.h5': 'Ihre Rechte',
  'privacy.p5':
    'Sie haben das Recht auf Auskunft, Berichtigung oder Löschung Ihrer Daten. Solche Anfragen können Sie an {email} senden.',

  'terms.title': 'Nutzungsbedingungen',
  'terms.lead':
    'Für die Nutzung der Website und des Anfrageservice von Cassidy Travel gelten die folgenden Bedingungen.',
  'terms.h1': 'Die Rolle der Agentur',
  'terms.p1':
    'Cassidy Travel stellt die Unterkunft nicht selbst bereit; es ist eine Reiseagentur als Vermittler zwischen Reisendem und Hotel. Der Beherbergungsvertrag kommt zwischen Ihnen und dem Hotel zustande.',
  'terms.h2': 'Preise',
  'terms.p2':
    'Die auf der Website angezeigten Nachtpreise sind Richtwerte und stellen kein verbindliches Angebot dar. Der genaue Preis wird zusammen mit der vom Hotel für Ihre Daten und Ihren Zimmertyp erhaltenen Bestätigung mitgeteilt.',
  'terms.h3': 'Anfrage und Reservierung',
  'terms.p3':
    'Das Erstellen einer Anfrage allein stellt keine Reservierung dar. Die Reservierung wird verbindlich, wenn Sie die Bedingungen in der von uns gesendeten Bestätigungs-E-Mail bestätigen. Die Zahlung erfolgt während des Aufenthalts im Hotel, sofern nicht anders angegeben.',
  'terms.h4': 'Stornierung und Änderungen',
  'terms.p4':
    'Storno- und Änderungsrechte für bestätigte Reservierungen unterliegen den Bedingungen des jeweiligen Hotels und sind in der Bestätigungs-E-Mail enthalten. Wenn Sie uns Ihre Stornoanfrage senden, übernehmen wir den Ablauf für Sie.',
  'terms.h5': 'Haftung',
  'terms.p5':
    'Für die Art der erbrachten Leistung ist das Hotel verantwortlich. Cassidy Travel wendet angemessene Sorgfalt an, damit die Informationen korrekt und aktuell sind; für vom Hotel ausgehende Änderungen und Störungen kann die Agentur nicht verantwortlich gemacht werden.',
  'terms.h6': 'Änderungen',
  'terms.p6': 'Diese Bedingungen können von Zeit zu Zeit aktualisiert werden. Die aktuelle Fassung wird stets auf dieser Seite veröffentlicht.',

  'legal.contactPrompt': 'Bei Fragen können Sie uns auf unserer Kontaktseite schreiben.',
}

const es: Dict = {
  'lang.label': 'Idioma',

  'nav.dashboard': 'Panel',
  'nav.home': 'Inicio',
  'nav.hotels': 'Hoteles',
  'nav.reservations': 'Reservas',
  'nav.newReservation': 'Nueva reserva',
  'nav.requests': 'Solicitudes',
  'nav.customers': 'Clientes',
  'nav.staff': 'Personal',
  'nav.settings': 'Ajustes',
  'nav.hotelProfile': 'Perfil del hotel',
  'nav.roomTypes': 'Tipos de habitación',
  'nav.services': 'Servicios',
  'nav.prices': 'Precios',

  'panel.admin': 'Panel de administración de la agencia',
  'panel.staff': 'Panel del personal de la agencia',
  'panel.hotel': 'Panel del hotel',

  'shell.tagline': 'Centro de agencia hotelera',
  'shell.logout': 'Cerrar sesión',

  'common.save': 'Guardar',
  'common.saving': 'Guardando…',
  'common.cancel': 'Cancelar',
  'common.edit': 'Editar',
  'common.delete': 'Eliminar',
  'common.add': 'Añadir',
  'common.loading': 'Cargando…',
  'common.loadError': 'No se pudieron cargar los datos.',

  'login.subtitle': 'Inicia sesión en tu cuenta',
  'login.email': 'Correo electrónico',
  'login.password': 'Contraseña',
  'login.submit': 'Iniciar sesión',
  'login.submitting': 'Iniciando sesión…',
  'login.error': 'Error al iniciar sesión.',
  'login.footer': '¿Nuevo registro de hotel?',
  'login.haveAccount': '¿Ya tienes una cuenta?',
  'login.register': 'Registrarse',

  'register.subtitle': 'Nuevo registro de hotel',
  'register.name': 'Nombre del hotel',
  'register.contactPerson': 'Persona de contacto',
  'register.email': 'Correo electrónico',
  'register.password': 'Contraseña (mínimo 8 caracteres)',
  'register.phone': 'Teléfono',
  'register.address': 'Dirección',
  'register.city': 'Ciudad',
  'register.country': 'País',
  'register.description': 'Descripción',
  'register.descriptionPlaceholder': 'Breve información sobre el hotel…',
  'register.submit': 'Registrar hotel',
  'register.submitting': 'Guardando…',
  'register.error': 'Se ha producido un error.',
  'register.doneTitle': 'Solicitud recibida',
  'register.doneBody':
    'Se ha recibido tu solicitud de hotel para {name}. Nuestro equipo de agencia la está revisando; el resultado se comunicará por correo a {email}.',
  'register.doneFooterPre': 'Una vez aprobada, podrás',
  'register.doneFooterLink': 'iniciar sesión con la contraseña que elegiste',

  'gate.pendingTitle': 'Solicitud en revisión',
  'gate.pendingBody':
    'Nuestro equipo de agencia está revisando el registro de tu hotel. Cuando se apruebe, se abrirá el acceso al panel y se te avisará por correo.',
  'gate.rejectedTitle': 'Solicitud rechazada',
  'gate.rejectedBody':
    'La agencia ha rechazado tu solicitud de hotel. Para más información, ponte en contacto con la agencia.',

  'landing.loginCta': 'Acceso de personal',
  'landing.heroTitle1': 'Tu próximo viaje',
  'landing.heroTitle2': 'está a una solicitud de distancia',
  'landing.heroLede':
    'Elige entre {count} hoteles y deja que nuestro equipo se encargue del resto. Disponibilidad y precio confirmados en 24 horas, sin pago por adelantado.',
  'landing.heroLedeNoCount':
    'Elige entre miles de hoteles y deja que nuestro equipo se encargue del resto. Disponibilidad y precio confirmados en 24 horas, sin pago por adelantado.',
  'landing.searchTitle': 'Buscar hoteles',
  'landing.fieldHotel': 'Hotel',
  'landing.fieldCheckIn': 'Entrada',
  'landing.fieldCheckOut': 'Salida',
  'landing.fieldGuests': 'Huéspedes',
  'landing.searchPlaceholder': 'Nombre de hotel o ciudad…',
  'landing.loadingHotels': 'Cargando hoteles…',
  'landing.catalogError': 'No se pudo cargar el catálogo.',
  'landing.estimate': 'Total estimado',
  'landing.estimateNote': '{nights} noches · orientativo, se confirma al aprobar',
  'landing.continue': 'Continuar',
  'landing.contactTitle': 'Tus datos de contacto',
  'landing.name': 'Nombre y apellidos',
  'landing.email': 'Correo electrónico',
  'landing.phone': 'Teléfono',
  'landing.note': 'Nota (opcional)',
  'landing.notePlaceholder': 'Preferencia de habitación, peticiones especiales…',
  'landing.submit': 'Enviar solicitud',
  'landing.submitting': 'Enviando…',
  'landing.backToSearch': '← Búsqueda',
  'landing.errorSubmit': 'No se pudo enviar la solicitud. Inténtalo de nuevo.',
  'landing.doneTitle': 'Solicitud recibida',
  'landing.doneRef': 'N.º de referencia',
  'landing.doneNote':
    '{hotel} — {city}, {country}. {checkIn} / {checkOut}, {guests} huéspedes. Te enviaremos una confirmación por correo.',
  'landing.newRequest': 'Crear una nueva solicitud',
  'landing.destTitle': 'Destinos populares',
  'landing.fromPrice': 'desde {price} {currency}',
  'landing.trustHeading': '¿Por qué una agencia?',
  'landing.trustLede':
    'Comparamos cientos de hoteles por ti, negociamos el precio y hacemos seguimiento de la reserva de principio a fin. Tú solo nos dices adónde quieres ir.',
  'landing.trust1Title': 'Sin pago por adelantado',
  'landing.trust1Body': 'Pagas en el hotel. Nosotros gestionamos la disponibilidad y el mejor precio.',
  'landing.trust2Title': 'Respuesta en 24 h',
  'landing.trust2Body': 'Tu solicitud llega a un asesor y se responde el mismo día laborable.',
  'landing.trust3Title': 'Miles de hoteles',
  'landing.trust3Body': 'Desde hoteles en el centro hasta resorts de playa, opciones de todo el mundo.',
  'landing.bandTitle': '¿No encontraste el hotel que buscabas?',
  'landing.bandBody': 'Dinos el hotel o la zona que tienes en mente y nuestros asesores lo investigarán por ti.',
  'landing.bandCta': 'Crear una solicitud',

  'footer.blurb':
    'Una agencia de viajes independiente entre viajeros y una red de hoteles. Comprobamos la disponibilidad, negociamos el precio y hacemos seguimiento de la reserva de principio a fin.',
  'footer.corporate': 'Empresa',
  'footer.legal': 'Legal',
  'footer.contact': 'Contacto',
  'footer.about': 'Sobre nosotros',
  'footer.contactPage': 'Contacto',
  'footer.faq': 'Preguntas frecuentes',
  'footer.privacy': 'Política de privacidad',
  'footer.terms': 'Términos de uso',
  'footer.hours': 'Días laborables 09:00 – 18:00',
  'footer.rights': '© {year}',
  'footer.staffLogin': 'Acceso de personal',

  'about.title': 'Sobre nosotros',
  'about.lead': 'Cassidy Travel es una agencia de viajes independiente entre viajeros y una red de hoteles.',
  'about.h1': 'Qué hacemos',
  'about.p1':
    'Reunimos miles de hoteles de todo el mundo en un solo lugar. Tú nos dices adónde quieres ir; nosotros comprobamos la disponibilidad, negociamos el precio con el hotel y hacemos seguimiento de la reserva hasta completarla. La diferencia es que no somos un buscador, sino un equipo que hace el trabajo por ti.',
  'about.h2': 'Cómo funciona',
  'about.step1':
    'Desde el buscador de la página de inicio eliges tu hotel, las fechas y el número de huéspedes y creas una solicitud.',
  'about.step2': 'Tu solicitud llega a un asesor. Confirmamos la disponibilidad y el precio actual con el hotel.',
  'about.step3':
    'Respondemos el mismo día laborable y, tras tu aprobación, finalizamos la reserva. El pago suele hacerse en el hotel.',
  'about.h3': 'Por qué trabajar con una agencia',
  'about.b1': 'Comparamos cientos de hoteles por ti y destacamos la mejor opción.',
  'about.b2': 'Negociamos el precio y las condiciones con el hotel; no pedimos pago por adelantado.',
  'about.b3': 'Si algo va mal, tienes un único equipo con quien tratar.',
  'about.closing': 'Para consultas, visita nuestra página de contacto o crea una solicitud directamente desde el buscador de hoteles.',

  'contact.title': 'Contacto',
  'contact.lead':
    'Las solicitudes de reserva se reciben desde el buscador de la página de inicio. Para cualquier otra cuestión, contáctanos abajo.',
  'contact.office': 'Oficina',
  'contact.direct': 'Directo',
  'contact.phone': 'Teléfono',
  'contact.emailLabel': 'Correo electrónico',
  'contact.reserveHeading': '¿Quieres hacer una reserva?',
  'contact.reserveBody':
    'Elige el hotel, las fechas y el número de huéspedes en el buscador de hoteles y crea una solicitud; nuestros asesores responderán en 24 horas con disponibilidad y precio.',
  'contact.goSearch': 'Ir al buscador de hoteles',

  'faq.title': 'Preguntas frecuentes',
  'faq.lead': 'Las preguntas más habituales sobre la solicitud, el pago y el proceso de reserva.',
  'faq.noAnswer': '¿No encontraste la respuesta que buscabas?',
  'faq.writeUs': 'Escríbenos.',
  'faq.q1': '¿Cuándo pago?',
  'faq.a1':
    'Normalmente en el hotel durante tu estancia. No pedimos pago por adelantado al crear una solicitud; si una tarifa especial exige pagar al hotel por adelantado, lo indicamos claramente en el correo de confirmación.',
  'faq.q2': '¿Cuánto tardaréis en responder?',
  'faq.a2':
    'El mismo día laborable, como máximo en 24 horas. El asesor responde por correo tras confirmar la disponibilidad y el precio actual con el hotel.',
  'faq.q3': '¿Crear una solicitud me compromete?',
  'faq.a3':
    'No. Una solicitud es solo una consulta. La reserva queda firme cuando apruebas las condiciones del correo de confirmación.',
  'faq.q4': '¿Por qué los precios aparecen como "orientativos"?',
  'faq.a4':
    'Los importes por noche del sitio son precios de partida aproximados calculados por tipo de hotel y región. El precio exacto se fija cuando el hotel lo confirma para tus fechas y tipo de habitación.',
  'faq.q5': '¿Qué hago si el hotel que quiero no está en la lista?',
  'faq.a5':
    'Escribe el hotel o la zona que tienes en mente en el campo "Crear una solicitud" de la página de inicio; nuestros asesores lo investigarán y te ofrecerán opciones.',
  'faq.q6': '¿Puedo cancelar la reserva?',
  'faq.a6':
    'Las reservas confirmadas están sujetas a las condiciones de cancelación del hotel, que figuran en el correo de confirmación. Solo tienes que enviarnos tu solicitud de cancelación y gestionamos el proceso por ti.',
  'faq.q7': '¿Qué pasa con mis datos personales?',
  'faq.a7':
    'Solo recogemos la información necesaria para tramitar tu solicitud (nombre, correo, teléfono, fechas, hotel) y la compartimos con el hotel correspondiente. Consulta la página de Política de privacidad para más detalles.',

  'privacy.title': 'Política de privacidad',
  'privacy.lead':
    'Esta página explica cómo trata Cassidy Travel los datos personales en el contexto de las solicitudes de reserva.',
  'privacy.h1': 'Qué datos recogemos',
  'privacy.p1':
    'Del formulario de solicitud de la página de inicio solo tomamos: nombre y apellidos, correo electrónico, número de teléfono, el hotel y el destino que selecciones, fechas de entrada/salida, número de huéspedes y tu nota si la hay.',
  'privacy.h2': 'Para qué los usamos',
  'privacy.p2':
    'Usamos los datos para evaluar tu solicitud y contactar con el hotel correspondiente para confirmar disponibilidad y precio, para responderte y llevar a cabo el proceso de reserva, y para cumplir nuestras obligaciones legales.',
  'privacy.h3': 'Con quién los compartimos',
  'privacy.p3':
    'Tus datos se comparten únicamente con el hotel al que se refiere tu solicitud y con los proveedores de servicios necesarios para completar la reserva. No se venden ni se ceden a terceros con fines de marketing.',
  'privacy.h4': 'Plazo de conservación',
  'privacy.p4':
    'Los registros de solicitudes se conservan durante un plazo razonable contable y de reclamaciones tras completarse el proceso, y después se eliminan o se anonimizan.',
  'privacy.h5': 'Tus derechos',
  'privacy.p5':
    'Tienes derecho a acceder, rectificar o solicitar la supresión de tus datos. Puedes enviar estas solicitudes a {email}.',

  'terms.title': 'Términos de uso',
  'terms.lead':
    'Al usar el sitio web y el servicio de solicitudes de Cassidy Travel se aplican los siguientes términos.',
  'terms.h1': 'El papel de la agencia',
  'terms.p1':
    'Cassidy Travel no presta el alojamiento por sí misma; es una agencia de viajes que actúa como intermediaria entre el viajero y el hotel. El contrato de alojamiento se celebra entre tú y el hotel.',
  'terms.h2': 'Precios',
  'terms.p2':
    'Los importes por noche mostrados en el sitio son orientativos y no constituyen una oferta vinculante. El precio exacto se comunica junto con la confirmación obtenida del hotel para tus fechas y tipo de habitación.',
  'terms.h3': 'Solicitud y reserva',
  'terms.p3':
    'Crear una solicitud por sí solo no equivale a una reserva. La reserva queda firme cuando apruebas las condiciones del correo de confirmación que enviamos. El pago se realiza en el hotel durante la estancia, salvo que se indique lo contrario.',
  'terms.h4': 'Cancelación y cambios',
  'terms.p4':
    'Los derechos de cancelación y cambio de las reservas confirmadas están sujetos a las condiciones del hotel correspondiente y figuran en el correo de confirmación. Cuando nos envías tu solicitud de cancelación, gestionamos el proceso por ti.',
  'terms.h5': 'Responsabilidad',
  'terms.p5':
    'El hotel es responsable de la naturaleza del servicio que presta. Cassidy Travel pone un cuidado razonable en mantener la información exacta y actualizada; no se le puede responsabilizar de los cambios o incidencias que tengan su origen en el hotel.',
  'terms.h6': 'Cambios',
  'terms.p6': 'Estos términos pueden actualizarse de vez en cuando. La versión vigente se publica siempre en esta página.',

  'legal.contactPrompt': 'Para consultas, puedes escribirnos en nuestra página de contacto.',
}

const ar: Dict = {
  'lang.label': 'اللغة',

  'nav.dashboard': 'لوحة التحكم',
  'nav.home': 'الرئيسية',
  'nav.hotels': 'الفنادق',
  'nav.reservations': 'الحجوزات',
  'nav.newReservation': 'حجز جديد',
  'nav.requests': 'الطلبات',
  'nav.customers': 'العملاء',
  'nav.staff': 'الموظفون',
  'nav.settings': 'الإعدادات',
  'nav.hotelProfile': 'ملف الفندق',
  'nav.roomTypes': 'أنواع الغرف',
  'nav.services': 'الخدمات',
  'nav.prices': 'الأسعار',

  'panel.admin': 'لوحة مدير الوكالة',
  'panel.staff': 'لوحة موظف الوكالة',
  'panel.hotel': 'لوحة الفندق',

  'shell.tagline': 'مركز وكالة الفنادق',
  'shell.logout': 'تسجيل الخروج',

  'common.save': 'حفظ',
  'common.saving': 'جارٍ الحفظ…',
  'common.cancel': 'إلغاء',
  'common.edit': 'تعديل',
  'common.delete': 'حذف',
  'common.add': 'إضافة',
  'common.loading': 'جارٍ التحميل…',
  'common.loadError': 'تعذّر تحميل البيانات.',

  'login.subtitle': 'سجّل الدخول إلى حسابك',
  'login.email': 'البريد الإلكتروني',
  'login.password': 'كلمة المرور',
  'login.submit': 'تسجيل الدخول',
  'login.submitting': 'جارٍ تسجيل الدخول…',
  'login.error': 'فشل تسجيل الدخول.',
  'login.footer': 'تسجيل فندق جديد؟',
  'login.haveAccount': 'لديك حساب بالفعل؟',
  'login.register': 'إنشاء حساب',

  'register.subtitle': 'تسجيل فندق جديد',
  'register.name': 'اسم الفندق',
  'register.contactPerson': 'شخص الاتصال',
  'register.email': 'البريد الإلكتروني',
  'register.password': 'كلمة المرور (8 أحرف على الأقل)',
  'register.phone': 'الهاتف',
  'register.address': 'العنوان',
  'register.city': 'المدينة',
  'register.country': 'الدولة',
  'register.description': 'الوصف',
  'register.descriptionPlaceholder': 'معلومات مختصرة عن الفندق…',
  'register.submit': 'تسجيل الفندق',
  'register.submitting': 'جارٍ الحفظ…',
  'register.error': 'حدث خطأ.',
  'register.doneTitle': 'تم استلام الطلب',
  'register.doneBody':
    'تم استلام طلب فندقك الخاص بـ {name}. يقوم فريق الوكالة بمراجعته؛ وسيتم إبلاغ النتيجة عبر البريد إلى {email}.',
  'register.doneFooterPre': 'بعد الموافقة يمكنك',
  'register.doneFooterLink': 'تسجيل الدخول بكلمة المرور التي اخترتها',

  'gate.pendingTitle': 'الطلب قيد المراجعة',
  'gate.pendingBody':
    'يقوم فريق الوكالة بمراجعة تسجيل فندقك. بعد الموافقة سيُفتح الوصول إلى اللوحة وسيتم إبلاغك عبر البريد الإلكتروني.',
  'gate.rejectedTitle': 'تم رفض الطلب',
  'gate.rejectedBody':
    'رفضت الوكالة طلب فندقك. للحصول على تفاصيل، يرجى التواصل مع الوكالة.',

  'landing.loginCta': 'دخول الموظفين',
  'landing.heroTitle1': 'عطلتك القادمة',
  'landing.heroTitle2': 'على بُعد طلب واحد',
  'landing.heroLede':
    'اختر من بين {count} فندق ودع فريقنا يتولى الباقي. تأكيد التوفر والسعر خلال 24 ساعة، دون دفع مسبق.',
  'landing.heroLedeNoCount':
    'اختر من بين آلاف الفنادق ودع فريقنا يتولى الباقي. تأكيد التوفر والسعر خلال 24 ساعة، دون دفع مسبق.',
  'landing.searchTitle': 'ابحث عن الفنادق',
  'landing.fieldHotel': 'الفندق',
  'landing.fieldCheckIn': 'الوصول',
  'landing.fieldCheckOut': 'المغادرة',
  'landing.fieldGuests': 'الضيوف',
  'landing.searchPlaceholder': 'اسم الفندق أو المدينة…',
  'landing.loadingHotels': 'جارٍ تحميل الفنادق…',
  'landing.catalogError': 'تعذّر تحميل الدليل.',
  'landing.estimate': 'المبلغ التقديري',
  'landing.estimateNote': '{nights} ليالٍ · تقديري، يُحسم عند التأكيد',
  'landing.continue': 'متابعة',
  'landing.contactTitle': 'بيانات التواصل الخاصة بك',
  'landing.name': 'الاسم الكامل',
  'landing.email': 'البريد الإلكتروني',
  'landing.phone': 'الهاتف',
  'landing.note': 'ملاحظة (اختياري)',
  'landing.notePlaceholder': 'تفضيل الغرفة، طلبات خاصة…',
  'landing.submit': 'إرسال الطلب',
  'landing.submitting': 'جارٍ الإرسال…',
  'landing.backToSearch': 'البحث →',
  'landing.errorSubmit': 'تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى.',
  'landing.doneTitle': 'تم استلام طلبك',
  'landing.doneRef': 'رقم المرجع',
  'landing.doneNote':
    '{hotel} — {city}، {country}. {checkIn} / {checkOut}، {guests} ضيوف. سنرسل لك تأكيدًا عبر البريد الإلكتروني.',
  'landing.newRequest': 'إنشاء طلب جديد',
  'landing.destTitle': 'الوجهات الشائعة',
  'landing.fromPrice': 'من {price} {currency}',
  'landing.trustHeading': 'لماذا وكالة؟',
  'landing.trustLede':
    'نقارن مئات الفنادق نيابةً عنك، ونتفاوض على السعر، ونتابع الحجز من البداية إلى النهاية. كل ما عليك هو إخبارنا إلى أين تريد الذهاب.',
  'landing.trust1Title': 'دون دفع مسبق',
  'landing.trust1Body': 'تدفع في الفندق. نحن نرتب التوفر وأفضل سعر.',
  'landing.trust2Title': 'رد خلال 24 ساعة',
  'landing.trust2Body': 'يصل طلبك إلى مستشار ويُجاب في نفس يوم العمل.',
  'landing.trust3Title': 'آلاف الفنادق',
  'landing.trust3Body': 'من فنادق وسط المدينة إلى منتجعات الشاطئ، خيارات من جميع أنحاء العالم.',
  'landing.bandTitle': 'لم تجد الفندق الذي تبحث عنه؟',
  'landing.bandBody': 'أخبرنا بالفندق أو المنطقة التي تفكّر فيها وسيبحث عنها مستشارونا من أجلك.',
  'landing.bandCta': 'إنشاء طلب',

  'footer.blurb':
    'وكالة سفر مستقلة بين المسافرين وشبكة فنادق. نتحقق من التوفر، ونتفاوض على السعر، ونتابع الحجز من البداية إلى النهاية.',
  'footer.corporate': 'الشركة',
  'footer.legal': 'قانوني',
  'footer.contact': 'تواصل معنا',
  'footer.about': 'من نحن',
  'footer.contactPage': 'اتصل بنا',
  'footer.faq': 'الأسئلة الشائعة',
  'footer.privacy': 'سياسة الخصوصية',
  'footer.terms': 'شروط الاستخدام',
  'footer.hours': 'أيام الأسبوع 09:00 – 18:00',
  'footer.rights': '© {year}',
  'footer.staffLogin': 'دخول الموظفين',

  'about.title': 'من نحن',
  'about.lead': 'Cassidy Travel وكالة سفر مستقلة بين المسافرين وشبكة فنادق.',
  'about.h1': 'ماذا نفعل',
  'about.p1':
    'نجمع آلاف الفنادق من جميع أنحاء العالم في مكان واحد. أنت تخبرنا إلى أين تريد الذهاب؛ ونحن نتحقق من التوفر، ونتفاوض على السعر مع الفندق، ونتابع الحجز حتى اكتماله. الفرق أننا لسنا محرك بحث، بل فريق ينجز العمل نيابةً عنك.',
  'about.h2': 'كيف يعمل',
  'about.step1':
    'من خلال البحث في الصفحة الرئيسية تختار فندقك وتواريخك وعدد الضيوف وتنشئ طلبًا.',
  'about.step2': 'يصل طلبك إلى مستشار. نؤكد التوفر والسعر الحالي مع الفندق.',
  'about.step3':
    'نرد في نفس يوم العمل، وبعد موافقتك نُتمّ الحجز. يتم الدفع عادةً في الفندق.',
  'about.h3': 'لماذا تتعامل مع وكالة',
  'about.b1': 'نقارن مئات الفنادق نيابةً عنك ونبرز الخيار الأفضل.',
  'about.b2': 'نتفاوض على السعر والشروط مع الفندق؛ ولا نطلب دفعًا مسبقًا.',
  'about.b3': 'إذا حدث خطأ ما، يكون لديك فريق واحد للتعامل معه.',
  'about.closing': 'للاستفسارات، اطّلع على صفحة الاتصال أو أنشئ طلبًا مباشرةً من بحث الفنادق.',

  'contact.title': 'اتصل بنا',
  'contact.lead':
    'تُستلَم طلبات الحجز من خلال البحث في الصفحة الرئيسية. لأي أمر آخر، تواصل معنا أدناه.',
  'contact.office': 'المكتب',
  'contact.direct': 'مباشر',
  'contact.phone': 'الهاتف',
  'contact.emailLabel': 'البريد الإلكتروني',
  'contact.reserveHeading': 'هل تريد إجراء حجز؟',
  'contact.reserveBody':
    'اختر الفندق والتواريخ وعدد الضيوف من بحث الفنادق وأنشئ طلبًا؛ سيرد مستشارونا خلال 24 ساعة بالتوفر والسعر.',
  'contact.goSearch': 'الانتقال إلى بحث الفنادق',

  'faq.title': 'الأسئلة الشائعة',
  'faq.lead': 'أكثر الأسئلة شيوعًا حول الطلب والدفع وعملية الحجز.',
  'faq.noAnswer': 'لم تجد الإجابة التي تبحث عنها؟',
  'faq.writeUs': 'راسلنا.',
  'faq.q1': 'متى أدفع؟',
  'faq.a1':
    'عادةً في الفندق أثناء إقامتك. لا نطلب دفعًا مسبقًا عند إنشاء الطلب؛ وإذا اشترط عرض خاص الدفع للفندق مقدمًا، فإننا نوضح ذلك بجلاء في رسالة التأكيد.',
  'faq.q2': 'كم يستغرق الرد؟',
  'faq.a2':
    'في نفس يوم العمل، وخلال 24 ساعة كحد أقصى. يرد المستشار عبر البريد بعد تأكيد التوفر والسعر الحالي مع الفندق.',
  'faq.q3': 'هل إنشاء طلب يُلزمني؟',
  'faq.a3':
    'لا. الطلب مجرد استفسار. يصبح الحجز نهائيًا بعد موافقتك على الشروط في رسالة التأكيد.',
  'faq.q4': 'لماذا تظهر الأسعار على أنها «تقديرية»؟',
  'faq.a4':
    'المبالغ الليلية على الموقع أسعار بداية تقريبية محسوبة حسب نوع الفندق والمنطقة. يتحدد السعر الدقيق عند تأكيد الفندق له لتواريخك ونوع غرفتك.',
  'faq.q5': 'ماذا أفعل إذا لم يكن الفندق الذي أريده في القائمة؟',
  'faq.a5':
    'اكتب الفندق أو المنطقة التي تفكّر فيها في حقل «إنشاء طلب» في الصفحة الرئيسية؛ وسيبحث مستشارونا ويقدّمون خيارات.',
  'faq.q6': 'هل يمكنني إلغاء الحجز؟',
  'faq.a6':
    'تخضع الحجوزات المؤكدة لشروط إلغاء الفندق، وهي مدرجة في رسالة التأكيد. يكفي أن ترسل لنا طلب الإلغاء، ونتولى العملية نيابةً عنك.',
  'faq.q7': 'ماذا يحدث لبياناتي الشخصية؟',
  'faq.a7':
    'نجمع فقط المعلومات اللازمة لمعالجة طلبك (الاسم، البريد، الهاتف، التواريخ، الفندق) ونشاركها مع الفندق المعني. راجع صفحة سياسة الخصوصية للتفاصيل.',

  'privacy.title': 'سياسة الخصوصية',
  'privacy.lead':
    'توضح هذه الصفحة كيف تعالج Cassidy Travel البيانات الشخصية في سياق طلبات الحجز.',
  'privacy.h1': 'ما البيانات التي نجمعها',
  'privacy.p1':
    'من نموذج الطلب في الصفحة الرئيسية نأخذ فقط: الاسم الكامل، وعنوان البريد الإلكتروني، ورقم الهاتف، والفندق والوجهة اللذين تختارهما، وتواريخ الوصول/المغادرة، وعدد الضيوف، وملاحظتك إن وُجدت.',
  'privacy.h2': 'فيمَ نستخدمها',
  'privacy.p2':
    'نستخدم البيانات لتقييم طلبك والتواصل مع الفندق المعني لتأكيد التوفر والسعر، وللرد عليك وإدارة عملية الحجز، وللوفاء بالتزاماتنا القانونية.',
  'privacy.h3': 'مع من نشاركها',
  'privacy.p3':
    'تُشارَك بياناتك فقط مع الفندق المعني بطلبك ومع مزوّدي الخدمات اللازمين لإتمام الحجز. ولا تُباع أو تُنقل إلى أطراف ثالثة لأغراض التسويق.',
  'privacy.h4': 'مدة الاحتفاظ',
  'privacy.p4':
    'تُحفظ سجلات الطلبات لمدة محاسبية ونزاعية معقولة بعد اكتمال العملية، ثم تُحذف أو تُجعل مجهولة الهوية.',
  'privacy.h5': 'حقوقك',
  'privacy.p5':
    'لك الحق في الوصول إلى بياناتك أو تصحيحها أو طلب حذفها. يمكنك إرسال هذه الطلبات إلى {email}.',

  'terms.title': 'شروط الاستخدام',
  'terms.lead':
    'تنطبق الشروط التالية عند استخدام موقع Cassidy Travel وخدمة الطلبات.',
  'terms.h1': 'دور الوكالة',
  'terms.p1':
    'لا تقدّم Cassidy Travel الإقامة بنفسها؛ فهي وكالة سفر وسيطة بين المسافر والفندق. يُبرَم عقد الإقامة بينك وبين الفندق.',
  'terms.h2': 'الأسعار',
  'terms.p2':
    'المبالغ الليلية المعروضة على الموقع تقديرية ولا تشكّل عرضًا مُلزِمًا. يُبلَّغ السعر الدقيق مع التأكيد المُستلَم من الفندق لتواريخك ونوع غرفتك.',
  'terms.h3': 'الطلب والحجز',
  'terms.p3':
    'إنشاء طلب وحده لا يُعدّ حجزًا. يصبح الحجز نهائيًا عند موافقتك على الشروط في رسالة التأكيد التي نرسلها. يتم الدفع في الفندق أثناء الإقامة ما لم يُذكر خلاف ذلك.',
  'terms.h4': 'الإلغاء والتغييرات',
  'terms.p4':
    'تخضع حقوق الإلغاء والتغيير للحجوزات المؤكدة لشروط الفندق المعني وهي مدرجة في رسالة التأكيد. عند إرسالك طلب الإلغاء إلينا، نتولى العملية نيابةً عنك.',
  'terms.h5': 'المسؤولية',
  'terms.p5':
    'الفندق مسؤول عن طبيعة الخدمة التي يقدّمها. تبذل Cassidy Travel عناية معقولة للحفاظ على دقة المعلومات وحداثتها؛ ولا يمكن تحميلها مسؤولية التغييرات أو الأعطال الصادرة عن الفندق.',
  'terms.h6': 'التغييرات',
  'terms.p6': 'قد تُحدَّث هذه الشروط من حين لآخر. تُنشَر النسخة الحالية دائمًا على هذه الصفحة.',

  'legal.contactPrompt': 'للاستفسارات، يمكنك مراسلتنا عبر صفحة الاتصال.',
}

export const DICT: Record<Lang, Dict> = { tr, en, ru, de, es, ar }
