export type BadgeType =
  | "first_post"
  | "first_match"
  | "helper_5"
  | "detective_10"
  | "hero_25"
  | "legend_50"
  | "fast_responder"
  | "verified"
  | "community_pillar"

export const BADGE_META: Record<BadgeType, { label: string; description: string; icon: string }> = {
  first_post: { label: "İlk Adım", description: "İlk ilanını verdin", icon: "🌱" },
  first_match: { label: "İlk Buluşma", description: "İlk eşleşmeni sağladın", icon: "🤝" },
  helper_5: { label: "Yardımsever", description: "5 eşya kavuşturuldu", icon: "⭐" },
  detective_10: { label: "Dedektif", description: "10 eşya kavuşturuldu", icon: "🔍" },
  hero_25: { label: "Kahraman", description: "25 eşya kavuşturuldu", icon: "🦸" },
  legend_50: { label: "Efsane", description: "50 eşya kavuşturuldu", icon: "🏆" },
  fast_responder: { label: "Hızlı Yanıtçı", description: "10 mesaja 1 saat içinde yanıt", icon: "⚡" },
  verified: { label: "Doğrulanmış", description: "Kimlik doğrulaması tamamlandı", icon: "✅" },
  community_pillar: { label: "Topluluk Direği", description: "30+ gün aktif üye", icon: "🏛️" },
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
