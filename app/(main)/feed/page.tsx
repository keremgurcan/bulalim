import { Suspense } from "react"
import Link from "next/link"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { ItemCard } from "@/components/feed/ItemCard"
import { FilterChips } from "@/components/feed/FilterChips"
import { Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDictionary, normalizeLocale } from "@/lib/i18n"
import type { Item, ItemType, ItemCategory } from "@/lib/types"

async function getFeedDict() {
  const cookieStore = await cookies()
  return getDictionary(normalizeLocale(cookieStore.get("locale")?.value)).app.feed
}

interface FeedPageProps {
  searchParams: Promise<{
    type?: string
    category?: string
    city?: string
    q?: string
    lat?: string
    lng?: string
  }>
}

async function FeedContent({ searchParams }: FeedPageProps) {
  const params = await searchParams
  const t = await getFeedDict()
  const supabase = await createClient()

  let query = supabase
    .from("items")
    .select("*, profiles(id, full_name, avatar_url, is_verified, username)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(24)

  if (params.type && params.type !== "all") {
    query = query.eq("type", params.type as ItemType)
  }
  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category as ItemCategory)
  }
  if (params.city && params.city !== "all") {
    query = query.eq("city", params.city)
  }
  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  }

  const { data: items, error } = await query

  if (error) {
    return (
      <div className="text-center py-16 text-[#6B7773]">
        Veriler yüklenirken hata oluştu.
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-[#073A30] mb-2">{t.notFound}</h3>
        <p className="text-[#6B7773] mb-6">{t.notFoundDesc}</p>
        <Link href="/items/new">
          <Button className="bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-semibold">
            {t.postFirst}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
      {(items as Item[]).map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default async function FeedPage(props: FeedPageProps) {
  const t = await getFeedDict()
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#073A30]">{t.title}</h1>
            <p className="text-sm text-[#6B7773] mt-0.5">{t.subtitle}</p>
          </div>
          <Link href="/map">
            <Button variant="outline" size="sm" className="gap-2 border-[#E8EDEB] text-[#073A30] hidden sm:flex">
              <Map className="w-4 h-4" />
              {t.mapView}
            </Button>
          </Link>
        </div>

        <Suspense fallback={null}>
          <FilterChips />
        </Suspense>

        <div className="mt-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[#F7F9F8] rounded-2xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            }
          >
            <FeedContent searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
