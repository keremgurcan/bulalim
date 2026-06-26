"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

/**
 * Bir ilanin goruntulenme sayisini artirir. items UPDATE icin RLS sadece sahibe
 * izin verdiginden service-role ile yazilir. Ilan sahibinin kendi ziyareti SAYILMAZ.
 * Tekrar saymayi (refresh) onlemek icin cagiran taraf tarayici basina tekillestirir.
 */
export async function incrementItemView(itemId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data: item } = await admin
    .from("items")
    .select("user_id, view_count")
    .eq("id", itemId)
    .single()
  if (!item) return
  if (user && user.id === item.user_id) return

  await admin
    .from("items")
    .update({ view_count: (item.view_count ?? 0) + 1 })
    .eq("id", itemId)
}
