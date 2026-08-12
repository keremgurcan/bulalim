import Link from "next/link"
import { cookies } from "next/headers"
import { LogoFull } from "@/components/brand/LogoFull"
import { Footer } from "@/components/shared/Footer"
import { Button } from "@/components/ui/button"
import { getDictionary, normalizeLocale } from "@/lib/i18n"
import { Search, Users, MessageCircle, ShieldCheck } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("locale")?.value)
  const t = getDictionary(locale)
  const isEn = locale === "en"

  const features = isEn
    ? [
        { icon: Search, title: "Smart matching", desc: "Lost & found listings are matched by name, color, type and distance criteria." },
        { icon: Users, title: "Profiles & friends", desc: "Visit user profiles and add friends within a trusted community." },
        { icon: MessageCircle, title: "Secure messaging", desc: "Get in touch about your belongings through location-verified chat." },
        { icon: ShieldCheck, title: "Verified identity", desc: "All actions run on e-Devlet (Turkish ID) verified accounts." },
      ]
    : [
        { icon: Search, title: "Akıllı eşleşme", desc: "Kayıp ve buluntu ilanları isim, renk, tür ve mesafe kriterleriyle eşleştirilir." },
        { icon: Users, title: "Profil & arkadaşlık", desc: "Kullanıcı profillerini ziyaret edip güvenli toplulukta arkadaş ekleyebilirsin." },
        { icon: MessageCircle, title: "Güvenli mesajlaşma", desc: "Eşyaların için konum doğrulamalı sohbet üzerinden iletişim kurarsın." },
        { icon: ShieldCheck, title: "Doğrulanmış kimlik", desc: "Tüm işlemler e-Devlet (TC Kimlik) doğrulamalı hesaplarla yürür." },
      ]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-[#E8EDEB] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/">
            <LogoFull size="md" />
          </Link>
          <Link href="/" className="text-sm text-[#6B7773] transition-colors hover:text-[#073A30]">
            ← {isEn ? "Home" : "Ana Sayfa"}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-[#073A30] px-4 py-16 text-center text-white">
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold sm:text-4xl">{t.about.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {t.about.desc}
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-[#E8EDEB] bg-white p-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#073A30] text-[#32E1BE]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[#073A30]">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6B7773]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/sign-up">
              <Button className="rounded-full bg-[#32E1BE] px-10 py-6 text-base font-bold text-[#073A30] hover:bg-[#1FC4A2]">
                {t.about.cta}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer lang={locale} />
    </div>
  )
}
