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
  const [langOpen, setLangOpen] = useState(false)
  const cityRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  // Seçili şehri hatırla.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bulalim_city")
      if (saved) setCity(saved)
    } catch { /* yok say */ }
  }, [])

  // Dışarı tıklayınca menüleri kapat.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false)
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  function pickCity(c: string) {
    setCity(c)
    setCityOpen(false)
    try { localStorage.setItem("bulalim_city", c) } catch { /* yok say */ }
  }

  function pickLocale(next: Locale) {
    setLangOpen(false)
    if (next === locale) return
    // Dili cookie'ye yaz ve sayfayı yenile — sunucu yeni dilde render etsin.
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
          <div className="absolute right-0 top-7 z-50 max-h-72 w-44 overflow-y-auto rounded-xl border border-[#E8EDEB] bg-white py-1 shadow-xl">
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

      {/* Dil seçimi (TR / EN) */}
      <div ref={langRef} className="relative">
        <button
          onClick={() => setLangOpen((o) => !o)}
          className="flex items-center gap-1.5 transition-colors hover:text-[#10303a]"
        >
          <Languages className="h-3.5 w-3.5 text-[#6B7773]" />
          {locale === "en" ? "EN" : "TR"}
          <ChevronDown className="h-3 w-3" />
        </button>
        {langOpen && (
          <div className="absolute right-0 top-7 z-50 w-32 rounded-xl border border-[#E8EDEB] bg-white py-1 shadow-xl">
            <button
              onClick={() => pickLocale("tr")}
              className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-[#F7F9F8] ${
                locale === "tr" ? "font-semibold text-[#1f9d83]" : "text-[#10303a]"
              }`}
            >
              🇹🇷 Türkçe {locale === "tr" && <Check className="h-3 w-3" />}
            </button>
            <button
              onClick={() => pickLocale("en")}
              className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-[#F7F9F8] ${
                locale === "en" ? "font-semibold text-[#1f9d83]" : "text-[#10303a]"
              }`}
            >
              🇬🇧 English {locale === "en" && <Check className="h-3 w-3" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
