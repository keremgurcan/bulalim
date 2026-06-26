"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, ChevronDown } from "lucide-react"
import type { ItemCategory } from "@/lib/types"
import { dictionaries, type Locale } from "@/lib/i18n"

type Intent = "lost" | "found"

const QUICK_CATEGORIES: ItemCategory[] = ["electronics", "wallet_card", "keys", "documents", "other"]

interface SearchSwitchProps {
  lang?: Locale
  /** Landing hero: alt köşeler düz + kendi gölgesi yok (arkadaki beyaz panele kaynar). */
  flush?: boolean
}

/**
 * Landing hero switch card. Lets the visitor pick lost/found + category +
 * location, then routes them to the e-Devlet / TC Kimlik verified sign-in
 * (carrying their intent), since posting or querying requires verification.
 */
export function SearchSwitch({ lang = "tr", flush = false }: SearchSwitchProps) {
  const router = useRouter()
  const t = dictionaries[lang].search
  const [intent, setIntent] = useState<Intent>("lost")
  const [category, setCategory] = useState<ItemCategory>("electronics")
  const [location, setLocation] = useState("")

  function handleSubmit() {
    const params = new URLSearchParams({ intent, category })
    if (location.trim()) params.set("loc", location.trim())
    // Konum girildikten sonra TC kimlik (e-Devlet) doğrulamalı girişe yönlendir.
    router.push(`/sign-in?${params.toString()}`)
  }

  return (
    <div className={`w-full bg-white p-4 sm:p-5 ${flush ? "rounded-t-3xl" : "rounded-3xl shadow-2xl ring-1 ring-black/5"}`}>
      {/* Lost / Found toggle */}
      <div className="mb-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setIntent("lost")}
          className={`text-sm font-bold transition-colors ${
            intent === "lost" ? "text-[#10303a]" : "text-[#9aa8a4]"
          }`}
        >
          {t.lost}
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={intent === "found"}
          onClick={() => setIntent((p) => (p === "lost" ? "found" : "lost"))}
          className="relative h-7 w-12 rounded-full bg-[#1FC4A2] transition-colors"
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
              intent === "found" ? "left-[1.625rem]" : "left-0.5"
            }`}
          />
        </button>
        <button
          type="button"
          onClick={() => setIntent("found")}
          className={`text-sm font-bold transition-colors ${
            intent === "found" ? "text-[#10303a]" : "text-[#9aa8a4]"
          }`}
        >
          {t.found}
        </button>
      </div>

      {/* Category segmented bar */}
      <div className="mb-3 flex items-center gap-1 rounded-xl bg-[#F0F3F2] px-2 py-2">
        {QUICK_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all ${
              category === cat
                ? "bg-white text-[#10303a] shadow-sm"
                : "text-[#5b6b6a] hover:text-[#10303a]"
            }`}
          >
            {t.categories[cat as keyof typeof t.categories]}
          </button>
        ))}
        <ChevronDown className="ml-auto mr-1 h-4 w-4 flex-shrink-0 text-[#6B7773]" />
      </div>

      {/* Location input */}
      <div className="relative mb-3">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7773]" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={t.locationPlaceholder}
          className="w-full rounded-xl border border-[#E8EDEB] bg-white py-3 pl-9 pr-4 text-sm text-[#10303a] placeholder:text-[#9aa8a4] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1FC4A2]"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-xl bg-[#1f9d83] py-3 text-sm font-bold text-white transition-colors hover:bg-[#178a72]"
      >
        {t.submit}
      </button>
    </div>
  )
}
