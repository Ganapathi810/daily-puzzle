import { Fireflame } from "./Fireflame"

type StreakCounterProps = {
  currentStreak: number
  bestStreak: number
}

export default function StreakCounter({
  currentStreak,
  bestStreak,
}: StreakCounterProps) {

  return (
    <div className="flex items-center gap-3 sm:gap-6">

      {/* Current Streak */}
      <div className="flex items-center gap-3">
        <Fireflame color="red" />
        <span className="flex flex-col items-start text-sm md:text-lg text-white font-semibold">
          <span>Current Streak</span>
          <span className="text-orange-500">{currentStreak} Day{currentStreak !== 1 && "s"}</span>
        </span>
      </div>

      {/* Best Streak */}
      <div className="flex items-center gap-2">
        <Fireflame color="blue" />
        <span className="flex flex-col items-start text-sm md:text-lg text-white font-semibold">
          <span>Best Streak</span>
          <span className="text-violet-600">{bestStreak} Day{bestStreak !== 1 && "s"}</span>
        </span>
      </div>

    </div>
  )
}