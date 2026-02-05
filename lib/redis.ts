import Redis from "ioredis"

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableOfflineQueue: false,
    connectTimeout: 2000,
    commandTimeout: 2000,
    retryStrategy: (times) => {
      if (times > 2) {
        return null // Stop retrying after 2 attempts
      }
      return null // Don't retry automatically
    },
    showFriendlyErrorStack: false,
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
    // Check if Redis is connected
    if (redis.status !== 'ready' && redis.status !== 'connect') {
      return fetcher()
    }
    
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached)
    }

    const data = await fetcher()
    
    // Only cache if Redis is ready
    if (redis.status === 'ready') {
      await redis.setex(key, ttl, JSON.stringify(data))
    }
    
    return data
  } catch (error) {
    console.error("[Redis] Cache error:", error)
    // Always fallback to fetcher on error
    return fetcher()
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    // Check if Redis is connected
    if (redis.status !== 'ready') {
      return
    }
    
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error("[Redis] Invalidation error:", error)
    // Silently fail - cache invalidation is not critical
  }
}
