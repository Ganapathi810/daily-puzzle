import { prisma } from "../prisma/client.js";

export const getDailyScores = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const response = await prisma.dailyScore.findMany({
            take: Number(limit),
            skip: Number(offset),
            orderBy: {
                score: 'desc',
            },
        });

        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: response.map((item) => item.userId),
                },
            },
            select: {
                id: true,
                email: true,
            },
        });

        const result = response.map((item) => {
            const user = users.find((user) => user.id === item.userId);
            return {
                ...item,
                email: user?.email,
            };
        });
        
        const total = await prisma.dailyScore.count();
        res.json({ data: result, total, page, limit });
    } catch (error) {
        console.log("Server error: ", error);
        res.status(500).json({ message: 'Failed to get daily scores' });
    }
}

export const getLifetimeScores = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        const users = await prisma.user.findMany({
            take: Number(limit),
            skip: Number(offset),
            orderBy: {
                totalPoints: 'desc',
            },
        });

        const allUsersStats = await prisma.userStats.findMany({
            where: {
                userId: {
                    in: users.map((user) => user.id),
                },
            },
            select: {
                userId: true,
                puzzlesSolved: true,
                avgSolveTime: true,
            },
        });

        const result = users.map((user) => {
            const userWithStats = allUsersStats.find((userStats) => userStats.userId === user.id);
            return {
                ...user,
                puzzlesSolved: userWithStats?.puzzlesSolved,
                avgSolveTime: userWithStats?.avgSolveTime,
            };
        })
        
        const total = await prisma.user.count();
        res.json({ data: result, total, page, limit });
    } catch (error) {
        console.log("Server error: ", error);
        res.status(500).json({ message: 'Failed to get lifetime scores' });
    }
}