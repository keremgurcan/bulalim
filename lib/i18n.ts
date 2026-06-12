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
    }
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
      },
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
      },
    },
  },
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
