import Link from "next/link"
import { Phone, Mail, MapPin, ChevronDown, Search, MessageCircle } from "lucide-react"
import { LogoFull } from "@/components/brand/LogoFull"
import { Footer } from "@/components/shared/Footer"
import { Button } from "@/components/ui/button"
import { SearchSwitch } from "@/components/landing/SearchSwitch"
import { PhoneMockup } from "@/components/landing/PhoneMockup"
import { BadgeIcon } from "@/components/brand/BadgeIcon"
import { ItemCard } from "@/components/feed/ItemCard"
import { FEATURED_BADGES, BADGE_META } from "@/lib/badges"
import { createClient } from "@/lib/supabase/server"
import type { Item } from "@/lib/types"

export const revalidate = 60

async function getRecentItems(): Promise<Item[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("items")
      .select("*, profiles(*)")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(8)
    return (data as Item[]) ?? []
  } catch {
    return []
  }
}

const STATS = [
  { value: "%85", label: "Lokasyon Doğruluk Oranı" },
  { value: "%57", label: "Azalan Güvenlik Kaygısı" },
  { value: "120+", label: "Gönüllü Bulucu" },
  { value: "10,000+", label: "e-Devlet Onaylı Gönüllü Bulucu" },
]

const HOW_IT_WORKS = [
  {
    icon: <Search className="h-7 w-7" />,
    step: "01",
    title: "İlan Ver",
    desc: "Kaybettiğin veya bulduğun eşyayı konum bilgisiyle birlikte birkaç saniyede paylaş.",
  },
  {
    icon: <MapPin className="h-7 w-7" />,
    step: "02",
    title: "Eşleştir",
    desc: "Yapay zeka konum, kategori ve tarihe göre otomatik eşleşme önerir. Sen de haritadan arayabilirsin.",
  },
  {
    icon: <MessageCircle className="h-7 w-7" />,
    step: "03",
    title: "Bul",
    desc: "Güvenli mesajlaş, buluşma sağla ve eşyanı geri al. Her başarılı kavuşturma sana puan kazandırır.",
  },
]

