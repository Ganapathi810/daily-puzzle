import type { Achievement, DailyActivity } from "../../features/dashboard/types";
import type { PuzzleProgress } from "../types";

const DB_NAME = "daily-puzzle-db";
const DB_VERSION = 5; 

const STORE_DAILY_ACTIVITY = "dailyActivity";
const STORE_PUZZLE_PROGRESS = "puzzleProgress";
const STORE_ACHIEVEMENTS = "achievements";

/* =====================================================
   OPEN DATABASE
===================================================== */

export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      // DAILY ACTIVITY
      if (!db.objectStoreNames.contains(STORE_DAILY_ACTIVITY)) {
        const store = db.createObjectStore(STORE_DAILY_ACTIVITY, {
          keyPath: ["userId", "date"], 
        });

        store.createIndex("userId", "userId", { unique: false });
      }

      // PUZZLE PROGRESS
      if (!db.objectStoreNames.contains(STORE_PUZZLE_PROGRESS)) {
        const store = db.createObjectStore(STORE_PUZZLE_PROGRESS, {
          keyPath: ["userId", "date"], 
        });

        store.createIndex("userId", "userId", { unique: false });
      }

      // ACHIEVEMENTS
      if (!db.objectStoreNames.contains(STORE_ACHIEVEMENTS)) {
        const store = db.createObjectStore(STORE_ACHIEVEMENTS, {
          keyPath: ["userId", "id"], 
        });

        store.createIndex("userId", "userId", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/* =====================================================
   DAILY ACTIVITY
===================================================== */

export const getDailyActivity = async (
  userId: string,
  date: string
): Promise<DailyActivity | undefined> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DAILY_ACTIVITY, "readonly");
    const store = tx.objectStore(STORE_DAILY_ACTIVITY);

    const request = store.get([userId, date]);

    request.onsuccess = () =>
      resolve(request.result as DailyActivity | undefined);

    request.onerror = () => reject(request.error);
  });
};

export const getAllDailyActivity = async (
  userId: string
): Promise<DailyActivity[]> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DAILY_ACTIVITY, "readonly");
    const store = tx.objectStore(STORE_DAILY_ACTIVITY);
    const index = store.index("userId");

    const request = index.getAll(userId);

    request.onsuccess = () =>
      resolve(request.result as DailyActivity[]);

    request.onerror = () => reject(request.error);
  });
};

export const saveDailyActivity = async (
  activity: DailyActivity
): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DAILY_ACTIVITY, "readwrite");
    const store = tx.objectStore(STORE_DAILY_ACTIVITY);

    const request = store.put(activity); // upsert

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/* =====================================================
   PUZZLE PROGRESS
===================================================== */

export const savePuzzleProgress = async (
  progress: PuzzleProgress
): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PUZZLE_PROGRESS, "readwrite");
    const store = tx.objectStore(STORE_PUZZLE_PROGRESS);

    const request = store.put(progress);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getPuzzleProgress = async (
  userId: string,
  date: string
): Promise<PuzzleProgress | undefined> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PUZZLE_PROGRESS, "readonly");
    const store = tx.objectStore(STORE_PUZZLE_PROGRESS);

    const request = store.get([userId, date]);

    request.onsuccess = () =>
      resolve(request.result as PuzzleProgress | undefined);

    request.onerror = () => reject(request.error);
  });
};

export const deletePuzzleProgress = async (
  userId: string,
  date: string
): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PUZZLE_PROGRESS, "readwrite");
    const store = tx.objectStore(STORE_PUZZLE_PROGRESS);

    const request = store.delete([userId, date]);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/* =====================================================
   SYNC HELPERS
===================================================== */

export async function getUnsyncedDailyActivity(
  userId: string
): Promise<DailyActivity[]> {
  const all = await getAllDailyActivity(userId);

  return all.filter(
    entry => entry.synced === false && entry.solved === true
  );
}

export async function markEntriesAsSynced(
  entries: DailyActivity[]
) {
  for (const entry of entries) {
    await saveDailyActivity({
      ...entry,
      synced: true,
    });
  }
}

/* =====================================================
   ACHIEVEMENTS
===================================================== */

export const saveAchievement = async (
  achievement: Achievement
): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ACHIEVEMENTS, "readwrite");
    const store = tx.objectStore(STORE_ACHIEVEMENTS);

    const request = store.put(achievement);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAllAchievements = async (
  userId: string
): Promise<Achievement[]> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ACHIEVEMENTS, "readonly");
    const store = tx.objectStore(STORE_ACHIEVEMENTS);
    const index = store.index("userId");

    const request = index.getAll(userId);

    request.onsuccess = () =>
      resolve(request.result as Achievement[]);

    request.onerror = () => reject(request.error);
  });
};
