import Redis from "ioredis"

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000)
      return delay
    },
    lazyConnect: true,
  })

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis

// Cache helper functions
export const cacheKeys = {
  theses: (filters?: string) => `theses:list:${filters || "all"}`,
  thesis: (slug: string) => `thesis:${slug}`,
  categories: () => "categories:all",
  thesisCount: (categoryId?: string) => `thesis:count:${categoryId || "all"}`,
}

export async function getCached<T>(key: string, fetcher: () => Promise<T>, ttl = 3600): Promise<T> {
  try {
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached)
    }

    const data = await fetcher()
    await redis.setex(key, ttl, JSON.stringify(data))
    return data
  } catch (error) {
    console.error("[Redis] Cache error:", error)
    return fetcher()
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error("[Redis] Invalidation error:", error)
  }
}
