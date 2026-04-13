/**
 * Server-side in-memory room store.
 * This module is ONLY imported by API routes (runs on the server).
 * It uses a global Map so that data survives across requests
 * within the same Next.js dev/production process.
 */

import type { RoomSnapshot } from "@/lib/types";

// Attach to globalThis so the store survives HMR in dev
const globalForRooms = globalThis as unknown as {
  __roomStore?: Map<string, RoomSnapshot>;
};

if (!globalForRooms.__roomStore) {
  globalForRooms.__roomStore = new Map<string, RoomSnapshot>();
}

export const roomStore: Map<string, RoomSnapshot> = globalForRooms.__roomStore;
