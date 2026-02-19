import dayjs from "dayjs";

// IMPORTANT: Replace this secret key with your own.
// In a client‑side app, the key is visible, but it still prevents casual prediction.
// For production, consider generating seeds on a server and sending them to the client.
const SECRET_KEY = "your-secret-key-change-this";

export async function generateDailySeed(date?: dayjs.Dayjs): Promise<number> {
  const today = (date ?? dayjs()).format("YYYY-MM-DD");
  const encoder = new TextEncoder();
  const data = encoder.encode(today + SECRET_KEY);

  // Use Web Crypto API to compute SHA‑256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert first 4 bytes (32 bits) to an unsigned 32‑bit integer (big‑endian)
  const hashArray = new Uint8Array(hashBuffer);
  const seed = new DataView(hashArray.buffer).getUint32(0, false); // false = big‑endian

  return seed;
}