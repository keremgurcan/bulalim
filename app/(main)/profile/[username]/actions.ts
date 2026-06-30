"use server"

import { createClient } from "@/lib/supabase/server"

interface ActionResult {
  ok: boolean
  error?: string
}

async function currentUserId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

/**
 * Arkadaş ekle. Karşı taraf bana zaten istek göndermişse (mutual add),
 * o isteği "accepted" yapar = arkadaş oluruz. Aksi halde "pending" istek açar.
 */
export async function sendFriendRequest(otherId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const me = await currentUserId()
  if (!me) return { ok: false, error: "Oturum bulunamadı" }
  if (me === otherId) return { ok: false, error: "Kendinizi ekleyemezsiniz" }

  // Karşı taraftan gelen bekleyen istek var mı? Varsa kabul et.
  const { data: incoming } = await supabase
    .from("friend_requests")
    .select("id")
    .eq("requester_id", otherId)
    .eq("addressee_id", me)
    .eq("status", "pending")
    .maybeSingle()

  if (incoming) {
    const { error } = await supabase.from("friend_requests").update({ status: "accepted" }).eq("id", incoming.id)
    return error ? { ok: false, error: error.message } : { ok: true }
  }

  const { error } = await supabase
    .from("friend_requests")
    .upsert({ requester_id: me, addressee_id: otherId, status: "pending" }, { onConflict: "requester_id,addressee_id" })
  return error ? { ok: false, error: error.message } : { ok: true }
}

/** Gelen arkadaşlık isteğini kabul et. */
export async function acceptFriendRequest(otherId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const me = await currentUserId()
  if (!me) return { ok: false, error: "Oturum bulunamadı" }

  const { error } = await supabase
    .from("friend_requests")
    .update({ status: "accepted" })
    .eq("requester_id", otherId)
    .eq("addressee_id", me)
    .eq("status", "pending")
  return error ? { ok: false, error: error.message } : { ok: true }
}

/** Arkadaşlığı veya bekleyen isteği kaldır (her iki yön). */
export async function removeFriend(otherId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const me = await currentUserId()
  if (!me) return { ok: false, error: "Oturum bulunamadı" }

  const { error } = await supabase
    .from("friend_requests")
    .delete()
    .or(
      `and(requester_id.eq.${me},addressee_id.eq.${otherId}),and(requester_id.eq.${otherId},addressee_id.eq.${me})`
    )
  return error ? { ok: false, error: error.message } : { ok: true }
}

/**
 * İki arkadaş arasındaki ilan'sız sohbeti bulur, yoksa oluşturur. Sohbet id döner.
 * Arkadaş olunduğu doğrulanır.
 */
export async function openFriendConversation(
  otherId: string
): Promise<{ ok: boolean; conversationId?: string; error?: string }> {
  const supabase = await createClient()
  const me = await currentUserId()
  if (!me) return { ok: false, error: "Oturum bulunamadı" }

  // Arkadaş mıyız?
  const { data: friendship } = await supabase
    .from("friend_requests")
    .select("id")
    .eq("status", "accepted")
    .or(
      `and(requester_id.eq.${me},addressee_id.eq.${otherId}),and(requester_id.eq.${otherId},addressee_id.eq.${me})`
    )
    .maybeSingle()
  if (!friendship) return { ok: false, error: "Mesajlaşmak için arkadaş olmalısınız" }

  // Mevcut arkadaş sohbeti var mı?
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .is("item_id", null)
    .or(
      `and(initiator_id.eq.${me},owner_id.eq.${otherId}),and(initiator_id.eq.${otherId},owner_id.eq.${me})`
    )
    .maybeSingle()
  if (existing) return { ok: true, conversationId: existing.id }

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ item_id: null, initiator_id: me, owner_id: otherId })
    .select("id")
    .single()
  if (error || !created) {
    // Yarış durumunda tekrar dene (unique index)
    const { data: retry } = await supabase
      .from("conversations")
      .select("id")
      .is("item_id", null)
      .or(
        `and(initiator_id.eq.${me},owner_id.eq.${otherId}),and(initiator_id.eq.${otherId},owner_id.eq.${me})`
      )
      .maybeSingle()
    if (retry) return { ok: true, conversationId: retry.id }
    return { ok: false, error: error?.message ?? "Sohbet oluşturulamadı" }
  }
  return { ok: true, conversationId: created.id }
}
