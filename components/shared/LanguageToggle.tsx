"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import type { Locale } from "@/lib/i18n"

function TrFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden>
      <rect width="24" height="16" rx="2" fill="#E30A17" />
      <circle cx="9.5" cy="8" r="3.6" fill="#fff" />
      <circle cx="10.8" cy="8" r="2.9" fill="#E30A17" />
      <path fill="#fff" d="M13.4 8l2.3-.75-1.42 1.96V6.8l1.42 1.95z" />
    </svg>
  )
}

function GbFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden>
      <clipPath id="gb-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="gb-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#gb-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#gb-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

const LANGS: { code: Locale; label: string; Flag: (p: { className?: string }) => React.ReactElement }[] = [
  { code: "tr", label: "Türkçe", Flag: TrFlag },
  { code: "en", label: "English", Flag: GbFlag },
]

interface LanguageToggleProps {
  locale: Locale
}

/**
 * Dil seçici (açılır menü). Kullanılan dil butonda görünür; tıklayınca altında
 * diğer seçenekler açılır. Windows emoji bayrağı göstermediği için SVG bayraklar.
 */
export function LanguageToggle({ locale }: LanguageToggleProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  function pick(next: Locale) {
    setOpen(false)
    if (next === locale) return
    document.cookie = `locale=${next}; path=/; max-age=31536000`
    window.location.reload()
  }

  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0]
  const CurrentFlag = current.Flag

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-[#E8EDEB] bg-white px-2.5 py-1 text-xs font-semibold text-[#073A30] transition-colors hover:border-[#32E1BE]"
      >
        <CurrentFlag className="h-3.5 w-5 rounded-[2px]" />
        {locale === "tr" ? "TR" : "EN"}
        <ChevronDown className={`h-3.5 w-3.5 text-[#6B7773] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-[70] mt-1.5 min-w-[130px] overflow-hidden rounded-xl border border-[#E8EDEB] bg-white py-1 shadow-lg"
        >
          {LANGS.map(({ code, label, Flag }) => {
            const active = code === locale
            return (
              <button
                key={code}
                type="button"
                onClick={() => pick(code)}
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors hover:bg-[#F7F9F8] ${
                  active ? "font-semibold text-[#073A30]" : "text-[#6B7773]"
                }`}
              >
                <Flag className="h-3.5 w-5 flex-shrink-0 rounded-[2px]" />
                <span className="flex-1">{label}</span>
                {active && <Check className="h-3.5 w-3.5 text-[#1FC4A2]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
