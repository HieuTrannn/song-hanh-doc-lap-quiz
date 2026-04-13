/**
 * Server-side room store backed by Upstash Redis.
 * 
 * This replaces the in-memory Map so that room data persists
 * across Vercel serverless function instances.
 * 
 * Each room is stored as a JSON string with key "room:{code}".
 * Rooms auto-expire after 3 hours to prevent stale data.
 */

import { Redis } from "@upstash/redis";
import type { RoomSnapshot } from "@/lib/types";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ROOM_PREFIX = "room:";
const ROOM_TTL_SECONDS = 3 * 60 * 60; // 3 hours

export async function getRoom(roomCode: string): Promise<RoomSnapshot | null> {
  const data = await redis.get<RoomSnapshot>(`${ROOM_PREFIX}${roomCode}`);
  return data ?? null;
}

export async function saveRoom(snapshot: RoomSnapshot): Promise<void> {
  await redis.set(`${ROOM_PREFIX}${snapshot.roomCode}`, snapshot, {
    ex: ROOM_TTL_SECONDS,
  });
}

export async function deleteRoom(roomCode: string): Promise<void> {
  await redis.del(`${ROOM_PREFIX}${roomCode}`);
}
