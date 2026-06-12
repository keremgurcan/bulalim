"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CATEGORY_ICONS } from "@/lib/types"
import type { Item } from "@/lib/types"
import { useLocale, useT } from "@/components/i18n/LocaleProvider"
import type { dictionaries } from "@/lib/i18n"

interface ItemCardProps {
  item: Item
  userLat?: number
  userLng?: number
}

function timeAgo(dateStr: string, t: (typeof dictionaries)["tr"]["item"], locale: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return t.justNow
  if (hours < 24) return t.hoursAgo.replace("{n}", String(hours))
  const days = Math.floor(hours / 24)
  if (days < 7) return t.daysAgo.replace("{n}", String(days))
  return new Date(dateStr).toLocaleDateString(locale === "en" ? "en-GB" : "tr-TR")
}

export function ItemCard({ item }: ItemCardProps) {
  const dict = useT()
  const locale = useLocale()
  const isLost = item.type === "lost"
  const categoryLabel = dict.categories[item.category] ?? item.category
  const categoryIcon = CATEGORY_ICONS[item.category] ?? "📦"

  return (
    <Link href={`/items/${item.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-[#E8EDEB] overflow-hidden hover:shadow-md hover:border-[#32E1BE]/50 transition-all duration-200">
        {/* Photo */}
        <div className="relative aspect-square bg-[#F7F9F8] overflow-hidden">
          {item.photo_urls && item.photo_urls.length > 0 ? (
            <Image
              src={item.photo_urls[0]}
              alt={item.title}
              fill
              className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              {categoryIcon}
            </div>
          )}
          {/* Type badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isLost
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {isLost ? dict.item.lost : dict.item.found}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-[#073A30] text-sm line-clamp-2 flex-1 group-hover:text-[#0F5547]">
              {item.title}
            </h3>
            <Badge variant="secondary" className="text-xs shrink-0 bg-[#F7F9F8] text-[#073A30]">
              {categoryLabel}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#6B7773] mb-3">
            <MapPin className="w-3 h-3 text-[#32E1BE]" />
            <span className="truncate">{item.location_text || item.city}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Avatar className="w-5 h-5">
                <AvatarImage src={item.profiles?.avatar_url ?? undefined} />
                <AvatarFallback className="bg-[#073A30] text-white text-[8px]">
                  {item.profiles?.full_name?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-[#6B7773]">{item.profiles?.full_name ?? (locale === "en" ? "Anonymous" : "Anonim")}</span>
              {item.profiles?.is_verified && (
                <span className="text-[#32E1BE] text-xs">✓</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B7773]">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {item.view_count}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(item.created_at, dict.item, locale)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
