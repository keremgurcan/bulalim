"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { BadgeGrid } from "@/components/profile/BadgeGrid"
import { RankProgress } from "@/components/profile/RankProgress"
import { ItemCard } from "@/components/feed/ItemCard"
import { BadgeIcon } from "@/components/brand/BadgeIcon"
import type { Profile, Item } from "@/lib/types"
import { BADGE_META, type BadgeType } from "@/lib/badges"
import { MapPin, Calendar, CheckCircle2, Settings, Star } from "lucide-react"
import { useT } from "@/components/i18n/LocaleProvider"

interface ProfilePageProps {
  profile: Profile
  items: Item[]
  earnedBadges: BadgeType[]
  isOwn: boolean
}

export function ProfilePage({ profile, items, earnedBadges, isOwn }: ProfilePageProps) {
  const t = useT().profile
  const activeItems = items.filter((i) => i.status === "active")
  const resolvedItems = items.filter((i) => i.status === "resolved")

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E8EDEB] overflow-hidden">
        {/* Cover gradient */}
        <div className="h-24 bg-gradient-to-r from-[#073A30] to-[#0F5547]" />

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <Avatar className="w-20 h-20 border-4 border-white shadow-sm">
              <AvatarImage src={profile.avatar_url ?? undefined} />
              <AvatarFallback className="bg-[#073A30] text-white text-2xl font-bold">
                {profile.full_name?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            {isOwn && (
              <Link href="/settings">
                <Button variant="outline" size="sm" className="gap-2 border-[#E8EDEB]">
                  <Settings className="w-4 h-4" />
                  {t.edit}
                </Button>
              </Link>
            )}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#073A30]">{profile.full_name}</h1>
                {profile.is_verified && <CheckCircle2 className="w-5 h-5 text-[#32E1BE]" />}
              </div>
              <p className="text-[#6B7773] text-sm">@{profile.username}</p>
              {profile.bio && <p className="text-[#073A30] text-sm mt-2 max-w-lg">{profile.bio}</p>}
              <div className="flex items-center gap-4 mt-2 text-sm text-[#6B7773]">
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#32E1BE]" />
                    {profile.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#32E1BE]" />
                  {new Date(profile.created_at).toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Stats + altında kazanılan rozetler */}
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-xl font-bold text-[#073A30]">{items.length}</div>
                  <div className="text-xs text-[#6B7773]">{t.statListings}</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#073A30]">{resolvedItems.length}</div>
                  <div className="text-xs text-[#6B7773]">{t.statReunions}</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#073A30]">{profile.points}</div>
                  <div className="text-xs text-[#6B7773]">{t.statPoints}</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#073A30]">{earnedBadges.length}</div>
                  <div className="text-xs text-[#6B7773]">{t.statBadges}</div>
                </div>
              </div>

              {/* Sahip olunan rozetlerin küçük halleri */}
              {earnedBadges.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {earnedBadges.map((b) => (
                    <span
                      key={b}
                      title={BADGE_META[b].label}
                      className="rounded-full border border-[#E8EDEB] bg-white p-1 shadow-sm"
                    >
                      <BadgeIcon badge={b} size={26} earned />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Rank progress */}
          <RankProgress points={profile.points} rank={profile.rank} />
        </div>
      </div>

      {/* Güven & Kimlik Bilgileri */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* e-Devlet kimlik */}
        <div className="rounded-2xl border border-[#E8EDEB] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <Image src="/edevlet-logo.png" alt="e-Devlet" width={32} height={32} className="rounded-md" />
            <h3 className="font-semibold text-[#073A30]">{t.edevletTitle}</h3>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#F7F9F8] p-3 text-sm">
            <span className="text-[#6B7773]">{t.verificationStatus}</span>
            <span className={`font-bold ${profile.is_verified ? "text-[#1FC4A2]" : "text-[#6B7773]"}`}>
              {profile.is_verified ? t.verified : t.pending}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#6B7773]">{t.idNote}</p>
        </div>

        {/* Güven skoru */}
        <div className="rounded-2xl border border-[#E8EDEB] bg-white p-5">
          <h3 className="mb-3 font-semibold text-[#073A30]">{t.trustScore}</h3>
          {(() => {
            const trust = Math.min(99, 70 + Math.round(profile.points / 5) + (profile.is_verified ? 15 : 0))
            const stars = Math.round((trust / 100) * 5)
            const teslimat = Math.min(99, 85 + resolvedItems.length)
            const oylama = profile.is_verified ? 99 : 90
            return (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#073A30]">{trust}</span>
                  <span className="text-sm text-[#6B7773]">/100</span>
                </div>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < stars ? "fill-[#FFD66B] text-[#FFD66B]" : "text-[#E8EDEB]"}`}
                    />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-[#F7F9F8] p-2">
                    <div className="text-lg font-bold text-[#073A30]">%{teslimat}</div>
                    <div className="text-xs text-[#6B7773]">{t.delivery}</div>
                  </div>
                  <div className="rounded-xl bg-[#F7F9F8] p-2">
                    <div className="text-lg font-bold text-[#073A30]">%{oylama}</div>
                    <div className="text-xs text-[#6B7773]">{t.rating}</div>
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      </div>

      {/* Rozetler — her zaman görünür */}
      <div className="mt-6 rounded-2xl border border-[#E8EDEB] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-[#073A30]">{t.badgeShowcase}</h3>
          <span className="text-xs text-[#6B7773]">{t.earnedOf.replace("{n}", String(earnedBadges.length))}</span>
        </div>
        <BadgeGrid earnedBadges={earnedBadges} />
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <Tabs defaultValue="active">
          <TabsList className="bg-[#F7F9F8] border border-[#E8EDEB]">
            <TabsTrigger value="active">{t.activeTab} ({activeItems.length})</TabsTrigger>
            <TabsTrigger value="resolved">{t.historyTab} ({resolvedItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {activeItems.length === 0 ? (
              <div className="text-center py-12 text-[#6B7773]">
                <div className="text-4xl mb-3">📭</div>
                <p>{t.noActive}</p>
                {isOwn && (
                  <Link href="/items/new">
                    <Button className="mt-4 bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-semibold">
                      {t.postListing}
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {activeItems.map((item) => <ItemCard key={item.id} item={item} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="mt-4">
            {resolvedItems.length === 0 ? (
              <div className="text-center py-12 text-[#6B7773]">
                <div className="text-4xl mb-3">✅</div>
                <p>Henüz çözüme kavuşturulmuş ilan yok</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {resolvedItems.map((item) => <ItemCard key={item.id} item={item} />)}
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
