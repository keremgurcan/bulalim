import { createClient } from "@/lib/supabase/server"
import { SearchClient } from "./client"

export const dynamic = "force-dynamic"

export default async function SearchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <SearchClient currentUserId={user?.id ?? null} />
}
