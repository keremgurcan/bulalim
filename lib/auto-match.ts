import type { SupabaseClient } from "@supabase/supabase-js"
import { computeSimilarityScore, MATCH_THRESHOLD } from "@/lib/matching"

interface MatchItem {
  id: string
  user_id: string
  type: "lost" | "found"
  title: string
  description: string
  category: string
  lat: number
  lng: number
  date_lost_or_found: string
}

interface PairMatch {
  other: MatchItem
  found: MatchItem
  lost: MatchItem
  score: number
}

const ITEM_FIELDS = "id, user_id, type, title, description, category, lat, lng, date_lost_or_found"

// Giriş yapan kullanıcının aktif ilanlarını, diğer kullanıcıların zıt türdeki
// aktif ilanlarıyla kelime bazlı eşleştirir. %50+ eşleşmeler için (yoksa) sohbet
// oluşturur, açılış mesajını bırakır ve en yüksek skorlu eşleşmenin conversation
// id'sini döndürür — böylece sağ taraftaki panel otomatik açılabilir.
export async function syncTopMatchConversation(
  supabase: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data: myItems } = await supabase
    .from("items")
    .select(ITEM_FIELDS)
    .eq("user_id", userId)
    .eq("status", "active")
  if (!myItems?.length) return null

  const { data: others } = await supabase
    .from("items")
    .select(ITEM_FIELDS)
    .eq("status", "active")
    .neq("user_id", userId)
    .limit(200)
  if (!others?.length) return null

  const matches: PairMatch[] = []
  for (const mine of myItems as MatchItem[]) {
    for (const other of others as MatchItem[]) {
      if (mine.type === other.type) continue // kayıp ↔ buluntu olmalı
      const score = computeSimilarityScore(mine, other)
      if (score < MATCH_THRESHOLD) continue
      matches.push({
        other,
        found: mine.type === "found" ? mine : other,
        lost: mine.type === "lost" ? mine : other,
        score,
      })
    }
  }
  if (!matches.length) return null
  matches.sort((a, b) => b.score - a.score)

  let topConvId: string | null = null
  for (const match of matches) {
    const convId = await ensureConversation(supabase, userId, match)
    if (convId && !topConvId) topConvId = convId
  }
  return topConvId
}

async function ensureConversation(
  supabase: SupabaseClient,
  userId: string,
  match: PairMatch,
): Promise<string | null> {
  // Sohbet, kanonik olarak buluntu ilanı üzerinden açılır; böylece iki taraf da
  // aynı ilan + aynı kişi çifti için aynı conversation'ı bulur (çift kayıt olmaz).
  const itemId = match.found.id
  const otherId = match.other.user_id

  // İki yönde de mevcut bir sohbet var mı? (RLS: taraflardan biriysem görebilirim.)
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("item_id", itemId)
    .or(
      `and(initiator_id.eq.${userId},owner_id.eq.${otherId}),and(initiator_id.eq.${otherId},owner_id.eq.${userId})`,
    )
    .limit(1)
    .maybeSingle()
  if (existing) return existing.id as string

  // RLS, initiator_id = auth.uid() şartı koyar; o yüzden mevcut kullanıcı initiator.
  const { data: conv, error } = await supabase
    .from("conversations")
    .insert({ item_id: itemId, initiator_id: userId, owner_id: otherId })
    .select("id")
    .single()
  if (error || !conv) return null

  const pct = Math.round(match.score * 100)
  const iAmFinder = match.found.user_id === userId
  const content = iAmFinder
    ? `Merhaba! Sistem bizi %${pct} eşleştirdi — bulduğum "${match.found.title}", kaybettiğin "${match.lost.title}" ile eşleşiyor. Eşyan bende olabilir 🙂`
    : `Merhaba! Sistem bizi %${pct} eşleştirdi — kaybettiğim "${match.lost.title}", bulduğun "${match.found.title}" ile eşleşiyor. Eşyam sende olabilir mi?`

  await supabase.from("messages").insert({
    conversation_id: conv.id,
    sender_id: userId,
    content,
  })
  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conv.id)

  return conv.id as string
}
