"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, ShieldCheck } from "lucide-react"
import type { ItemCategory } from "@/lib/types"

type Intent = "lost" | "found"

const QUICK_CATEGORIES: Array<{ value: ItemCategory; label: string }> = [
  { value: "electronics", label: "Elektronik" },
  { value: "wallet_card", label: "Cüzdan/Kart" },
  { value: "keys", label: "Anahtar" },
  { value: "documents", label: "Evrak/Kimlik" },
  { value: "other", label: "Diğer" },
]

/**
 * Landing hero switch card. Lets the visitor pick lost/found + category +
 * location, then routes them to the e-Devlet / TC Kimlik verified sign-in
 * (carrying their intent), since posting or querying requires verification.
 */
export function SearchSwitch() {
  const router = useRouter()
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
    <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5 sm:p-6">
      {/* Lost / Found toggle */}
      <div className="mb-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setIntent("lost")}
          className={`text-sm font-semibold transition-colors ${
            intent === "lost" ? "text-[#073A30]" : "text-[#6B7773]"
          }`}
        >
          Eşyamı Kaybettim
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={intent === "found"}
          onClick={() => setIntent((p) => (p === "lost" ? "found" : "lost"))}
          className="relative h-7 w-12 rounded-full bg-[#32E1BE] transition-colors"
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
          className={`text-sm font-semibold transition-colors ${
            intent === "found" ? "text-[#073A30]" : "text-[#6B7773]"
          }`}
        >
          Eşya Buldum
        </button>
      </div>

      {/* Category chips */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        {QUICK_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              category === cat.value
                ? "border-[#32E1BE] bg-[#32E1BE]/10 text-[#073A30]"
                : "border-[#E8EDEB] bg-white text-[#6B7773] hover:border-[#32E1BE]/50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Location input */}
      <div className="relative mb-3">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#32E1BE]" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="İlçe veya Semt Giriniz (Örn: Kadıköy)"
          className="w-full rounded-xl border border-[#E8EDEB] bg-[#F7F9F8] py-3 pl-9 pr-4 text-sm text-[#073A30] placeholder:text-[#6B7773] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#32E1BE]"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-xl bg-[#073A30] py-3 text-sm font-bold text-white transition-colors hover:bg-[#0F5547]"
      >
        Sorgula / Bildir
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-[#6B7773]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#32E1BE]" />
        Güvenlik için işlemler e-Devlet (TC Kimlik) doğrulaması ile yapılır.
      </p>
    </div>
  )
}
