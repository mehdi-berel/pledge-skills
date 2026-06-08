# Caching Deep Dive (Next.js 16)

## Cache Components Philosophy

In Next.js 16, caching is **explicit opt-in**, not implicit. All dynamic code runs at request time by default. This aligns with developer expectations for a full-stack framework.

Cache Components complete the Partial Prerendering (PPR) story:
- Static parts are prerendered at build time
- Dynamic parts (wrapped in `<Suspense>`) are fetched at request time
- `"use cache"` directive marks what should be cached

## The "use cache" Directive

Can be used at:
1. **File level** — caches everything in the file
2. **Function level** — caches that specific function/component

```tsx
// File-level
'use cache'
import { cacheLife } from 'next/cache'

export default async function BlogPage() {
  cacheLife('days')
  const posts = await getBlogPosts()
  return <PostsList posts={posts} />
}

// Function-level
import { cacheLife } from 'next/cache'

export default async function Dashboard() {
  // This is NOT cached (dynamic by default)
  const user = await getCurrentUser()

  // This IS cached
  const stats = await getCachedStats()
  return <Dashboard user={user} stats={stats} />
}

async function getCachedStats() {
  'use cache'
  cacheLife('hours')
  return await fetchStatsFromDB()
}
```

## cacheLife In Detail

### Preset Profiles

| Profile | stale | revalidate | expire | Use Case |
|---------|-------|------------|--------|----------|
| seconds | 0 | 0 | 1 | Real-time data |
| minutes | 0 | 60 | 3600 | Social feeds, news |
| hours | 300 | 3600 | 86400 | Product inventory |
| days | 300 | 86400 | 604800 | Blog posts |
| weeks | 300 | 604800 | 2592000 | Podcasts |
| max | 300 | 604800 | never | Legal pages |
| default | 300 | 900 | never | Fallback |

### Short-Lived Caches and Prerendering

Caches with `revalidate: 0` or `expire` under 5 minutes are excluded from prerenders and become "dynamic holes":

```tsx
'use cache'
import { cacheLife } from 'next/cache'
import { Suspense } from 'react'

export default async function ProductPage() {
  // This is prerendered (long-lived cache)
  cacheLife('days')
  const product = await getProduct()

  return (
    <div>
      <h1>{product.name}</h1>
      <Suspense fallback={<StockSkeleton />}>
        <StockInfo productId={product.id} />
      </Suspense>
    </div>
  )
}

async function StockInfo({ productId }: { productId: string }) {
  'use cache'
  cacheLife('seconds') // Dynamic hole — fetched at request time
  const stock = await getStock(productId)
  return <span>{stock} in stock</span>
}
```

## Nested Caching

When a cached function calls another cached function, the inner cache boundary is respected:

```tsx
'use cache'
import { cacheLife } from 'next/cache'

export default async function Page() {
  cacheLife('days')
  const posts = await getPosts()
  return <PostsList posts={posts} />
}

async function getPosts() {
  'use cache'
  cacheLife('hours') // Inner cache with shorter lifetime
  return db.posts.findAll()
}
```

The inner `cacheLife('hours')` takes precedence for that function's cache.

## Cache Invalidation Strategies

### 1. revalidateTag (Stale-While-Revalidate)

For content that can tolerate eventual consistency:

```tsx
import { revalidateTag } from 'next/cache'

// Background revalidation
revalidateTag('blog-posts', 'max')
```

### 2. updateTag (Read-Your-Writes)

For immediate consistency after mutations:

```tsx
'use server'
import { updateTag } from 'next/cache'

export async function updatePost(id: string, data: PostData) {
  await db.posts.update(id, data)
  updateTag(`post-${id}`)
}
```

### 3. refresh (Uncached Data Only)

For refreshing data that was never cached:

```tsx
'use server'
import { refresh } from 'next/cache'

export async function dismissNotification(id: string) {
  await db.notifications.dismiss(id)
  refresh() // Refresh notification count elsewhere on page
}
```

### 4. revalidatePath

Revalidate all data associated with a path:

```tsx
import { revalidatePath } from 'next/cache'

revalidatePath('/blog/[slug]', 'page')
```

## cacheTag

Tag cached functions for targeted invalidation:

```tsx
import { cacheTag } from 'next/cache'

async function getProduct(id: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`product-${id}`)
  return db.products.findById(id)
}
```

## Client Cache Behavior

- Server sends `x-nextjs-stale-time` header
- Client router uses this to determine when to revalidate
- Minimum 30 seconds enforced
- Calling revalidation functions from Server Actions clears entire client cache immediately

