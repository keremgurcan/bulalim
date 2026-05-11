import { createClient } from "@/lib/supabase/server"
import { MapPageClient } from "./client"
import type { Item } from "@/lib/types"

export default async function MapPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from("items")
    .select("*, profiles(id, full_name, avatar_url, is_verified)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(200)

  return <MapPageClient items={(items as Item[]) ?? []} />
}
