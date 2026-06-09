import { ALL_BADGES, BADGE_META } from "@/lib/badges"
import type { BadgeType } from "@/lib/badges"
import { BadgeIcon } from "@/components/brand/BadgeIcon"

interface BadgeGridProps {
  earnedBadges: BadgeType[]
}

export function BadgeGrid({ earnedBadges }: BadgeGridProps) {
  const earnedSet = new Set(earnedBadges)

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {ALL_BADGES.map((key) => {
        const meta = BADGE_META[key]
        const earned = earnedSet.has(key)
        return (
          <div
            key={key}
            title={earned ? meta.description : `Nasıl Kazanılır: ${meta.howTo}`}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all ${
              earned
                ? "border-[#32E1BE] bg-[#32E1BE]/5 shadow-sm"
                : "border-[#E8EDEB] bg-[#F7F9F8]"
            }`}
          >
            <BadgeIcon badge={key} size={56} earned={earned} />
            <span className="text-xs font-semibold text-[#073A30] leading-tight">{meta.label}</span>
            {!earned && <span className="text-[10px] text-[#6B7773]">Kilitli</span>}
          </div>
        )
      })}
    </div>
  )
}
