import { BADGE_META } from "@/lib/badges"
import type { BadgeType } from "@/lib/badges"

interface BadgeGridProps {
  earnedBadges: BadgeType[]
}

export function BadgeGrid({ earnedBadges }: BadgeGridProps) {
  const earnedSet = new Set(earnedBadges)
  const allBadges = Object.entries(BADGE_META) as [BadgeType, (typeof BADGE_META)[BadgeType]][]

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {allBadges.map(([key, meta]) => {
        const earned = earnedSet.has(key)
        return (
          <div
            key={key}
            title={earned ? meta.description : `Nasıl Kazanılır: ${meta.description}`}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
              earned
                ? "border-[#32E1BE] bg-[#32E1BE]/5"
                : "border-[#E8EDEB] bg-[#F7F9F8] opacity-50 grayscale"
            }`}
          >
            <span className="text-3xl">{meta.icon}</span>
            <span className="text-xs font-semibold text-[#073A30] leading-tight">{meta.label}</span>
            {!earned && <span className="text-[10px] text-[#6B7773]">Kilitli</span>}
          </div>
        )
      })}
    </div>
  )
}
