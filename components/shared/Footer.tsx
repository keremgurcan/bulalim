import Link from "next/link"
import { LogoFull } from "@/components/brand/LogoFull"

export function Footer() {
  return (
    <footer className="bg-[#073A30] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <LogoFull variant="light" size="md" />
            <p className="mt-3 text-sm text-[#5FEACB] leading-relaxed">
              Kaybetmek son değil, başlangıçtır.
              <br />
              Topluluk gücüyle eşyaları kavuşturuyoruz.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#32E1BE]">Platform</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/feed" className="hover:text-[#32E1BE] transition-colors">İlanlar</Link></li>
              <li><Link href="/map" className="hover:text-[#32E1BE] transition-colors">Harita</Link></li>
              <li><Link href="/sign-up" className="hover:text-[#32E1BE] transition-colors">Kayıt Ol</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#32E1BE]">Hukuki</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/about" className="hover:text-[#32E1BE] transition-colors">Hakkında</Link></li>
              <li><Link href="/privacy" className="hover:text-[#32E1BE] transition-colors">Gizlilik</Link></li>
              <li><Link href="/kvkk" className="hover:text-[#32E1BE] transition-colors">KVKK</Link></li>
              <li><Link href="/contact" className="hover:text-[#32E1BE] transition-colors">İletişim</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © 2025 Bulalım. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4 text-sm text-white/50">
            <span>🇹🇷 Türkçe</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
