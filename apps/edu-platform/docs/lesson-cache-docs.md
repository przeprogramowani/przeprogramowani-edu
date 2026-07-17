# Lesson Cache Documentation

## Overview

The lesson cache system uses Cloudflare KV to cache lesson content fetched from the Circle Admin API V2. This reduces API calls and improves response times for frequently accessed lessons.

## Architecture

### Components

1. **Cache Module** (`src/server/circle/lessonCache.ts`)
   - Handles all KV operations for lesson caching
   - Manages cache keys, TTL checking, and cache invalidation

2. **Circle Client** (`src/server/circle/circleClient.ts`)
   - Integrates cache checking before API calls
   - Implements background refresh for stale cache entries

3. **Environment Configuration** (`astro-env.ts`)
   - Defines configurable TTL for cache freshness

## Configuration

### Environment Variables

Add the following to your environment configuration:

```bash
# Cache TTL in hours (optional, defaults to 24 hours)
LESSON_CACHE_TTL_HOURS=24
```

### Cloudflare KV Setup

1. Create a KV namespace in your Cloudflare dashboard
2. Update `wrangler.toml` with your KV namespace ID:

```toml
kv_namespaces = [
  { binding = "MAGIC_LINKS", id = "a67fe4e98cbd459088d056668f9fe302" },
  { binding = "PLATFORM_LESSON_CACHE", id = "YOUR_PLATFORM_LESSON_CACHE_KV_ID" },
]
```

3. For local development, you can use Wrangler's local KV:
```bash
wrangler kv:namespace create "PLATFORM_LESSON_CACHE" --preview
```

## How It Works

### Cache Flow

1. **Cache Hit (Fresh)**
   - Returns cached content immediately
   - No API call to Circle
   - Fastest response time

2. **Cache Hit (Stale)**
   - Cache returns null (treated as cache miss)
   - Fetches fresh content from Circle API
   - Updates cache before returning
   - User waits but gets fresh, up-to-date content

3. **Cache Miss**
   - Fetches from Circle API
   - Stores in cache (awaited to ensure write completes)
   - Returns fresh content
   - Subsequent requests will hit cache

### Cache Key Format

Cache keys follow the pattern: `{courseId}-{lessonId}`

Examples:
- `kurs-cursor-123456`
- `kurs-ofe-789012`

### Cached Data Structure

```typescript
{
  "refreshedAt": 1696435200000,  // Unix timestamp in milliseconds
  "content": {
    "id": "123456",
    "data": {
      "id": "123456",
      "name": "Lesson Title",
      "content": "<html>...</html>"
    }
  }
}
```

## Cache Management

### TTL (Time To Live)

- Configurable via `LESSON_CACHE_TTL_HOURS` environment variable
- Default: 24 hours
- After TTL expires, cache is considered "stale"
- Stale cache still returns content but triggers background refresh

### Cache Invalidation

To manually invalidate a cached lesson:

```typescript
import { invalidateCachedLesson } from '@/server/circle/lessonCache';

// In an API endpoint or script
await invalidateCachedLesson(courseId, lessonId, env);
```

### Monitoring Cache Performance

The cache module logs errors for debugging:
- `"Error retrieving cached lesson"` - KV read failure
- `"Error storing lesson in cache"` - KV write failure
- `"Background cache refresh failed"` - Async refresh failure

## Development

### Local Development

The cache gracefully handles missing KV namespace:
- Returns `null` when KV is not available
- Falls back to direct API calls
- No errors thrown for missing configuration

### Testing Cache Behavior

To test cache behavior in development:

1. Use Wrangler's local mode:
```bash
npm run dev
# or
wrangler pages dev dist --kv PLATFORM_LESSON_CACHE
```

2. Check cache status in logs when accessing lessons

## API Reference

### `getCachedLesson(courseId, lessonId, env?)`

Retrieves a lesson from cache if available and fresh.

**Returns:** `LessonEntry | null`

### `setCachedLesson(courseId, lessonId, content, env?)`

Stores a lesson in the cache with current timestamp.

**Returns:** `Promise<void>`

### `shouldRefreshCache(courseId, lessonId, env?)`

Checks if a cached lesson exists but is stale.

**Returns:** `Promise<boolean>`

### `invalidateCachedLesson(courseId, lessonId, env?)`

Deletes a cached lesson entry.

**Returns:** `Promise<void>`

## Performance Considerations

### Benefits

- **Reduced API calls:** Circle API is only called on cache miss or stale cache
- **Faster response times:** Cached content returns immediately (within TTL)
- **Guaranteed fresh data:** Stale cache forces refresh, ensuring users never see outdated content
- **Graceful degradation:** Works without KV in local development

### Trade-offs

- **Storage costs:** KV storage for cached lessons (minimal)
- **Stale content refresh:** When cache expires, users wait for fresh fetch (~200-500ms)
- **No background refresh:** Due to Cloudflare Workers request lifecycle limitations
- **Cold starts:** First request for a lesson hits the API and waits for cache write

## Best Practices

1. **Set appropriate TTL:** Balance freshness vs. API call reduction
2. **Monitor cache hit rate:** Track how often cache is used vs. API calls
3. **Invalidate on content updates:** Clear cache when lessons are updated in Circle
4. **Handle cache failures gracefully:** Always have API fallback

## Future Enhancements

Potential improvements for the caching system:

- **Cache warming:** Pre-populate cache for popular lessons
- **Metrics dashboard:** Track cache hit/miss rates
- **Selective caching:** Cache only high-traffic lessons
- **Cache versioning:** Handle content updates better
- **Batch operations:** Bulk cache invalidation
