"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/shared/LanguageToggle"
import { dictionaries, type Locale } from "@/lib/i18n"

/**
 * Landing için mobil hamburger menü (lg altında). Nav linkleri + giriş/kayıt + dil.
 * Masaüstünde gizli (lg:hidden). Panel header'ın hemen altına açılır.
 */
export function MobileNav({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false)
  const t = dictionaries[locale].nav
  const close = () => setOpen(false)

  const linkCls = "rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#10303a] transition-colors hover:bg-[#F7F9F8]"

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menü"
        aria-expanded={open}
        className="rounded-lg p-2 text-[#10303a] transition-colors hover:bg-[#F7F9F8]"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-[#E8EDEB] bg-white px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            <Link href="/" onClick={close} className={linkCls}>{t.home}</Link>
            <Link href="/map" onClick={close} className={linkCls}>{t.map}</Link>
            <a href="#how-it-works" onClick={close} className={linkCls}>{t.how}</a>
            <a href="#about" onClick={close} className={linkCls}>{t.about}</a>
            <a href="#search" onClick={close} className={linkCls}>{t.bul}</a>
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-[#E8EDEB] pt-3">
            <Link href="/sign-in" onClick={close}>
              <Button variant="outline" className="w-full rounded-full border-[#10303a] text-[#10303a] hover:bg-[#10303a] hover:text-white">
                {t.signIn}
              </Button>
            </Link>
            <Link href="/sign-up" onClick={close}>
              <Button className="w-full rounded-full bg-[#FF8A4C] font-semibold text-white hover:bg-[#f5793a]">
                {t.join}
              </Button>
            </Link>
            <div className="pt-1">
              <LanguageToggle locale={locale} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