## Custom Profiles

```ts
// next.config.ts
const nextConfig = {
  cacheComponents: true,
  cacheLife: {
    flashSale: {
      stale: 60,
      revalidate: 60,
      expire: 300,
    },
  },
}
```

## Anti-Patterns

❌ Don't call `cacheLife` at module scope:
```tsx
// WRONG
import { cacheLife } from 'next/cache'
cacheLife('days') // ❌ Throws error

export default async function Page() { ... }
```

❌ Don't abstract `cacheLife` into shared utilities:
```tsx
// WRONG — obscures caching behavior
import { defaultCache } from '@/lib/cache'

export default async function Page() {
  defaultCache() // ❌ Hidden behavior
  ...
}
```

✅ Do keep `cacheLife` explicit in the function where caching is defined.

## "use cache: private" (Experimental)

Cache scoped to the individual user. Results are cached only in the browser's memory and do NOT persist across page reloads or on the server.

Use when:
- A function accesses runtime request APIs (`cookies()`, `headers()`, `searchParams`) and you want to cache it
- Compliance requirements prevent storing user data on the server

```tsx
'use cache: private'
import { cookies } from 'next/headers'

export default async function PersonalizedDashboard() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  const preferences = await getUserPreferences(userId)
  return <Dashboard preferences={preferences} />
}
```

**Allowed request APIs inside `'use cache: private'`:**
- `cookies()`
- `headers()`
- `searchParams` (as function params)

**NOT allowed:** `connection()` — provides connection-specific info that can't be safely cached.

**Important:** This executes on every server render and is excluded from static shell generation.

## "use cache: remote" (Experimental)

Persistent shared caching using remote cache handlers (e.g., Redis). Survives server restarts and is shared across all server instances.

Use when:
- Upstream services (CMS, databases, APIs) are getting too many hits
- Serverless environment where memory is not shared between instances
- Rate-limited APIs or slow backends that need protection
- Expensive computations that should be shared across users

```tsx
'use cache: remote'
import { cacheLife } from 'next/cache'

async function getExpensiveData() {
  'use cache: remote'
  cacheLife('hours')
  return await fetch('https://api.example.com/expensive').then(r => r.json())
}
```

**Remote cache handler setup:**

```ts
// next.config.ts
const nextConfig = {
  cacheComponents: true,
  cacheHandlers: {
    remote: {
      handler: require.resolve('./cache-handler.js'),
    },
  },
}
```

**Comparison of cache directives:**

| Directive | Storage | Persists? | Request APIs? | Use Case |
|-----------|---------|-----------|---------------|----------|
| `'use cache'` | In-memory (server) | No (server restart) | No | Static shell, shared data |
| `'use cache: private'` | Browser memory only | No (page reload) | Yes | User-specific data in browser |
| `'use cache: remote'` | Remote (Redis, etc.) | Yes | No | Shared across instances, rate limiting |

## ISR (Incremental Static Regeneration)

ISR still works in Next.js 16 alongside Cache Components. Use `revalidate` export for time-based regeneration:

```tsx
// app/blog/[id]/page.tsx
export const revalidate = 60 // seconds

export async function generateStaticParams() {
  const posts = await fetchPosts()
  return posts.map((post) => ({ id: String(post.id) }))
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await fetch(`https://api.example.com/blog/${id}`).then(r => r.json())
  return <article>{post.content}</article>
}
```

**How ISR works:**
1. During `next build`, all known posts are generated
2. Requests are cached and instantaneous
3. After 60 seconds, the next request returns cached (stale) page
4. Cache invalidated, new version generated in background
5. Subsequent requests return updated page

**On-demand revalidation with `revalidatePath`:**

```tsx
'use server'
import { revalidatePath } from 'next/cache'

export async function updatePost(id: string) {
  await db.posts.update(id)
  revalidatePath(`/blog/${id}`, 'page')
}
```

**Migration from old route segment configs:**

| Old Config | New Approach |
|------------|-------------|
| `export const dynamic = 'force-dynamic'` | Just remove it (default is dynamic) |
| `export const dynamic = 'force-static'` | Use `'use cache'` + `cacheLife('max')` |
| `export const revalidate = 3600` | Use `cacheLife('hours')` |
| `export const fetchCache = 'force-cache'` | Use `'use cache'` |
| `export const runtime = 'edge'` | Not supported with Cache Components. Remove it. |

## staleTimes Config

Override client-side cache invalidation timing:

```ts
// next.config.ts
const nextConfig = {
  staleTimes: {
    dynamic: 30,    // Default: 30 seconds for dynamic pages
    static: 300,     // Default: 5 minutes for static pages
  },
}
```

These values control how long the client router uses cached data before checking the server.

## How Revalidation Works Internally

### Tag System Architecture

Next.js uses a tag-based system for cache invalidation:

**Explicit tags** — Set by you via `cacheTag()`:
```tsx
import { cacheTag } from 'next/cache'

