export type BadgeType =
  | "item_hunter"
  | "detective"
  | "helper"
  | "saha_dedektifi"
  | "gonullu_bulucu"

export interface BadgeMeta {
  label: string
  description: string
  /** How to earn it (shown when locked) */
  howTo: string
}

/**
 * The five badges shown in the "Haftanın Kahramanları" and profile
 * "Rozet Vitrini" sections. SVG art lives in components/brand/BadgeIcon.tsx.
 */
export const BADGE_META: Record<BadgeType, BadgeMeta> = {
  item_hunter: {
    label: "Item Hunter",
    description: "İlk ilanını verdin ve avcılığa başladın.",
    howTo: "İlk ilanını ver.",
  },
  helper: {
    label: "Helper",
    description: "Bir eşyayı sahibine kavuşturdun.",
    howTo: "1 eşyayı sahibine kavuştur.",
  },
  detective: {
    label: "Detective",
    description: "5 eşyayı sahibine kavuşturan usta dedektif.",
    howTo: "5 eşyayı sahibine kavuştur.",
  },
  saha_dedektifi: {
    label: "Saha Dedektifi",
    description: "10+ eşyayı bulan saha kahramanı.",
    howTo: "10 eşyayı sahibine kavuştur.",
  },
  gonullu_bulucu: {
    label: "Gönüllü Bulucu",
    description: "e-Devlet onaylı, güvenilir gönüllü bulucu.",
    howTo: "Kimliğini e-Devlet ile doğrula.",
  },
}

export const ALL_BADGES = Object.keys(BADGE_META) as BadgeType[]

/** "Haftanın Kahramanları" sırasında öne çıkan üç rozet. */
export const FEATURED_BADGES: BadgeType[] = ["item_hunter", "detective", "helper"]

export interface BadgeStats {
  itemCount: number
  resolvedCount: number
  isVerified: boolean
}

/** Derives earned badges from profile activity (no DB table needed). */
export function getEarnedBadges({ itemCount, resolvedCount, isVerified }: BadgeStats): BadgeType[] {
  const earned: BadgeType[] = []
  if (itemCount >= 1) earned.push("item_hunter")
  if (resolvedCount >= 1) earned.push("helper")
  if (resolvedCount >= 5) earned.push("detective")
  if (resolvedCount >= 10) earned.push("saha_dedektifi")
  if (isVerified) earned.push("gonullu_bulucu")
  return earned
}

export type Rank = "Yeni Üye" | "Yardımsever" | "Dedektif" | "Kahraman" | "Efsane"

export const RANK_THRESHOLDS: Array<{ min: number; rank: Rank; color: string }> = [
  { min: 0, rank: "Yeni Üye", color: "#6B7773" },
  { min: 50, rank: "Yardımsever", color: "#32E1BE" },
  { min: 200, rank: "Dedektif", color: "#073A30" },
  { min: 500, rank: "Kahraman", color: "#FFD66B" },
  { min: 1000, rank: "Efsane", color: "#32E1BE" },
]

export function getRankForPoints(points: number): Rank {
  let rank: Rank = "Yeni Üye"
  for (const threshold of RANK_THRESHOLDS) {
    if (points >= threshold.min) rank = threshold.rank
  }
  return rank
}

export function getNextRankThreshold(points: number): number | null {
  for (const threshold of RANK_THRESHOLDS) {
    if (points < threshold.min) return threshold.min
  }
  return null
}

export const POINTS = {
  POST_LOST: 5,
  POST_FOUND: 10,
  SUCCESSFUL_RETURN: 50,
  THANK_YOU: 20,
  DAILY_LOGIN: 1,
  FAST_REPLY: 5,
}
