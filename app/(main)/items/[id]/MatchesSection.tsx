"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeIcon } from "@/components/brand/BadgeIcon"
import { createClient } from "@/lib/supabase/client"
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types"
import type { Item } from "@/lib/types"
import { FEATURED_BADGES, BADGE_META } from "@/lib/badges"
import { Sparkles, MapPin, Tag, CheckCircle2, MessageCircle } from "lucide-react"
import { toast } from "sonner"

export interface ScoredMatch {
  item: Item
  score: number
}

interface MatchesSectionProps {
  ownItem: Item
  matches: ScoredMatch[]
  userId: string | null
}

export function MatchesSection({ ownItem, matches, userId }: MatchesSectionProps) {
  const [active, setActive] = useState<ScoredMatch | null>(null)

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#32E1BE]" />
        <h2 className="text-xl font-bold text-[#073A30]">Yapay Zeka Destekli Eşleşmeler</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {matches.map((m) => (
          <div
            key={m.item.id}
            className="overflow-hidden rounded-xl border border-[#E8EDEB] transition-colors hover:border-[#32E1BE]"
          >
            <div className="relative aspect-square bg-[#F7F9F8]">
              {m.item.photo_urls?.[0] ? (
                <Image src={m.item.photo_urls[0]} alt={m.item.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl">
                  {CATEGORY_ICONS[m.item.category]}
                </div>
              )}
              <span className="absolute left-2 top-2 rounded-full bg-[#32E1BE] px-2 py-0.5 text-[10px] font-bold text-[#073A30]">
                %{Math.round(m.score * 100)} eşleşme
              </span>
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-sm font-medium text-[#073A30]">{m.item.title}</p>
              <p className="mt-1 text-xs text-[#6B7773]">{m.item.location_text || m.item.city}</p>
              <Button
                size="sm"
                onClick={() => setActive(m)}
                className="mt-2 h-7 w-full bg-[#32E1BE] text-xs font-semibold text-[#073A30] hover:bg-[#1FC4A2]"
              >
                Eşleştir
              </Button>
            </div>
          </div>
        ))}
      </div>

      <MatchModal ownItem={ownItem} match={active} userId={userId} onClose={() => setActive(null)} />
    </div>
  )
}

interface MatchModalProps {
  ownItem: Item
  match: ScoredMatch | null
  userId: string | null
  onClose: () => void
}

function MatchModal({ ownItem, match, userId, onClose }: MatchModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  if (!match) return null

  const found = match.item
  const ownProfile = ownItem.profiles
  const foundProfile = found.profiles

  async function startMessaging() {
    if (!userId) {
      router.push("/sign-in")
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.from("conversations").upsert(
      { item_id: found.id, initiator_id: userId, owner_id: found.user_id },
      { onConflict: "item_id,initiator_id" },
    ).select().single()
    setLoading(false)
    if (error || !data) {
      toast.error("Sohbet başlatılamadı")
      return
    }
    router.push(`/feed?chat=${data.id}`)
  }

  return (
    <Dialog open={!!match} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton className="max-w-2xl sm:max-w-2xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="-mt-10 mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#32E1BE] ring-4 ring-white">
            <Sparkles className="h-7 w-7 text-[#073A30]" />
          </div>
          <h2 className="text-lg font-bold text-[#073A30]">Eşleşme Sağlandı!</h2>
          <p className="text-xs text-[#6B7773]">Match Confirmed</p>
        </div>

        {/* Two item cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MatchItemCard
            heading={`${ownProfile?.full_name ?? "Sen"} — Aranan Eşya`}
            subheading={ownItem.type === "lost" ? "Aranan (Lost)" : "Bulunan (Found)"}
            item={ownItem}
            accent="#ef4444"
          />
          <MatchItemCard
            heading={`${foundProfile?.full_name ?? "Bulucu"} — Bulunan Eşya`}
            subheading={found.type === "found" ? "Bulunan (Found)" : "Aranan (Lost)"}
            item={found}
            accent="#22c55e"
            showBadges
          />
        </div>

        {/* AI note */}
        <div className="rounded-xl bg-[#F7F9F8] p-4 text-center">
          <p className="text-sm font-semibold text-[#073A30]">
            Tebrikler {ownProfile?.full_name?.split(" ")[0] ?? ""}
            {foundProfile?.full_name ? ` ve ${foundProfile.full_name.split(" ")[0]}` : ""}!
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#6B7773]">
            Yapay zeka eşleştirme sistemi, &quot;{ownItem.title}&quot; ({ownItem.location_text || ownItem.city}) ile
            &quot;{found.title}&quot; ({found.location_text || found.city}) ilanını{" "}
            <span className="font-bold text-[#073A30]">%{Math.round(match.score * 100)}</span> doğrulukla eşleştirdi.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={startMessaging}
            disabled={loading}
            className="flex-1 gap-2 bg-[#073A30] font-semibold text-white hover:bg-[#0F5547]"
          >
            <MessageCircle className="h-4 w-4" />
            Güvenli Mesajlaşmaya Başla
          </Button>
          <Link href={`/items/${found.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-[#E8EDEB] font-semibold text-[#073A30]">
              İlan Detaylarını Görüntüle
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface MatchItemCardProps {
  heading: string
  subheading: string
  item: Item
  accent: string
  showBadges?: boolean
}

function MatchItemCard({ heading, subheading, item, accent, showBadges }: MatchItemCardProps) {
  const profile = item.profiles
  return (
    <div className="rounded-xl border border-[#E8EDEB] p-3">
      <p className="text-xs font-semibold text-[#073A30]">{heading}</p>
      <div className="mt-2 flex gap-3">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#F7F9F8]">
          {item.photo_urls?.[0] ? (
            <Image src={item.photo_urls[0]} alt={item.title} fill className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-2xl">{CATEGORY_ICONS[item.category]}</span>
          )}
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase" style={{ color: accent }}>
            {subheading}
          </span>
          <p className="truncate text-sm font-semibold text-[#073A30]">{item.title}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7773]">
            <Tag className="h-3 w-3" /> {CATEGORY_LABELS[item.category]}
          </p>
          <p className="flex items-center gap-1 text-xs text-[#6B7773]">
            <MapPin className="h-3 w-3" /> {item.location_text || item.city}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-[#E8EDEB] pt-2">
        <Avatar className="h-7 w-7">
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback className="bg-[#073A30] text-[10px] text-white">
            {profile?.full_name?.charAt(0) ?? "?"}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium text-[#073A30]">{profile?.full_name ?? "Anonim"}</span>
        {profile?.is_verified && <CheckCircle2 className="h-3.5 w-3.5 text-[#32E1BE]" />}
      </div>

      {showBadges && (
        <div className="mt-2 flex items-center gap-2">
          {FEATURED_BADGES.map((b) => (
            <span key={b} title={BADGE_META[b].label}>
              <BadgeIcon badge={b} size={26} />
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
