"use client"

import type { Locale } from "@/lib/i18n"

function TrFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden>
      <rect width="24" height="16" rx="2" fill="#E30A17" />
      <circle cx="9.5" cy="8" r="3.6" fill="#fff" />
      <circle cx="10.8" cy="8" r="2.9" fill="#E30A17" />
      <path
        fill="#fff"
        d="M13.4 8l2.3-.75-1.42 1.96V6.8l1.42 1.95z"
      />
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

interface LanguageToggleProps {
  locale: Locale
}

/**
 * TR / EN dil seçici — Windows emoji bayrağı göstermediği için SVG bayraklar.
 * Segmented pill: aktif dil vurgulanır, tıklayınca cookie yazılıp sayfa yenilenir.
 * Renkler .dark override'larıyla otomatik uyum sağlar; aktif rozet iki temada da mint.
 */
export function LanguageToggle({ locale }: LanguageToggleProps) {
  function pick(next: Locale) {
    if (next === locale) return
    document.cookie = `locale=${next}; path=/; max-age=31536000`
    window.location.reload()
  }

  const activeCls = "bg-[#32E1BE] text-[#073A30]"
  const idleCls = "text-[#6B7773] hover:text-[#073A30]"

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-[#E8EDEB] bg-white p-0.5">
      {(["tr", "en"] as const).map((code) => {
        const active = locale === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => pick(code)}
            aria-pressed={active}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              active ? activeCls : idleCls
            }`}
          >
            {code === "tr" ? (
              <TrFlag className="h-3.5 w-5 rounded-[2px]" />
            ) : (
              <GbFlag className="h-3.5 w-5 rounded-[2px]" />
            )}
            {code === "tr" ? "TR" : "EN"}
          </button>
        )
      })}
    </div>
  )
}
