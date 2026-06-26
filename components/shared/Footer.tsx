import Link from "next/link"
import { LogoFull } from "@/components/brand/LogoFull"
import { dictionaries, type Locale } from "@/lib/i18n"

interface FooterProps {
  lang?: Locale
}

export function Footer({ lang = "tr" }: FooterProps) {
  const t = dictionaries[lang].footer
  return (
    <footer className="bg-[#073A30] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <LogoFull variant="light" size="xl" />
            <p className="mt-3 text-sm text-[#5FEACB] leading-relaxed">{t.tagline}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#32E1BE]">{t.platform}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/feed" className="hover:text-[#32E1BE] transition-colors">{t.links.feed}</Link></li>
              <li><Link href="/map" className="hover:text-[#32E1BE] transition-colors">{t.links.map}</Link></li>
              <li><Link href="/sign-up" className="hover:text-[#32E1BE] transition-colors">{t.links.signUp}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#32E1BE]">{t.legal}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/about" className="hover:text-[#32E1BE] transition-colors">{t.links.about}</Link></li>
              <li><Link href="/privacy" className="hover:text-[#32E1BE] transition-colors">{t.links.privacy}</Link></li>
              <li><Link href="/kvkk" className="hover:text-[#32E1BE] transition-colors">{t.links.kvkk}</Link></li>
              <li><a href="mailto:destek.bulalim@outlook.com" className="hover:text-[#32E1BE] transition-colors">{t.links.contact}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">{t.rights}</p>
          <div className="flex gap-4 text-sm text-white/50">
            <span>{lang === "en" ? "🇬🇧 English" : "🇹🇷 Türkçe"}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
