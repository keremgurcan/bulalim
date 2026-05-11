import { RANK_THRESHOLDS, getNextRankThreshold } from "@/lib/badges"
import { Progress } from "@/components/ui/progress"

interface RankProgressProps {
  points: number
  rank: string
}

export function RankProgress({ points, rank }: RankProgressProps) {
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
          <span className="font-bold text-lg" style={{ color }}>{rank}</span>
        </div>
        <span className="text-sm font-semibold text-[#073A30]">{points} puan</span>
      </div>
      <Progress value={progress} className="h-2" />
      {nextRank ? (
        <p className="text-xs text-[#6B7773]">
          {nextRank.rank} için {nextThreshold! - points} puan daha gerekiyor
        </p>
      ) : (
        <p className="text-xs text-[#32E1BE] font-semibold">Maksimum seviyedesin!</p>
      )}
    </div>
  )
}
