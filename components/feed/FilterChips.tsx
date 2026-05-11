"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CATEGORY_LABELS, TR_CITIES } from "@/lib/types"
import type { ItemCategory } from "@/lib/types"
import { MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FilterChips() {
  const router = useRouter()
  const params = useSearchParams()

  const type = params.get("type") ?? "all"
  const category = params.get("category") ?? ""
  const city = params.get("city") ?? ""
  const q = params.get("q") ?? ""

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    router.push(`/feed?${next.toString()}`)
  }

  const typeFilters = [
    { value: "all", label: "Tümü" },
    { value: "lost", label: "Kayıp" },
    { value: "found", label: "Bulundu" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      {/* Type chips */}
      <div className="flex gap-1.5 bg-[#F7F9F8] rounded-xl p-1">
        {typeFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => updateParam("type", f.value === "all" ? "" : f.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              type === f.value || (f.value === "all" && !params.get("type"))
                ? "bg-[#073A30] text-white shadow-sm"
                : "text-[#6B7773] hover:text-[#073A30]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Category dropdown */}
      <Select value={category} onValueChange={(val) => { if (val) updateParam("category", val === "all" ? "" : val) }}>
        <SelectTrigger className="h-9 text-sm w-40 bg-[#F7F9F8] border-[#E8EDEB]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Kategoriler</SelectItem>
          {(Object.entries(CATEGORY_LABELS) as [ItemCategory, string][]).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* City dropdown */}
      <Select value={city} onValueChange={(val) => { if (val) updateParam("city", val === "all" ? "" : val) }}>
        <SelectTrigger className="h-9 text-sm w-36 bg-[#F7F9F8] border-[#E8EDEB]">
          <SelectValue placeholder="Şehir" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Şehirler</SelectItem>
          {TR_CITIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Near me */}
      <button
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-[#F7F9F8] text-[#6B7773] hover:bg-[#073A30] hover:text-white transition-colors border border-[#E8EDEB] h-9"
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
              const next = new URLSearchParams(params.toString())
              next.set("lat", pos.coords.latitude.toString())
              next.set("lng", pos.coords.longitude.toString())
              router.push(`/feed?${next.toString()}`)
            })
          }
        }}
      >
        <MapPin className="w-3.5 h-3.5" />
        Yakınımdakiler
      </button>

      {/* Active filter indicators */}
      {(category || city || q) && (
        <button
          onClick={() => router.push("/feed")}
          className="px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors"
        >
          ✕ Filtreleri Temizle
        </button>
      )}
    </div>
  )
}
