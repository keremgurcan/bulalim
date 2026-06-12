import type { ItemCategory } from "./types"

export type Locale = "tr" | "en"

export const DEFAULT_LOCALE: Locale = "tr"

export function normalizeLocale(value: string | undefined | null): Locale {
  return value === "en" ? "en" : "tr"
}

interface Dictionary {
  nav: {
    home: string
    map: string
    how: string
    about: string
    bul: string
    signIn: string
    join: string
  }
  hero: { title1: string; title2: string; subtitle: string }
  search: {
    lost: string
    found: string
    categories: { electronics: string; wallet_card: string; keys: string; documents: string; other: string }
    locationPlaceholder: string
    submit: string
  }
  stats: string[]
  recent: { title: string; empty: string }
  heroes: { title: string; note: string; cta: string }
  how: { title: string; subtitle: string; steps: Array<{ title: string; desc: string }> }
  about: { title: string; desc: string; cta: string }
  footer: {
    tagline: string
    platform: string
    legal: string
    links: { feed: string; map: string; signUp: string; about: string; privacy: string; kvkk: string; contact: string }
    rights: string
  }
  language: string
  app: {
    nav: {
      listings: string
      map: string
      post: string
      profile: string
      messages: string
      settings: string
      signOut: string
      signIn: string
      signUp: string
    }
    feed: {
      title: string
      subtitle: string
      mapView: string
      all: string
      lost: string
      found: string
      categoryPh: string
      allCategories: string
      cityPh: string
      allCities: string
      nearby: string
      clearFilters: string
      notFound: string
      notFoundDesc: string
      postFirst: string
      fab: string
    }
  }
  categories: Record<ItemCategory, string>
  ranks: Record<string, string>
  item: { lost: string; found: string; justNow: string; hoursAgo: string; daysAgo: string }
  map: {
    searchPlaceholder: string
    type: string
    categoryFilters: string
    radius: string
    all: string
    locateMe: string
    located: string
    dateRange: string
    results: string
  }
  settings: {
    title: string
    account: string
    phone: string
    fullName: string
    city: string
    cityPlaceholder: string
    about: string
    aboutPlaceholder: string
    save: string
    saving: string
    saved: string
    saveError: string
    privacy: string
    profileVisibility: string
    profileVisibilityDesc: string
    accountActions: string
    signOut: string
    deleteAccount: string
    deleteConfirm: string
    cancel: string
    yesDelete: string
    accountDeleted: string
    loading: string
  }
  profile: {
    edit: string
    statListings: string
    statReunions: string
    statPoints: string
    statBadges: string
    pointsToNext: string
    maxLevel: string
    edevletTitle: string
    verificationStatus: string
    verified: string
    pending: string
    idNote: string
    trustScore: string
    delivery: string
    rating: string
    badgeShowcase: string
    earnedOf: string
    activeTab: string
    historyTab: string
    noActive: string
    postListing: string
  }
  auth: {
    noAccount: string
    signUp: string
    secureTitle: string
    secureDesc: string
    lostIntent: string
    foundIntent: string
    continueNote: string
    phoneTitle: string
    phoneDesc: string
    phoneLabel: string
    sendCode: string
    sendingCode: string
    demoMode: string
    smsTitle: string
    smsSentTo: string
    verify: string
    back: string
    tooManyAttempts: string
    attemptsLeft: string
    tcTitle: string
    tcDesc: string
    tcDemo: string
    tcLabel: string
    tcPlaceholder: string
    tcNote: string
    tcVerify: string
    tcVerifying: string
    steps: string[]
    alreadyMember: string
    welcomeBack: string
    signupError: string
    phoneTaken: string
    welcomeCreated: string
    usernameTaken: string
    profileErrorPrefix: string
    profileTitle: string
    profileDesc: string
    fullNameLabel: string
    fullNamePlaceholder: string
    usernameLabel: string
    usernamePlaceholder: string
    cityLabel: string
    cityPlaceholder: string
    bioLabel: string
    bioPlaceholder: string
    createProfile: string
    creating: string
  }
  newItem: {
    pickTitle: string
    pickSubtitle: string
    lostCardTitle: string
    lostCardDesc: string
    lostPoints: string
    foundCardTitle: string
    foundCardDesc: string
    foundPoints: string
    lostHeader: string
    foundHeader: string
    formSubtitle: string
    photos: string
    addPhoto: string
    title: string
    titlePlaceholder: string
    description: string
    descriptionPlaceholder: string
    category: string
    select: string
    dateLost: string
    dateFound: string
    city: string
    selectCity: string
    location: string
    pickLocation: string
    publishing: string
    publish: string
    errType: string
    errLocation: string
    errLogin: string
    errCreate: string
    successPublished: string
    matchFound: string
  }
  chat: {
    title: string
    openChats: string
    back: string
    close: string
    noMatches: string
    noMatchesDesc: string
    chatStarted: string
    safetyNote: string
    inputPlaceholder: string
    sendError: string
    viewProfile: string
    now: string
    lost: string
    found: string
  }
}

