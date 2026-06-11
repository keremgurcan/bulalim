import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { computeSimilarityScore, MATCH_THRESHOLD } from "@/lib/matching"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { item_id } = await req.json()

  if (!item_id) {
    return NextResponse.json({ error: "item_id required" }, { status: 400 })
  }

  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", item_id)
    .single()

  if (error || !item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }

  const oppositeType = item.type === "lost" ? "found" : "lost"

  // Sözcük uyumuna göre eşleştir: zıt türdeki tüm aktif ilanları aday al
  // (kategori/mesafe/tarih filtresi yok).
  const { data: candidates } = await supabase
    .from("items")
    .select("*")
    .eq("type", oppositeType)
    .eq("status", "active")
    .neq("id", item_id)

  if (!candidates || candidates.length === 0) {
    return NextResponse.json({ matches: [] })
  }

  const matches = []
  for (const candidate of candidates) {
    const score = computeSimilarityScore(item, candidate)
    if (score >= MATCH_THRESHOLD) {
      matches.push({ candidate_id: candidate.id, score })
    }
  }

  const insertData = matches.map((m) => ({
    lost_item_id: item.type === "lost" ? item_id : m.candidate_id,
    found_item_id: item.type === "found" ? item_id : m.candidate_id,
    similarity_score: m.score,
    status: "pending",
  }))

  if (insertData.length > 0) {
    await supabase.from("matches").upsert(insertData, { onConflict: "lost_item_id,found_item_id" })
  }

  return NextResponse.json({ matches: insertData.length })
}
