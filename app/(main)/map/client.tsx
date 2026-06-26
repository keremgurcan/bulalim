"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { Search, MapPin, Crosshair, List, X } from "lucide-react"
import type { Item, ItemCategory } from "@/lib/types"
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types"
import { haversineDistance, formatDistance } from "@/lib/geo"
import { useT } from "@/components/i18n/LocaleProvider"

const MapView = dynamic(() => import("@/components/map/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#F7F9F8] text-[#6B7773]">
      Harita yükleniyor...
    </div>
  ),
})

const RADIUS_OPTIONS = [
  { label: "100m", value: 0.1 },
  { label: "500m", value: 0.5 },
  { label: "1km", value: 1 },
  { label: "5km", value: 5 },
  { label: "Tümü", value: 0 },
]

interface MapPageClientProps {
  items: Item[]
}

export function MapPageClient({ items }: MapPageClientProps) {
  const dict = useT()
  const tm = dict.map
  const [panelOpen, setPanelOpen] = useState(true)
  const [search, setSearch] = useState("")
  const [type, setType] = useState<"all" | "lost" | "found">("all")
  const [categories, setCategories] = useState<Set<ItemCategory>>(new Set())
  const [radiusKm, setRadiusKm] = useState(0)
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function toggleCategory(cat: ItemCategory) {
    setCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  function locateMe() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
    )
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (type !== "all" && item.type !== type) return false
      if (categories.size > 0 && !categories.has(item.category)) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !item.title.toLowerCase().includes(q) &&
          !(item.location_text ?? "").toLowerCase().includes(q) &&
          !item.city.toLowerCase().includes(q)
        )
          return false
      }
      if (dateFrom && item.date_lost_or_found < dateFrom) return false
      if (dateTo && item.date_lost_or_found > dateTo) return false
      if (radiusKm > 0 && origin) {
        const d = haversineDistance(origin.lat, origin.lng, item.lat, item.lng)
        if (d > radiusKm) return false
      }
      return true
    })
  }, [items, type, categories, search, dateFrom, dateTo, radiusKm, origin])

  return (
    <div className="relative h-[calc(100vh-64px)]">
      {/* Toggle panel button (when closed) */}
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="absolute left-4 top-4 z-[1000] flex items-center gap-2 rounded-xl bg-[#042720] px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
        >
          <List className="h-4 w-4" /> {dict.language === "English" ? "Filters" : "Filtreler"}
        </button>
      )}

      {/* Dark filter panel */}
      {panelOpen && (
        <div className="absolute left-0 top-0 z-[1000] flex h-full w-[340px] max-w-[88vw] flex-col bg-[#042720] text-white shadow-2xl">
          {/* Header / search */}
          <div className="flex items-center gap-2 border-b border-white/10 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tm.searchPlaceholder}
                className="w-full rounded-lg border border-white/15 bg-white/5 py-2 pl-9 pr-3 text-sm placeholder:text-white/40 focus:border-[#32E1BE] focus:outline-none"
              />
            </div>
            <button onClick={() => setPanelOpen(false)} className="rounded-lg p-2 hover:bg-white/10" aria-label="Kapat">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Type filter */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">{tm.type}</p>
              <div className="flex gap-1 rounded-lg bg-white/5 p-1">
                {(["all", "lost", "found"] as const).map((tp) => (
                  <button
                    key={tp}
                    onClick={() => setType(tp)}
                    className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
                      type === tp ? "bg-[#32E1BE] text-[#073A30]" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {tp === "all" ? tm.all : tp === "lost" ? dict.item.lost : dict.item.found}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">{tm.categoryFilters}</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CATEGORY_LABELS) as ItemCategory[]).map((cat) => {
                  const active = categories.has(cat)
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center rounded-full border px-3 py-1.5 text-xs transition-all ${
                        active
                          ? "border-[#32E1BE] bg-[#32E1BE]/20 text-white"
                          : "border-white/15 text-white/70 hover:border-white/30"
                      }`}
                    >
                      {dict.categories[cat]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Radius */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">{tm.radius}</p>
              <div className="flex gap-1 rounded-lg bg-white/5 p-1">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setRadiusKm(r.value)}
                    className={`flex-1 rounded-md px-1 py-1.5 text-xs font-semibold transition-colors ${
                      radiusKm === r.value ? "bg-[#32E1BE] text-[#073A30]" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {r.label === "Tümü" ? tm.all : r.label}
                  </button>
                ))}
              </div>
              <button
                onClick={locateMe}
                className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  origin ? "border-[#32E1BE] text-[#32E1BE]" : "border-white/15 text-white/70 hover:border-white/30"
                }`}
              >
                <Crosshair className="h-3.5 w-3.5" />
                {origin ? tm.located : tm.locateMe}
              </button>
            </div>

            {/* Dates */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">{tm.dateRange}</p>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs text-white [color-scheme:dark] focus:border-[#32E1BE] focus:outline-none"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs text-white [color-scheme:dark] focus:border-[#32E1BE] focus:outline-none"
                />
              </div>
            </div>

            {/* Results */}
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
                {tm.results} ({filtered.length})
              </p>
            </div>
            <div className="space-y-2">
              {filtered.map((item) => {
                const dist = origin ? haversineDistance(origin.lat, origin.lng, item.lat, item.lng) : null
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-all ${
                      selectedId === item.id
                        ? "border-[#32E1BE] bg-[#32E1BE]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
                      {item.photo_urls?.[0] ? (
                        <Image src={item.photo_urls[0]} alt={item.title} fill className="object-cover" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-lg">
                          {CATEGORY_ICONS[item.category]}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                            item.type === "lost" ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {item.type === "lost" ? dict.item.lost : dict.item.found}
                        </span>
                        <span className="truncate text-sm font-semibold text-white">{item.title}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-white/50">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{item.location_text || item.city}</span>
                        {dist != null && <span className="ml-auto flex-shrink-0">{formatDistance(dist)}</span>}
                      </div>
                    </div>
                  </button>
                )
              })}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-white/40">Filtrelere uygun ilan bulunamadı.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <MapView
        items={filtered}
        selectedId={selectedId}
        onMarkerClick={(it) => setSelectedId(it.id)}
        height="100%"
      />
    </div>
  )
}