export const dictionaries: Record<Locale, Dictionary> = {
  tr: {
    nav: {
      home: "Ana Sayfa",
      map: "Harita",
      how: "Nasıl Çalışır?",
      about: "Hakkımızda",
      bul: "BUL",
      signIn: "Giriş Yap (e-Devlet ile)",
      join: "Topluluğa Katıl",
    },
    hero: {
      title1: "Şehrin Dayanışma Ağı:",
      title2: "Kaybetme, Bulalım!",
      subtitle: "Yapay zeka destekli, lokasyon bazlı ve güvenli kayıp eşya eşleştirme platformu.",
    },
    search: {
      lost: "Eşyamı Kaybettim",
      found: "Eşya Buldum",
      categories: { electronics: "Elektronik", wallet_card: "Cüzdan/Kart", keys: "Anahtar", documents: "Evrak/Kimlik", other: "Diğer" },
      locationPlaceholder: "İlçe veya Semt Giriniz (Örn: Kadıköy)",
      submit: "Sorgula / Bildir",
    },
    stats: ["Lokasyon Doğruluk Oranı", "Azalan Güvenlik Kaygısı", "Gönüllü Bulucu", "e-Devlet Onaylı Gönüllü Bulucu"],
    recent: { title: "Son İlanlar", empty: "Henüz ilan yok. İlk ilanı sen ver!" },
    heroes: {
      title: "Haftanın Kahramanları",
      note: "Eşya buldukça puan kazan, rozetleri topla ve toplulukta öne çık. Rozetlerin profilinde sergilenir.",
      cta: "Sen de Katıl",
    },
    how: {
      title: "Nasıl Çalışır?",
      subtitle: "Üç basit adımda eşyanı bul veya bulduğun eşyayı sahibiyle buluştur.",
      steps: [
        { title: "İlan Ver", desc: "Kaybettiğin veya bulduğun eşyayı konum bilgisiyle birlikte birkaç saniyede paylaş." },
        { title: "Eşleştir", desc: "Yapay zeka konum, kategori ve tarihe göre otomatik eşleşme önerir. Sen de haritadan arayabilirsin." },
        { title: "Bul", desc: "Güvenli mesajlaş, buluşma sağla ve eşyanı geri al. Her başarılı kavuşturma sana puan kazandırır." },
      ],
    },
    about: {
      title: "Güvenli Topluluk, Gerçek Dayanışma",
      desc: "Bulalım, e-Devlet (TC Kimlik) doğrulamasıyla güvenli bir topluluk oluşturur. Yapay zeka destekli eşleştirme, harita tabanlı arama ve güvenli mesajlaşma ile kaybettiğin eşyaya en hızlı yoldan ulaşırsın.",
      cta: "Ücretsiz Kaydol",
    },
    footer: {
      tagline: "Kaybetmek son değil, başlangıçtır. Topluluk gücüyle eşyaları kavuşturuyoruz.",
      platform: "Platform",
      legal: "Hukuki",
      links: { feed: "İlanlar", map: "Harita", signUp: "Kayıt Ol", about: "Hakkında", privacy: "Gizlilik", kvkk: "KVKK", contact: "İletişim" },
      rights: "© 2025 Bulalım. Tüm hakları saklıdır.",
    },
    language: "Türkçe",
    app: {
      nav: {
        listings: "İlanlar",
        map: "Harita",
        post: "BUL",
        profile: "Profilim",
        messages: "Mesajlar",
        settings: "Ayarlar",
        signOut: "Çıkış Yap",
        signIn: "Giriş Yap",
        signUp: "Kayıt Ol",
      },
      feed: {
        title: "İlanlar",
        subtitle: "Topluluktan kayıp ve buluntu ilanları",
        mapView: "Haritada Gör",
        all: "Tümü",
        lost: "Kayıp",
        found: "Bulundu",
        categoryPh: "Kategori",
        allCategories: "Tüm Kategoriler",
        cityPh: "Şehir",
        allCities: "Tüm Şehirler",
        nearby: "Yakınımdakiler",
        clearFilters: "Filtreleri Temizle",
        notFound: "İlan bulunamadı",
        notFoundDesc: "Bu kriterlere uygun ilan yok.",
        postFirst: "İlk İlanı Sen Ver",
        fab: "İlan Ver",
      },
    },
    categories: {
      electronics: "Elektronik",
      wallet_card: "Cüzdan / Kart",
      keys: "Anahtar",
      bag_luggage: "Çanta / Bavul",
      jewelry: "Mücevher",
      documents: "Belge",
      clothing: "Giyim",
      other: "Diğer",
    },
    ranks: { "Yeni Üye": "Yeni Üye", "Yardımsever": "Yardımsever", "Dedektif": "Dedektif", "Kahraman": "Kahraman", "Efsane": "Efsane" },
    item: { lost: "Kayıp", found: "Bulundu", justNow: "Az önce", hoursAgo: "{n} saat önce", daysAgo: "{n} gün önce" },
    map: {
      searchPlaceholder: "Eşya veya konum ara...",
      type: "İlan Türü",
      categoryFilters: "Kategori Filtreleri",
      radius: "Arama Yarıçapı",
      all: "Tümü",
      locateMe: "Yakınımı Bul",
      located: "Konumun alındı",
      dateRange: "Tarih Aralığı",
      results: "Sonuçlar",
    },
    settings: {
      title: "Ayarlar",
      account: "Hesap Bilgileri",
      phone: "Telefon",
      fullName: "Ad Soyad",
      city: "Şehir",
      cityPlaceholder: "Şehir seçin",
      about: "Hakkında",
      aboutPlaceholder: "Kendin hakkında...",
      save: "Kaydet",
      saving: "Kaydediliyor...",
      saved: "Profil güncellendi",
      saveError: "Kaydedilemedi",
      privacy: "Gizlilik",
      profileVisibility: "Profil görünürlüğü",
      profileVisibilityDesc: "Profilin arama sonuçlarında görünsün",
      accountActions: "Hesap İşlemleri",
      signOut: "Çıkış Yap",
      deleteAccount: "Hesabı Sil",
      deleteConfirm: "Hesabını silmek istediğine emin misin? Bu işlem geri alınamaz. Tüm ilanların ve mesajların silinecek.",
      cancel: "İptal",
      yesDelete: "Evet, Sil",
      accountDeleted: "Hesabın silindi",
      loading: "Yükleniyor...",
    },
    profile: {
      edit: "Düzenle",
      statListings: "İlan",
      statReunions: "Buluşturma",
      statPoints: "Puan",
      statBadges: "Rozet",
      pointsToNext: "{rank} için {n} puan daha gerekiyor",
      maxLevel: "Maksimum seviyedesin!",
      edevletTitle: "e-Devlet Onaylı Kimlik",
      verificationStatus: "Doğrulama Durumu",
      verified: "%100 Onaylı",
      pending: "Beklemede",
      idNote: "Kimlik bilgileri TC Kimlik doğrulaması ile maskelenmiş şekilde saklanır ve gizli tutulur.",
      trustScore: "Güven Skoru",
      delivery: "Teslimat",
      rating: "Oylama",
      badgeShowcase: "Rozet Vitrini",
      earnedOf: "{n} / 5 kazanıldı",
      activeTab: "Aktif İlanlar",
      historyTab: "Geçmiş",
      noActive: "Aktif ilan yok",
      postListing: "İlan Ver",
    },
    auth: {
      noAccount: "Hesabın yok mu?",
      signUp: "Kayıt Ol",
      secureTitle: "e-Devlet (TC Kimlik) ile Güvenli Giriş",
      secureDesc: "Güvenliğin için tüm işlemler TC kimlik doğrulamalı hesaplarla yapılır.",
      lostIntent: "Eşyamı Kaybettim",
      foundIntent: "Eşya Buldum",
      continueNote: "Devam etmek için e-Devlet ile giriş yap; bilgilerin ilan formuna taşınacak.",
      phoneTitle: "Telefon Numaranı Gir",
      phoneDesc: "SMS kodu göndereceğiz (demo modunda ekranda gösterilecek)",
      phoneLabel: "Telefon Numarası",
      sendCode: "Kod Gönder",
      sendingCode: "Kod Gönderiliyor...",
      demoMode: "Demo modu",
      smsTitle: "SMS Kodu",
      smsSentTo: "{phone} numarasına gönderilen 6 haneli kodu gir",
      verify: "Doğrula",
      back: "Geri Dön",
      tooManyAttempts: "3 yanlış deneme. Lütfen geri dön ve yeni kod iste.",
      attemptsLeft: "Yanlış kod. {n} deneme hakkın kaldı.",
      tcTitle: "TC Kimlik Doğrulama",
      tcDesc: "Güvenli topluluk için kimlik doğrulaması zorunludur",
      tcDemo: "Demo modu — Bu doğrulama sadece TC Kimlik algoritma kontrolü yapar. Gerçek uygulamada NVI servisi entegre edilecektir.",
      tcLabel: "TC Kimlik Numarası",
      tcPlaceholder: "11 haneli TC Kimlik numaranız",
      tcNote: "TC Kimlik numaranız şifrelenmiş olarak saklanır. Ham numara hiçbir zaman kaydedilmez.",
      tcVerify: "Doğrula ve Devam Et",
      tcVerifying: "Doğrulanıyor...",
      steps: ["Telefon", "SMS Kodu", "TC Kimlik", "Profil"],
      alreadyMember: "Zaten üye misin?",
      welcomeBack: "Hoş geldin tekrar!",
      signupError: "Kayıt sırasında bir hata oluştu",
      phoneTaken: "Bu telefon numarası zaten kayıtlı. Giriş yapmayı dene.",
      welcomeCreated: "Hoş geldin! Profilin oluşturuldu.",
      usernameTaken: "Bu kullanıcı adı zaten alınmış, başka bir tane dene",
      profileErrorPrefix: "Profil oluşturulurken hata: ",
      profileTitle: "Profilini Oluştur",
      profileDesc: "Topluluğa katılmak için profilini tamamla",
      fullNameLabel: "Ad Soyad *",
      fullNamePlaceholder: "Adın ve soyadın",
      usernameLabel: "Kullanıcı Adı *",
      usernamePlaceholder: "kullanici_adi",
      cityLabel: "Şehir *",
      cityPlaceholder: "Şehir seçin",
      bioLabel: "Hakkında (isteğe bağlı)",
      bioPlaceholder: "Kendin hakkında kısaca bir şeyler yaz...",
      createProfile: "Profili Oluştur",
      creating: "Oluşturuluyor...",
    },
    newItem: {
      pickTitle: "Nasıl bir ilan vereceksin?",
      pickSubtitle: "Kaybettiğin mi, yoksa bulduğun mu var?",
      lostCardTitle: "Bir şey kaybettim",
      lostCardDesc: "Kayıp ilanı oluştur, topluluk yardımına koşsun",
      lostPoints: "+5 puan",
      foundCardTitle: "Bir şey buldum",
      foundCardDesc: "Buluntu ilanı ver, sahibe kavuştur",
      foundPoints: "+10 puan",
      lostHeader: "😟 Kayıp İlanı",
      foundHeader: "✨ Buluntu İlanı",
      formSubtitle: "Detayları doldur, ilan ver",
      photos: "Fotoğraf (en fazla 3)",
      addPhoto: "Ekle",
      title: "Başlık *",
      titlePlaceholder: "Örn: Siyah deri cüzdan",
      description: "Açıklama *",
      descriptionPlaceholder: "Eşyayı detaylı açıkla: rengi, markası, içindekiler, ayırt edici özellikleri...",
      category: "Kategori *",
      select: "Seçin",
      dateLost: "Kaybolma Tarihi",
      dateFound: "Bulma Tarihi",
      city: "Şehir *",
      selectCity: "Şehir seçin",
      location: "Konum *",
      pickLocation: "Lütfen haritada konum seçin",
      publishing: "İlan Yayınlanıyor...",
      publish: "İlanı Yayınla ✨",
      errType: "İlan türü seçin",
      errLocation: "Konum seçin",
      errLogin: "Giriş yapmanız gerekiyor",
      errCreate: "İlan oluşturulurken hata oluştu",
      successPublished: "İlanın yayınlandı! Topluluk arayışına başlıyor ✨",
      matchFound: "%{n} eşleşme bulundu! Sohbet açılıyor ✨",
    },
    chat: {
      title: "Eşleşmeler & Sohbetler",
      openChats: "Sohbetleri aç",
      back: "Geri",
      close: "Kapat",
      noMatches: "Henüz eşleşmen yok.",
      noMatchesDesc: "Bir ilan verince eşleşen kişiler burada listelenir.",
      chatStarted: "Sohbet başladı",
      safetyNote: "Güvenliğiniz için buluşma noktasını kamuya açık, kalabalık alanlardan seçin.",
      inputPlaceholder: "Mesajını yaz...",
      sendError: "Mesaj gönderilemedi",
      viewProfile: "Profili gör",
      now: "Şimdi",
      lost: "Kayıp",
      found: "Bulundu",
    },
  },
  en: {
    nav: {
      home: "Home",
      map: "Map",
      how: "How It Works?",
      about: "About",
      bul: "FIND",
      signIn: "Sign In (with e-Devlet)",
      join: "Join the Community",
    },
    hero: {
      title1: "The City's Solidarity Network:",
      title2: "Don't Lose It, Let's Find It!",
      subtitle: "AI-powered, location-based and secure lost & found matching platform.",
    },
    search: {
      lost: "I Lost an Item",
      found: "I Found an Item",
      categories: { electronics: "Electronics", wallet_card: "Wallet/Card", keys: "Keys", documents: "Documents/ID", other: "Other" },
      locationPlaceholder: "Enter district or neighborhood (e.g. Kadıköy)",
      submit: "Search / Report",
    },
    stats: ["Location Accuracy Rate", "Reduced Safety Concern", "Volunteer Finders", "e-Devlet Verified Finders"],
    recent: { title: "Recent Listings", empty: "No listings yet. Be the first to post!" },
    heroes: {
      title: "Heroes of the Week",
      note: "Earn points as you find items, collect badges and stand out in the community. Your badges are shown on your profile.",
      cta: "Join Now",
    },
    how: {
      title: "How It Works?",
      subtitle: "Find your item or reunite a found item with its owner in three simple steps.",
      steps: [
        { title: "Post", desc: "Share the item you lost or found with its location in just a few seconds." },
        { title: "Match", desc: "AI suggests automatic matches by location, category and date. You can also search on the map." },
        { title: "Find", desc: "Message securely, arrange a meeting and get your item back. Every successful reunion earns you points." },
      ],
    },
    about: {
      title: "Safe Community, Real Solidarity",
      desc: "Bulalım builds a safe community with e-Devlet (Turkish ID) verification. With AI-powered matching, map-based search and secure messaging, you reach your lost item the fastest way.",
      cta: "Sign Up Free",
    },
    footer: {
      tagline: "Losing isn't the end, it's a beginning. We reunite items with the power of community.",
      platform: "Platform",
      legal: "Legal",
      links: { feed: "Listings", map: "Map", signUp: "Sign Up", about: "About", privacy: "Privacy", kvkk: "Data Policy", contact: "Contact" },
      rights: "© 2025 Bulalım. All rights reserved.",
    },
    language: "English",
    app: {
      nav: {
        listings: "Listings",
        map: "Map",
        post: "FIND",
        profile: "My Profile",
        messages: "Messages",
        settings: "Settings",
        signOut: "Sign Out",
        signIn: "Sign In",
        signUp: "Sign Up",
      },
      feed: {
        title: "Listings",
        subtitle: "Lost & found listings from the community",
        mapView: "View on Map",
        all: "All",
        lost: "Lost",
        found: "Found",
        categoryPh: "Category",
        allCategories: "All Categories",
        cityPh: "City",
        allCities: "All Cities",
        nearby: "Near Me",
        clearFilters: "Clear Filters",
        notFound: "No listings found",
        notFoundDesc: "No listings match these criteria.",
        postFirst: "Be the First to Post",
        fab: "Post",
      },
    },
    categories: {
      electronics: "Electronics",
      wallet_card: "Wallet / Card",
      keys: "Keys",
      bag_luggage: "Bag / Luggage",
      jewelry: "Jewelry",
      documents: "Documents",
      clothing: "Clothing",
      other: "Other",
    },
    ranks: { "Yeni Üye": "New Member", "Yardımsever": "Helper", "Dedektif": "Detective", "Kahraman": "Hero", "Efsane": "Legend" },
    item: { lost: "Lost", found: "Found", justNow: "Just now", hoursAgo: "{n}h ago", daysAgo: "{n}d ago" },
    map: {
      searchPlaceholder: "Search item or location...",
      type: "Listing Type",
      categoryFilters: "Category Filters",
      radius: "Search Radius",
      all: "All",
      locateMe: "Find Near Me",
      located: "Location set",
      dateRange: "Date Range",
      results: "Results",
    },
    settings: {
      title: "Settings",
      account: "Account Info",
      phone: "Phone",
      fullName: "Full Name",
      city: "City",
      cityPlaceholder: "Select a city",
      about: "About",
      aboutPlaceholder: "About you...",
      save: "Save",
      saving: "Saving...",
      saved: "Profile updated",
      saveError: "Could not save",
      privacy: "Privacy",
      profileVisibility: "Profile visibility",
      profileVisibilityDesc: "Show your profile in search results",
      accountActions: "Account Actions",
      signOut: "Sign Out",
      deleteAccount: "Delete Account",
      deleteConfirm: "Are you sure you want to delete your account? This action cannot be undone. All your listings and messages will be deleted.",
      cancel: "Cancel",
      yesDelete: "Yes, Delete",
      accountDeleted: "Your account has been deleted",
      loading: "Loading...",
    },
    profile: {
      edit: "Edit",
      statListings: "Listings",
      statReunions: "Reunions",
      statPoints: "Points",
      statBadges: "Badges",
      pointsToNext: "{n} more points to reach {rank}",
      maxLevel: "You're at the max level!",
      edevletTitle: "e-Devlet Verified Identity",
      verificationStatus: "Verification Status",
      verified: "100% Verified",
      pending: "Pending",
      idNote: "Identity details are stored masked via Turkish ID verification and kept private.",
      trustScore: "Trust Score",
      delivery: "Delivery",
      rating: "Rating",
      badgeShowcase: "Badge Showcase",
      earnedOf: "{n} / 5 earned",
      activeTab: "Active Listings",
      historyTab: "History",
      noActive: "No active listings",
      postListing: "Post a Listing",
    },
    auth: {
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      secureTitle: "Secure Sign-In with e-Devlet (Turkish ID)",
      secureDesc: "For your safety, all actions are done with ID-verified accounts.",
      lostIntent: "I Lost an Item",
      foundIntent: "I Found an Item",
      continueNote: "Sign in with e-Devlet to continue; your details will be carried into the listing form.",
      phoneTitle: "Enter Your Phone Number",
      phoneDesc: "We'll send an SMS code (shown on screen in demo mode)",
      phoneLabel: "Phone Number",
      sendCode: "Send Code",
      sendingCode: "Sending Code...",
      demoMode: "Demo mode",
      smsTitle: "SMS Code",
      smsSentTo: "Enter the 6-digit code sent to {phone}",
      verify: "Verify",
      back: "Go Back",
      tooManyAttempts: "3 wrong attempts. Please go back and request a new code.",
      attemptsLeft: "Wrong code. {n} attempts left.",
      tcTitle: "Turkish ID Verification",
      tcDesc: "Identity verification is required for a safe community",
      tcDemo: "Demo mode — This verification only checks the Turkish ID algorithm. The NVI service will be integrated in the real app.",
      tcLabel: "Turkish ID Number",
      tcPlaceholder: "Your 11-digit Turkish ID number",
      tcNote: "Your Turkish ID number is stored encrypted. The raw number is never saved.",
      tcVerify: "Verify and Continue",
      tcVerifying: "Verifying...",
      steps: ["Phone", "SMS Code", "Turkish ID", "Profile"],
      alreadyMember: "Already a member?",
      welcomeBack: "Welcome back!",
      signupError: "An error occurred during sign-up",
      phoneTaken: "This phone number is already registered. Try signing in.",
      welcomeCreated: "Welcome! Your profile has been created.",
      usernameTaken: "This username is taken, try another one",
      profileErrorPrefix: "Error creating profile: ",
      profileTitle: "Create Your Profile",
      profileDesc: "Complete your profile to join the community",
      fullNameLabel: "Full Name *",
      fullNamePlaceholder: "Your first and last name",
      usernameLabel: "Username *",
      usernamePlaceholder: "username",
      cityLabel: "City *",
      cityPlaceholder: "Select a city",
      bioLabel: "About (optional)",
      bioPlaceholder: "Write a little about yourself...",
      createProfile: "Create Profile",
      creating: "Creating...",
    },
    newItem: {
      pickTitle: "What kind of listing?",
      pickSubtitle: "Did you lose something, or find something?",
      lostCardTitle: "I lost something",
      lostCardDesc: "Create a lost listing, let the community help",
      lostPoints: "+5 points",
      foundCardTitle: "I found something",
      foundCardDesc: "Post a found listing, reunite it with the owner",
      foundPoints: "+10 points",
      lostHeader: "😟 Lost Listing",
      foundHeader: "✨ Found Listing",
      formSubtitle: "Fill in the details and post",
      photos: "Photos (max 3)",
      addPhoto: "Add",
      title: "Title *",
      titlePlaceholder: "e.g. Black leather wallet",
      description: "Description *",
      descriptionPlaceholder: "Describe the item in detail: color, brand, contents, distinguishing features...",
      category: "Category *",
      select: "Select",
      dateLost: "Date Lost",
      dateFound: "Date Found",
      city: "City *",
      selectCity: "Select a city",
      location: "Location *",
      pickLocation: "Please pick a location on the map",
      publishing: "Publishing...",
      publish: "Publish Listing ✨",
      errType: "Select a listing type",
      errLocation: "Select a location",
      errLogin: "You need to sign in",
      errCreate: "An error occurred while creating the listing",
      successPublished: "Your listing is published! The community search begins ✨",
      matchFound: "{n}% match found! Opening chat ✨",
    },
    chat: {
      title: "Matches & Chats",
      openChats: "Open chats",
      back: "Back",
      close: "Close",
      noMatches: "No matches yet.",
      noMatchesDesc: "People you match with will appear here once you post a listing.",
      chatStarted: "Chat started",
      safetyNote: "For your safety, choose a public, crowded place to meet.",
      inputPlaceholder: "Type your message...",
      sendError: "Couldn't send message",
      viewProfile: "View profile",
      now: "Now",
      lost: "Lost",
      found: "Found",
    },
  },
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
