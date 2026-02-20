// controllers/sync.controller.ts
import { prisma } from "../prisma/client.js"

export const syncDailyScores = async (req, res) => {
console.log('inside sync controller')
  try {
    const userId = req.userId 
    console.log("userid in sesson",userId)
    const { entries } = req.body

    if (!entries || !Array.isArray(entries)) {
      return res.status(400).json({
        success: false,
        error: "Invalid payload"
      })
    }

    for (const entry of entries) {
      const { date, score, timeTaken } = entry

      if (!date || score == null || timeTaken == null) {
        continue
      }

      await prisma.dailyScore.upsert({
        where: {
          userId_date: {
            userId,
            date: new Date(date),
          },
        },
        update: {
          score,
          timeTaken,
        },
        create: {
          userId,
          date: new Date(date),
          score,
          timeTaken,
        },
      })

    }

    return res.status(200).json({
      success: true,
    })

  } catch (error) {
    console.error("Sync error:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to sync daily scores"
    })
  }
}

export const syncUserStatsAndUser = async (req, res) => {
  try {
    const userId = req.userId 
    const { totalPoints, puzzlesSolved, averageSolveTime } = req.body

    if (!totalPoints || !puzzlesSolved || !averageSolveTime) {
      return res.status(400).json({
        success: false,
        error: "Invalid payload"
      })
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        totalPoints,
      },
    })

    await prisma.userStats.upsert({
      where: {
        userId: userId,
      },
      update: {
        puzzlesSolved,
        avgSolveTime: averageSolveTime,
      },
      create: {
        userId,
        puzzlesSolved,
        avgSolveTime: averageSolveTime,
      },
    })

    return res.status(200).json({
      success: true,
    })

  } catch (error) {
    console.error("Sync error:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to sync user stats"
    })
  }
}


