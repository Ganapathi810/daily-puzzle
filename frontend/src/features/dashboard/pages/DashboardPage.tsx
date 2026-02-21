import dayjs from "dayjs"
import Heatmap from "../components/Heatmap"
import StreakCounter from "../components/StreakCounter"
import { useDailyActivity } from "../hooks/useDailyActivity"
import { useStreak } from "../hooks/useStreak"
import { useAchievements } from "../hooks/useAchievements"
import AchievementSection from "../components/Achievements"
import { useDashboardMetrics } from "../hooks/useDashboardMetrics"
import { formatTime } from "../../../lib/formatTime"
import LoadingSpinner from "../../../components/LoadingSpinner"
import { Trophy } from "lucide-react"
import { MetricCard } from "../components/MetricCard"
import { useNavigate } from "react-router-dom"
import { getColor } from "../lib"
import { useEffect } from "react"
import { syncUserStatsAndUser } from "../../../lib/sync"
import type { DailyActivity } from "../types"
import { useAppSelector } from "../../../app/hooks"

export default function Dashboard() {
  const currentYear = dayjs().year()
  const navigate = useNavigate()
  const { user,isGuest } = useAppSelector((state) => state.auth)

  const { dailyActivity, loading } = useDailyActivity()
  const { currentStreak, bestStreak } = useStreak(dailyActivity)
  const { totalPoints, puzzlesSolved, averageSolveTime } = useDashboardMetrics(dailyActivity)
  const achievements = useAchievements(bestStreak, user?.id ?? '')

  

  const METRICS = [
    {
      title: "Total Points",
      value: totalPoints,
      icon: <Trophy className="size-5 sm:size-6" />
    },
    {
      title: "Puzzles Solved",
      value: puzzlesSolved,
      icon: <Trophy className="size-5 sm:size-6" />
    },
    {
      title: "Average Solve Time",
      value: formatTime(averageSolveTime),
      icon: <Trophy className="size-5 sm:size-6" />
    }
  ]

  const COLOR_INTENSITY_INFO = [
    {
      title: "Not Played",
      color: getColor(0)
    },
    {
      title: "Solved Easy ",
      color: getColor(1)
    },
    {
      title: "Solved Medium",
      color: getColor(2)
    },
    {
      title: "Solved Hard",
      color: getColor(3)
    },
    {
      title: "Perfect Score",
      color: getColor(4)
    }
  ]

  useEffect(() => {
    if (!loading) {
      if (isGuest) return
      if(totalPoints === 0 || puzzlesSolved === 0 || averageSolveTime === 0) return
      syncUserStatsAndUser(totalPoints, puzzlesSolved, averageSolveTime)
    }
  }, [dailyActivity, loading, totalPoints, puzzlesSolved, averageSolveTime])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner text="Loading dashboard..."/>
      </div>
    )
  }

  const todayActivity: DailyActivity | undefined = dailyActivity.find((activity) => activity.date === dayjs().format("YYYY-MM-DD"))

  return (
    <div className="text-white p-3 sm:p-6">

      {/* Header */}
      <div className="mb-8">
        <div className="text-2xl font-bold text-white mb-2">
          {user?.name ? <span className="flex flex-wrap items-center gap-2">Hey <span className="text-(--bg-surface)">${user.name}</span>, welcome back!</span> : <span className="flex flex-wrap items-center gap-2">Welcome back, <span className="text-(--bg-surface)">Guest!</span></span>}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Dashboard
        </h1>
        <p className="text-neutral-400 text-sm mt-1">
          Track your consistency and progress
        </p>
      </div>

      {/* Today's Challenge Section */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
        <div className="flex justify-center items-center">
          {todayActivity ? (
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-lg sm:text-xl font-bold mb-2">🧩 Today’s Challenge</h2>
              <span className="text-lg sm:text-xl font-bold">🎉 Puzzle Completed!</span>
              <span className="text-sm sm:text-base">You solved today’s puzzle in <span className="text-green-500">{formatTime(todayActivity.timeTaken)}</span> and earned <span className="text-pink-500">+{todayActivity.score} points.</span></span>
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap">
              <div>
                <h2 className="text-lg sm:text-xl font-bold mb-2">🧩 Today’s Challenge</h2>
                <p className="text-neutral-400 text-sm">✨ New Puzzle Unlocked! Ready to test your logic?</p>
              </div>
              <div className="flex items-center justify-center w-full md:w-auto">
                <button 
                  onClick={() => navigate("/play")}
                  className="cursor-pointer bg-(--bg-surface) hover:bg-(--bg-surface)/80 transition-colors duration-200  text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-md w-full md:w-auto"
                >
                  Solve Puzzle
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-3 sm:mt-0">
          <div className="flex justify-center">
            <div className="flex flex-col items-start">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Your Stats</h2>
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                {METRICS.map((metric,index) => (
                  <MetricCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    icon={metric.icon}
                  />  
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Streak and Achievements Section */}
      <section className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-5 mt-8 sm:mt-0">
        <div className="flex items-center justify-center">
          <StreakCounter
            currentStreak={currentStreak}
            bestStreak={bestStreak}
          />
        </div>

        <AchievementSection
          achievements={achievements}
        />
      </section>  

      {/* Heatmap Section */}
      <section className="flex justify-center mt-5">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-start">Daily Activity</h2>
          <div className="flex flex-col gap-4 bg-[#03162c] rounded-md p-4 max-w-[90vw]">
            <div className="overflow-x-auto">
              <Heatmap
                year={currentYear}
                dailyActivity={dailyActivity}
              />
            </div>
            <div className="flex justify-end">
              <div className="flex flex-wrap items-center gap-3 max-w-2xl">
                {COLOR_INTENSITY_INFO.map((info) => (
                  <div
                    key={info.title}
                    className="flex items-center mr-4"
                  >
                    <div
                      className={`w-4 h-4 rounded-md mr-2 ${info.color}`}
                    />
                    <span className="text-sm">{info.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
