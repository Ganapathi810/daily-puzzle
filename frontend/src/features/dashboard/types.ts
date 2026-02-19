import type { BADGE_CONFIG } from "./achievementsConfig"

export type DailyActivity = {
    userId: string,
    date: string
    solved: boolean
    score: number
    timeTaken: number
    difficulty: number
    synced: boolean
}

export type Achievement = {
    id: string,
    userId: string,
    title: string
    earnedAt: string
}

export type BadgeId = keyof typeof BADGE_CONFIG