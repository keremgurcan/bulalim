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
import type { Profile, Item } from "@/lib/types"
import type { BadgeType } from "@/lib/badges"
import { MapPin, Calendar, CheckCircle2, Settings } from "lucide-react"

interface ProfilePageProps {
  profile: Profile
  items: Item[]
  earnedBadges: BadgeType[]
  isOwn: boolean
}

export function ProfilePage({ profile, items, earnedBadges, isOwn }: ProfilePageProps) {
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
                  Düzenle
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

            {/* Stats */}
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-xl font-bold text-[#073A30]">{items.length}</div>
                <div className="text-xs text-[#6B7773]">İlan</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#073A30]">{resolvedItems.length}</div>
                <div className="text-xs text-[#6B7773]">Buluşturma</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#073A30]">{profile.points}</div>
                <div className="text-xs text-[#6B7773]">Puan</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#073A30]">{earnedBadges.length}</div>
                <div className="text-xs text-[#6B7773]">Rozet</div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Rank progress */}
          <RankProgress points={profile.points} rank={profile.rank} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <Tabs defaultValue="active">
          <TabsList className="bg-[#F7F9F8] border border-[#E8EDEB]">
            <TabsTrigger value="active">Aktif İlanlar ({activeItems.length})</TabsTrigger>
            <TabsTrigger value="resolved">Geçmiş ({resolvedItems.length})</TabsTrigger>
            <TabsTrigger value="badges">Rozetler ({earnedBadges.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {activeItems.length === 0 ? (
              <div className="text-center py-12 text-[#6B7773]">
                <div className="text-4xl mb-3">📭</div>
                <p>Aktif ilan yok</p>
                {isOwn && (
                  <Link href="/items/new">
                    <Button className="mt-4 bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-semibold">
                      İlan Ver
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

          <TabsContent value="badges" className="mt-4">
            <BadgeGrid earnedBadges={earnedBadges} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
