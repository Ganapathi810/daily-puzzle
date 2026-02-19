// import { openDatabase, STORE_PROGRESS } from "./db";

// export interface DailyProgress {
//   date: string;
//   puzzleId: string;
//   completed: boolean;
//   timeTaken: number;
//   currentGrid: (number | null)[][];
// }

// export async function saveDailyProgress(
//   progress: DailyProgress
// ): Promise<void> {
//   const db = await openDatabase();

//   return new Promise((resolve, reject) => {
//     const tx = db.transaction(STORE_PROGRESS, "readwrite");
//     const store = tx.objectStore(STORE_PROGRESS);

//     store.put(progress);

//     tx.oncomplete = () => resolve();
//     tx.onerror = () => reject(tx.error);
//   });
// }

// export async function getDailyProgress(
//   date: string
// ): Promise<DailyProgress | null> {
//   const db = await openDatabase();

//   return new Promise((resolve, reject) => {
//     const tx = db.transaction(STORE_PROGRESS, "readonly");
//     const store = tx.objectStore(STORE_PROGRESS);

//     const request = store.get(date);

//     request.onsuccess = () => {
//       resolve(request.result ?? null);
//     };

//     request.onerror = () => reject(request.error);
//   });
// }

// export async function deleteDailyProgress(
//   date: string
// ): Promise<void> {
//   const db = await openDatabase();

//   return new Promise((resolve, reject) => {
//     const tx = db.transaction(STORE_PROGRESS, "readwrite");
//     const store = tx.objectStore(STORE_PROGRESS);

//     store.delete(date);

//     tx.oncomplete = () => resolve();
//     tx.onerror = () => reject(tx.error);
//   });
// }
