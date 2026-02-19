import axios from 'axios';
import type { DailyScoreEntry, LifetimeScoreEntry, PaginatedResponse } from './types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000/';


export const fetchDailyScores = async (page = 1, limit = 20): Promise<PaginatedResponse<DailyScoreEntry>> => {
  const res = await axios.get(`${SERVER_URL}/leaderboard/scores/daily?page=${page}&limit=${limit}`);
  return res.data;
};

export const fetchLifetimeScores = async (page = 1, limit = 20): Promise<PaginatedResponse<LifetimeScoreEntry>> => {
    const res = await axios.get(`${SERVER_URL}/leaderboard/scores/lifetime?page=${page}&limit=${limit}`);
    return res.data;
};