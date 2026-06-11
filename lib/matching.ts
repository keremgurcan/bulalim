import { haversineDistance } from "./geo"

interface MatchableItem {
  id: string
  category: string
  lat: number
  lng: number
  date_lost_or_found: string
  title?: string
  description?: string
}

// Yaygın Türkçe durak kelimeleri — eşleşme skorunu şişirmesinler diye ayıklanır.
const TURKISH_STOPWORDS = new Set([
  "ve", "ile", "bir", "bu", "şu", "o", "için", "gibi", "çok", "daha", "en",
  "de", "da", "ki", "mi", "mı", "mu", "mü", "ne", "ya", "veya", "ama", "fakat",
  "ben", "sen", "biz", "siz", "onlar", "var", "yok", "olan", "olarak", "ise",
  "the", "a", "an", "of", "to", "in", "on", "at", "renk", "rengi", "renkli",
])

// Metni Türkçe-duyarlı şekilde kelimelere böler, durak kelimeleri ve kısa
// parçaları atar, benzersiz kök kelime kümesi döndürür.
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLocaleLowerCase("tr-TR")
      .split(/[^\p{L}\p{N}]+/u)
      .map((w) => w.trim())
      .filter((w) => w.length >= 2 && !TURKISH_STOPWORDS.has(w))
  )
}

// İki ilanın başlık + açıklamasındaki ortak kelime oranı (0–1).
// Daha kısa metnin kaç kelimesinin diğerinde geçtiğine bakılır (overlap katsayısı),
// böylece "siyah hırka" gibi kısa ama birebir örtüşen ilanlar yüksek skor alır.
export function computeTextSimilarity(
  item: Pick<MatchableItem, "title" | "description">,
  candidate: Pick<MatchableItem, "title" | "description">
): number {
  const a = tokenize(`${item.title ?? ""} ${item.description ?? ""}`)
  const b = tokenize(`${candidate.title ?? ""} ${candidate.description ?? ""}`)
  if (a.size === 0 || b.size === 0) return 0

  let shared = 0
  for (const word of a) {
    if (b.has(word)) shared++
  }

  const overlap = shared / Math.min(a.size, b.size)
  const jaccard = shared / (a.size + b.size - shared)
  // Overlap'i baskın tutup Jaccard ile dengeleyerek istikrarlı bir oran üretir.
  return 0.7 * overlap + 0.3 * jaccard
}

export function computeSimilarityScore(
  item: MatchableItem,
  candidate: MatchableItem
): number {
  // Kelime eşleşmesi ana sinyal; kategori/konum/tarih destekleyici sinyaller.
  const textScore = computeTextSimilarity(item, candidate)
  const categoryMatch = item.category === candidate.category ? 1 : 0
  const distanceKm = haversineDistance(item.lat, item.lng, candidate.lat, candidate.lng)
  const distanceScore = Math.max(0, 1 - distanceKm / 5)
  const dateDiff = Math.abs(
    (new Date(item.date_lost_or_found).getTime() -
      new Date(candidate.date_lost_or_found).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  const dateScore = Math.max(0, 1 - dateDiff / 7)
  return 0.6 * textScore + 0.15 * categoryMatch + 0.15 * distanceScore + 0.1 * dateScore
}

// %50 ve üzeri eşleşmelerde kullanıcılar eşleştirilip sohbet açılabilir.
export const MATCH_THRESHOLD = 0.5
export const MAX_DISTANCE_KM = 5
export const MAX_DATE_DIFF_DAYS = 7