async function getPost(id: string) {
  'use cache'
  cacheTag(`post-${id}`)
  return db.posts.findById(id)
}
```

**Soft tags** — Automatically generated by Next.js based on the request path, data source, etc. These are used internally for implicit cache relationships.

### What Gets Revalidated

When you call `revalidateTag('posts')`:
1. All cache entries with that explicit tag are invalidated
2. Soft tags associated with those entries are also invalidated
3. The client cache is cleared for related routes
4. On next request, fresh data is fetched and cached

### Multi-Instance Coordination

In multi-server deployments, revalidation must be coordinated across instances:

**Single instance:** Revalidation is immediate — the same server handles cache invalidation and subsequent requests.

**Multi-instance with shared cache:** Use a custom cache handler (Redis, etc.) so all instances share the same cache:
```ts
// next.config.ts
const nextConfig = {
  cacheComponents: true,
  cacheHandlers: {
    default: {
      handler: require.resolve('./redis-cache-handler.js'),
    },
  },
}
```

**CDN integration:** After `revalidateTag`, the CDN may still serve stale content until its TTL expires. For immediate freshness, purge the CDN cache programmatically:
```ts
'use server'
import { revalidateTag } from 'next/cache'

export async function updatePost(id: string) {
  await db.posts.update(id)
  revalidateTag(`post-${id}`)

  // Purge CDN cache (Cloudflare example)
  await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${CF_TOKEN}` },
    body: JSON.stringify({ files: [`https://example.com/blog/${id}`] }),
  })
}
```

## unstable_noStore()

Opt out of caching for specific data fetches (marks the request as dynamic):

```tsx
import { unstable_noStore } from 'next/cache'

export default async function RealtimeData() {
  unstable_noStore() // This page is never cached
  const data = await fetchLiveData()
  return <div>{data.value}</div>
}
```

Use when:
- Data must always be fresh (real-time data)
- During debugging to bypass cache
- Data that shouldn't be prefetched

**Note:** In Next.js 16, the default is already dynamic (no implicit caching). `unstable_noStore()` is mainly useful to explicitly mark boundaries or when migrating from older versions.

## unstable_cache (Legacy)

`unstable_cache` was the experimental API before `"use cache"` and `cacheLife`. In Next.js 16, prefer the new Cache Components approach:

```tsx
// ❌ Old approach (still works but deprecated)
import { unstable_cache } from 'next/cache'
const getCachedData = unstable_cache(async () => fetchData(), ['data-key'])

// ✅ Next.js 16 approach
async function getCachedData() {
  'use cache'
  cacheLife('hours')
  return await fetchData()
}
```

### Graceful Degradation

If revalidation fails (e.g., cache handler unavailable):
- Next.js continues serving the existing cached content
- The next request will retry revalidation
- No user-facing errors are shown

### Custom Cache Handlers

Implement a custom cache handler for full control:

```ts
// cache-handler.ts
import type { CacheHandlerContext, CacheHandlerValue } from 'next/dist/server/lib/incremental-cache'

export default class CustomCacheHandler {
  async get(
    key: string,
    ctx: CacheHandlerContext
  ): Promise<CacheHandlerValue | null> {
    // Fetch from your cache store
    return await redis.get(`next:cache:${key}`)
  }

  async set(
    key: string,
    data: CacheHandlerValue,
    ctx: CacheHandlerContext
  ): Promise<void> {
    // Store in your cache store
    await redis.set(`next:cache:${key}`, JSON.stringify(data))
  }

  async revalidateTag(tag: string): Promise<void> {
    // Find and invalidate all entries with this tag
    const keys = await redis.smembers(`next:tag:${tag}`)
    for (const key of keys) {
      await redis.del(`next:cache:${key}`)
    }
  }
}
```

Configure in `next.config.ts`:
```ts
const nextConfig = {
  cacheComponents: true,
  cacheHandlers: {
    default: {
      handler: require.resolve('./cache-handler.ts'),
    },
  },
}
```
