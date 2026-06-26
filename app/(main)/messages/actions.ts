"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

interface DeleteResult {
  ok: boolean
  error?: string
}

/**
 * Bir sohbeti karşılıklı olarak siler (her iki kullanıcıdan da).
 * conversations tablosunda DELETE için RLS politikası olmadığından,
 * önce oturumdaki kullanıcının sohbetin katılımcısı olduğu doğrulanır,
 * sonra service-role ile silinir. messages FK cascade ile temizlenir.
 */
export async function deleteConversation(conversationId: string): Promise<DeleteResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Oturum bulunamadı" }

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, initiator_id, owner_id")
    .eq("id", conversationId)
    .single()

  if (!conv || (conv.initiator_id !== user.id && conv.owner_id !== user.id)) {
    return { ok: false, error: "Bu sohbeti silme yetkiniz yok" }
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { error } = await admin.from("conversations").delete().eq("id", conversationId)
  if (error) return { ok: false, error: error.message }

  return { ok: true }
}
