import dayjs from "dayjs";
import { generateDailySeed } from "./seedGenerator";
import { numberMatrixEngine } from "../puzzles/NumberMatrix.ts";
import type { BasePuzzle } from "../types";

const engines = [numberMatrixEngine];

export async function generateDailyPuzzle(
  date = dayjs()
): Promise<BasePuzzle<any, any>> {
  const seed = await generateDailySeed(date);
  const formattedDate = date.format("YYYY-MM-DD");

  const engine = engines[seed % engines.length];

  return engine.generate(seed, formattedDate);
}