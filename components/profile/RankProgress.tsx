import { RANK_THRESHOLDS, getNextRankThreshold } from "@/lib/badges"
import { Progress } from "@/components/ui/progress"
import { useT } from "@/components/i18n/LocaleProvider"

interface RankProgressProps {
  points: number
  rank: string
}

export function RankProgress({ points, rank }: RankProgressProps) {
  const dict = useT()
  const nextThreshold = getNextRankThreshold(points)
  const currentThreshold = RANK_THRESHOLDS.findLast((t) => points >= t.min)
  const prevMin = currentThreshold?.min ?? 0
  const color = currentThreshold?.color ?? "#6B7773"

  let progress = 100
  if (nextThreshold) {
    const range = nextThreshold - prevMin
    progress = Math.round(((points - prevMin) / range) * 100)
  }

  const nextRank = RANK_THRESHOLDS.find((t) => t.min === nextThreshold)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg" style={{ color }}>{dict.ranks[rank] ?? rank}</span>
        </div>
        <span className="text-sm font-semibold text-[#073A30]">{points} {dict.profile.statPoints.toLowerCase()}</span>
      </div>
      <Progress value={progress} className="h-2" />
      {nextRank ? (
        <p className="text-xs text-[#6B7773]">
          {dict.profile.pointsToNext
            .replace("{rank}", dict.ranks[nextRank.rank] ?? nextRank.rank)
            .replace("{n}", String(nextThreshold! - points))}
        </p>
      ) : (
        <p className="text-xs text-[#32E1BE] font-semibold">{dict.profile.maxLevel}</p>
      )}
    </div>
  )
}
