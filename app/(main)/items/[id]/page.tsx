import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types"
import type { Item } from "@/lib/types"
import { MapPin, Calendar, Eye, MessageCircle, CheckCircle2, Star } from "lucide-react"
import { ItemActions } from "./client"

interface ItemPageProps {
  params: Promise<{ id: string }>
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: item }, { data: { user } }] = await Promise.all([
    supabase
      .from("items")
      .select("*, profiles(id, full_name, avatar_url, is_verified, username, rank, points)")
      .eq("id", id)
      .single(),
    supabase.auth.getUser(),
  ])

  if (!item) notFound()

  // Increment view count (fire and forget)
  supabase.from("items").update({ view_count: item.view_count + 1 }).eq("id", id)

  const isOwner = user?.id === item.user_id
  const isLost = item.type === "lost"
  const profile = item.profiles as Item["profiles"]

  // Fetch potential matches for owner viewing their own lost item
  let matches: Item[] = []
  if (isOwner && isLost) {
    const { data } = await supabase
      .from("matches")
      .select("*, found_item:found_item_id(*, profiles(full_name, avatar_url))")
      .eq("lost_item_id", id)
      .eq("status", "pending")
      .gte("similarity_score", 0.6)
      .limit(6)
    matches = (data?.map((m: { found_item: Item }) => m.found_item).filter(Boolean) ?? []) as Item[]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Photos */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl overflow-hidden bg-[#F7F9F8] aspect-square relative">
            {item.photo_urls && item.photo_urls.length > 0 ? (
              <Image
                src={item.photo_urls[0]}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                {CATEGORY_ICONS[item.category as keyof typeof CATEGORY_ICONS] ?? "📦"}
              </div>
            )}
          </div>
          {item.photo_urls && item.photo_urls.length > 1 && (
            <div className="flex gap-2 mt-3">
              {item.photo_urls.slice(1).map((url: string, i: number) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E8EDEB]">
                  <Image src={url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status badges */}
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${isLost ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
              {isLost ? "Kayıp" : "Bulundu"}
            </span>
            <Badge variant="secondary" className="text-xs bg-[#F7F9F8]">
              {CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS]}
            </Badge>
            {item.status !== "active" && (
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                item.status === "resolved" ? "bg-[#32E1BE]/20 text-[#073A30]" : "bg-gray-100 text-gray-600"
              }`}>
                {item.status === "resolved" ? "Çözüldü" : "Eşleşti"}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-[#073A30] leading-tight">{item.title}</h1>
          <p className="text-[#6B7773] leading-relaxed text-sm">{item.description}</p>

          <div className="space-y-2 text-sm text-[#6B7773]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#32E1BE]" />
              <span>{item.location_text || item.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#32E1BE]" />
              <span>{new Date(item.date_lost_or_found).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#32E1BE]" />
              <span>{item.view_count} kişi gördü</span>
            </div>
          </div>

          <div className="border-t border-[#E8EDEB] pt-4">
            <h3 className="text-xs font-semibold text-[#6B7773] uppercase tracking-wider mb-3">İlan Sahibi</h3>
            <div className="flex items-center gap-3">
              <Link href={`/profile/${profile?.username}`}>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-[#073A30] text-white">
                    {profile?.full_name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <Link href={`/profile/${profile?.username}`} className="font-semibold text-[#073A30] hover:text-[#0F5547] text-sm">
                    {profile?.full_name}
                  </Link>
                  {profile?.is_verified && <CheckCircle2 className="w-4 h-4 text-[#32E1BE]" />}
                </div>
                <div className="text-xs text-[#6B7773] flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#FFD66B]" />
                  {profile?.rank}
                </div>
              </div>
            </div>
          </div>

          <ItemActions item={item as Item} isOwner={isOwner} userId={user?.id ?? null} />
        </div>
      </div>

      {/* Potential Matches */}
      {isOwner && matches.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#073A30] mb-4">Olası Eşleşmeler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {matches.map((match) => (
              <Link key={match.id} href={`/items/${match.id}`} className="group">
                <div className="border border-[#E8EDEB] rounded-xl overflow-hidden hover:border-[#32E1BE] transition-colors">
                  <div className="aspect-square bg-[#F7F9F8] relative">
                    {match.photo_urls?.[0] ? (
                      <Image src={match.photo_urls[0]} alt={match.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {CATEGORY_ICONS[match.category]}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm text-[#073A30] line-clamp-2">{match.title}</p>
                    <p className="text-xs text-[#6B7773] mt-1">{match.location_text || match.city}</p>
                    <Button size="sm" className="mt-2 w-full bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-semibold text-xs h-7">
                      İncele
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
