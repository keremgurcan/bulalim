import { haversineDistance } from "./geo"

interface MatchableItem {
  id: string
  category: string
  lat: number
  lng: number
  date_lost_or_found: string
}

export function computeSimilarityScore(
  item: MatchableItem,
  candidate: MatchableItem
): number {
  const categoryMatch = item.category === candidate.category ? 1 : 0
  const distanceKm = haversineDistance(item.lat, item.lng, candidate.lat, candidate.lng)
  const distanceScore = Math.max(0, 1 - distanceKm / 5)
  const dateDiff = Math.abs(
    (new Date(item.date_lost_or_found).getTime() -
      new Date(candidate.date_lost_or_found).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  const dateScore = Math.max(0, 1 - dateDiff / 7)
  return 0.4 * categoryMatch + 0.3 * distanceScore + 0.3 * dateScore
}

export const MATCH_THRESHOLD = 0.6
export const MAX_DISTANCE_KM = 5
export const MAX_DATE_DIFF_DAYS = 7
