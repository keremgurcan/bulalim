"use client"

import { useEffect, useRef, useState } from "react"
import { Phone, Mail, MapPin, ChevronDown, Languages, Check } from "lucide-react"
import { TR_CITIES } from "@/lib/types"
import type { Locale } from "@/lib/i18n"

interface TopBarProps {
  locale: Locale
}

export function TopBar({ locale }: TopBarProps) {
  const [city, setCity] = useState("İstanbul")
  const [cityOpen, setCityOpen] = useState(false)
  const cityRef = useRef<HTMLDivElement>(null)

  // Seçili şehri hatırla.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bulalim_city")
      if (saved) setCity(saved)
    } catch { /* yok say */ }
  }, [])

  // Dışarı tıklayınca şehir menüsünü kapat.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  function pickCity(c: string) {
    setCity(c)
    setCityOpen(false)
    try { localStorage.setItem("bulalim_city", c) } catch { /* yok say */ }
  }

  function toggleLocale() {
    // Dili anında diğerine çevir: cookie'yi yaz ve sayfayı yenile.
    const next: Locale = locale === "en" ? "tr" : "en"
    document.cookie = `locale=${next}; path=/; max-age=31536000`
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-5">
      {/* Şehir seçimi (81 il) */}
      <div ref={cityRef} className="relative">
        <button
          onClick={() => setCityOpen((o) => !o)}
          className="flex items-center gap-1.5 transition-colors hover:text-[#10303a]"
        >
          <MapPin className="h-3.5 w-3.5 text-[#6B7773]" /> {city}, TR
          <ChevronDown className="h-3 w-3" />
        </button>
        {cityOpen && (
          <div className="absolute right-0 top-7 z-[60] max-h-72 w-44 overflow-y-auto rounded-xl border border-[#E8EDEB] bg-white py-1 shadow-xl">
            {TR_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => pickCity(c)}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-[#F7F9F8] ${
                  c === city ? "font-semibold text-[#1f9d83]" : "text-[#10303a]"
                }`}
              >
                {c}
                {c === city && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dil değiştir (tek tıkla TR ↔ EN) */}
      <button
        onClick={toggleLocale}
        className="flex items-center gap-1.5 transition-colors hover:text-[#10303a]"
        title={locale === "en" ? "Türkçe'ye geç" : "Switch to English"}
      >
        <Languages className="h-3.5 w-3.5 text-[#6B7773]" />
        {locale === "en" ? "🇬🇧 EN" : "🇹🇷 TR"}
      </button>
    </div>
  )
}
