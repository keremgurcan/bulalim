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
// parçaları atar, benzersiz kelime kümesi döndürür.
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLocaleLowerCase("tr-TR")
      .split(/[^\p{L}\p{N}]+/u)
      .map((w) => w.trim())
      .filter((w) => w.length >= 2 && !TURKISH_STOPWORDS.has(w))
  )
}

// İki kelime kümesinin örtüşme oranı (0–1). Overlap katsayısı baskın; kısa ama
// birebir örtüşen metinler ("airpods" ↔ "airpods") yüksek skor alır.
function setSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  let shared = 0
  for (const word of a) {
    if (b.has(word)) shared++
  }
  const overlap = shared / Math.min(a.size, b.size)
  const jaccard = shared / (a.size + b.size - shared)
  return 0.7 * overlap + 0.3 * jaccard
}

// İki ilanın başlık + açıklamasındaki ortak kelime oranı (0–1).
export function computeTextSimilarity(
  item: Pick<MatchableItem, "title" | "description">,
  candidate: Pick<MatchableItem, "title" | "description">
): number {
  const a = tokenize(`${item.title ?? ""} ${item.description ?? ""}`)
  const b = tokenize(`${candidate.title ?? ""} ${candidate.description ?? ""}`)
  return setSimilarity(a, b)
}

export function computeSimilarityScore(
  item: MatchableItem,
  candidate: MatchableItem
): number {
  // Başlık eşleşmesi ANA sinyal: "airpods" ↔ "airpods" tek başına eşleşmeyi taşır.
  const titleSim = setSimilarity(tokenize(item.title ?? ""), tokenize(candidate.title ?? ""))
  // Başlık + açıklama birlikte: destekleyici metin sinyali.
  const textSim = computeTextSimilarity(item, candidate)
  const categoryMatch = item.category === candidate.category ? 1 : 0
  // Mesafe yumuşak: şehir içi farklı semtler eşleşmeyi öldürmesin (50 km'ye yay).
  const distanceKm = haversineDistance(item.lat, item.lng, candidate.lat, candidate.lng)
  const distanceScore = Math.max(0, 1 - distanceKm / 50)
  const dateDiff = Math.abs(
    (new Date(item.date_lost_or_found).getTime() -
      new Date(candidate.date_lost_or_found).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  const dateScore = Math.max(0, 1 - dateDiff / 30)
  return (
    0.5 * titleSim +
    0.2 * textSim +
    0.15 * categoryMatch +
    0.1 * distanceScore +
    0.05 * dateScore
  )
}

// %50 ve üzeri eşleşmelerde kullanıcılar eşleştirilip sohbet otomatik açılır.
export const MATCH_THRESHOLD = 0.5
export const MAX_DISTANCE_KM = 50
export const MAX_DATE_DIFF_DAYS = 30
