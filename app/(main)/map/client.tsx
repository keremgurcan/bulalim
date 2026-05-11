"use client"

import Link from "next/link"
import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { List } from "lucide-react"
import type { Item } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"

const MapView = dynamic(() => import("@/components/map/MapView").then(m => m.MapView), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#F7F9F8] flex items-center justify-center text-[#6B7773]">Harita yükleniyor...</div>,
})

interface MapPageClientProps {
  items: Item[]
}

export function MapPageClient({ items }: MapPageClientProps) {
  const [type, setType] = useState<"all" | "lost" | "found">("all")
  const [category, setCategory] = useState("")

  const filtered = items.filter((item) => {
    if (type !== "all" && item.type !== type) return false
    if (category && item.category !== category) return false
    return true
  })

  return (
    <div className="relative h-[calc(100vh-64px)]">
      {/* Filters overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-2">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
          {(["all", "lost", "found"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                type === t ? "bg-[#073A30] text-white" : "text-[#6B7773] hover:text-[#073A30]"
              }`}
            >
              {t === "all" ? "Tümü" : t === "lost" ? "Kayıp" : "Bulundu"}
            </button>
          ))}
        </div>
      </div>

      {/* Back to list */}
      <div className="absolute top-4 right-4 z-[1000]">
        <Link href="/feed">
          <Button size="sm" className="bg-white text-[#073A30] shadow-sm hover:bg-[#F7F9F8] gap-2 border border-[#E8EDEB]">
            <List className="w-4 h-4" />
            Listeyi Gör
          </Button>
        </Link>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-4 z-[1000] bg-white rounded-xl p-3 shadow-sm border border-[#E8EDEB] text-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-[#073A30] font-medium">Kayıp</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-[#073A30] font-medium">Bulundu</span>
        </div>
      </div>

      <MapView items={filtered} height="100%" />
    </div>
  )
}