export default async function LandingPage() {
  const recentItems = await getRecentItems()

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top utility bar */}
      <div className="hidden bg-[#042720] text-white/80 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[#32E1BE]" /> +90 850 000 00 00
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#32E1BE]" /> dayanisma@bulalim.org
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#32E1BE]" /> İstanbul, TR
              <ChevronDown className="h-3 w-3" />
            </span>
            <span className="flex items-center gap-1.5">TR <ChevronDown className="h-3 w-3" /></span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-50 border-b border-[#E8EDEB] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <LogoFull size="md" />
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#073A30] lg:flex">
            <Link href="/" className="text-[#32E1BE]">Ana Sayfa</Link>
            <Link href="/map" className="transition-colors hover:text-[#32E1BE]">Harita</Link>
            <a href="#how-it-works" className="transition-colors hover:text-[#32E1BE]">Nasıl Çalışır?</a>
            <a href="#about" className="transition-colors hover:text-[#32E1BE]">Hakkımızda</a>
            <a href="#search">
              <span className="rounded-full bg-[#32E1BE] px-5 py-1.5 font-bold text-[#073A30]">BUL</span>
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/sign-in" className="hidden sm:block">
              <Button variant="outline" size="sm" className="rounded-full border-[#073A30] text-[#073A30] hover:bg-[#073A30] hover:text-white">
                Giriş Yap (e-Devlet ile)
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="rounded-full bg-[#FF8A4C] font-semibold text-white hover:bg-[#f5793a]">
                Topluluğa Katıl
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — canlı şehir banner'ı: solda illüstrasyon, ortada switch, sağda telefon */}
      <section id="search" className="relative overflow-hidden bg-[#cfeee6]">
        {/* Tam genişlik şehir illüstrasyonu */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-city.png')" }}
          aria-hidden="true"
        />
        {/* Metin okunabilirliği için üstte yumuşak scrim */}
        <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-white/90 via-white/45 to-transparent" aria-hidden="true" />

        {/* Sağ: telefon mockup (yalnızca geniş ekranda) */}
        <div className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 lg:block xl:right-10">
          <PhoneMockup className="scale-90 xl:scale-100" />
        </div>

        {/* Orta: başlık + arama kartı */}
        <div className="relative mx-auto flex min-h-[560px] max-w-3xl flex-col items-center px-4 pb-20 pt-12 text-center">
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-[#073A30] md:text-5xl lg:text-[3.3rem]">
            Şehrin Dayanışma Ağı:{" "}
            <span className="text-[#1FC4A2]">Kaybetme, Bulalım!</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm font-semibold text-[#0F5547] md:text-base">
            Yapay zeka destekli, lokasyon bazlı ve güvenli kayıp eşya eşleştirme platformu.
          </p>
          <div className="mt-8 flex w-full justify-center">
            <SearchSwitch />
          </div>
        </div>
      </section>

      {/* Stats — mockup'taki açık yeşil bant */}
      <section className="border-y border-[#cfeadf] bg-[#dcf1e9]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-4 py-7 md:grid-cols-4 md:gap-y-0">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-3 text-center ${i > 0 ? "md:border-l md:border-[#bbe3d4]" : ""}`}
            >
              <div className="text-2xl font-extrabold text-[#073A30] md:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs leading-tight text-[#4f6b62] md:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent reports + Haftanın Kahramanları */}
      <section className="bg-[#F7F9F8] py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-[#073A30]">Son İlanlar</h2>
            {recentItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {recentItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#E8EDEB] bg-white p-12 text-center text-[#6B7773]">
                Henüz ilan yok. İlk ilanı sen ver!
              </div>
            )}
          </div>

          {/* Haftanın Kahramanları */}
          <aside className="h-fit rounded-2xl border border-[#E8EDEB] bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-bold text-[#073A30]">Haftanın Kahramanları</h3>
            <div className="grid grid-cols-3 gap-3">
              {FEATURED_BADGES.map((badge) => (
                <div key={badge} className="flex flex-col items-center gap-2 text-center">
                  <BadgeIcon badge={badge} size={64} />
                  <span className="text-xs font-semibold text-[#073A30]">{BADGE_META[badge].label}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-[#6B7773]">
              Eşya buldukça puan kazan, rozetleri topla ve toplulukta öne çık. Rozetlerin profilinde sergilenir.
            </p>
            <Link href="/sign-up">
              <Button className="mt-4 w-full rounded-xl bg-[#32E1BE] font-semibold text-[#073A30] hover:bg-[#1FC4A2]">
                Sen de Katıl
              </Button>
            </Link>
          </aside>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#073A30]">Nasıl Çalışır?</h2>
            <p className="mx-auto max-w-xl text-[#6B7773]">
              Üç basit adımda eşyanı bul veya bulduğun eşyayı sahibiyle buluştur.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="rounded-2xl border border-[#E8EDEB] bg-[#F7F9F8] p-8 text-center transition-shadow hover:shadow-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#073A30] text-[#32E1BE]">
                  {item.icon}
                </div>
                <div className="mb-2 text-sm font-bold text-[#32E1BE]">{item.step}</div>
                <h3 className="mb-3 text-xl font-bold text-[#073A30]">{item.title}</h3>
                <p className="leading-relaxed text-[#6B7773]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Trust */}
      <section id="about" className="bg-[#073A30] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-white">Güvenli Topluluk, Gerçek Dayanışma</h2>
          <p className="mb-8 text-lg leading-relaxed text-white/70">
            Bulalım, e-Devlet (TC Kimlik) doğrulamasıyla güvenli bir topluluk oluşturur. Yapay zeka destekli
            eşleştirme, harita tabanlı arama ve güvenli mesajlaşma ile kaybettiğin eşyaya en hızlı yoldan ulaşırsın.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="rounded-full bg-[#32E1BE] px-10 text-base font-bold text-[#073A30] hover:bg-[#1FC4A2]">
              Ücretsiz Kaydol
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
