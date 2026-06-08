# Streaming Deep Dive (Next.js 16)

## What is Streaming?

Traditional SSR waits for the entire HTML before sending anything. One slow query blocks the whole page.

**Streaming** uses chunked transfer encoding to send parts as they become ready. The browser renders HTML while the server is still generating the rest.

This is especially impactful for pages combining:
- Fast static content (header, navigation)
- Slow dynamic content (personalized data, recommendations)

## How the App Router Delivers a Page

Two streams work together during initial page load:

1. **HTML Stream** — Server-rendered HTML, chunked via `<Suspense>` boundaries
2. **Component Payload** — React Server Components (RSC) serialized data that hydrates the UI

### The HTML Stream

```
HTTP/1.1 200 OK
Transfer-Encoding: chunked
Content-Type: text/html; charset=utf-8

<!-- Static shell: immediate -->
<html><head>...</head><body>
  <header>...</header>
  <main>

<!-- Suspense boundary 1: streamed when ready -->
    <!--$?--><template id="B:1"></template>
    <div hidden id="S:1">...revenue component...</div>
    <script>$RC=function...$RC(1)</script>

<!-- Suspense boundary 2: streamed when ready -->
    <!--$?--><template id="B:2"></template>
    <div hidden id="S:2">...reviews component...</div>
    <script>$RC=function...$RC(2)</script>
  </main>
</body></html>
```

The browser:
1. Receives static shell → renders immediately
2. Receives each Suspense boundary → hydrates progressively

## Streaming Strategies

### Page-Level Streaming with loading.js

The simplest approach. Wraps the entire page in a single `<Suspense>` boundary:

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
      <div className="h-4 w-full bg-gray-200 rounded mb-2" />
      <div className="h-4 w-2/3 bg-gray-200 rounded" />
    </div>
  )
}
```

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetchDashboardData() // This blocks loading.js
  return <Dashboard data={data} />
}
```

**When to use:** Page needs to await data before rendering anything meaningful.

### Granular Streaming with Suspense

Control exactly which parts stream independently:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Static: renders immediately */}
      <StaticHeader />

      <div className="grid grid-cols-2 gap-4">
        {/* Streams independently when ready */}
        <Suspense fallback={<RevenueSkeleton />}>
          <Revenue />
        </Suspense>

        <Suspense fallback={<OrdersSkeleton />}>
          <RecentOrders />
        </Suspense>
      </div>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />
      </Suspense>
    </div>
  )
}
```

**Revenue** streams at 200ms, **RecentOrders** at 1s, **Recommendations** at 3s — each appears as soon as ready.

### Nested Suspense Boundaries

Create layered loading experiences:

```tsx
import { Suspense } from 'react'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div>
      <h1>Product</h1>

      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails id={id} />

        {/* Inner boundary — shows after ProductDetails resolves */}
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews productId={id} />
        </Suspense>
      </Suspense>
    </div>
  )
}
```

Progressive reveal: Header → ProductDetails → Reviews.

### Push Dynamic Access Down

Move dynamic data access as deep into the tree as possible:

```tsx
// ❌ Page-level dynamic access — blocks entire page
export default async function Page() {
  const user = await getCurrentUser()     // blocks
  const posts = await getPosts()          // blocks
  const recommendations = await getRecs() // blocks
  return <PageContent user={user} posts={posts} recommendations={recommendations} />
}

// ✅ Component-level dynamic access — streams independently
export default function Page() {
  return (
    <>
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<RecsSkeleton />}>
        <Recommendations />
      </Suspense>
    </>
  )
}
```

## Streaming Data to the Client

Pass unresolved promises from Server Components to Client Components:

```tsx
// Server Component
import { Suspense } from 'react'
import { StatsChart } from './stats-chart'

async function getStats(): Promise<Stats> {
  const res = await fetch('https://api.example.com/stats')
  return res.json()
}

export default function Dashboard() {
  // Start fetch during server render, don't await
  const statsPromise = getStats()

  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <StatsChart dataPromise={statsPromise} />
    </Suspense>
  )
}
```

```tsx
// Client Component
'use client'
import { use } from 'react'

export function StatsChart({ dataPromise }: { dataPromise: Promise<Stats> }) {
  const stats = use(dataPromise) // Suspends until promise resolves
  return <div>{/* render chart */}</div>
}
```

The `use()` API lets Client Components consume promises passed from Server Components.

## Streaming in Route Handlers

Stream raw responses using Web Streams API:

```ts
// app/api/stream/route.ts
export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(`Chunk ${i + 1}\n`))
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
```

Stream large files without loading into memory:

```ts
import { open } from 'node:fs/promises'

export async function GET() {
  const file = await open('/path/to/large-file.csv')
  return new Response(file.readableWebStream(), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="data.csv"',
    },
  })
}
```

## Web Vitals and Streaming

Streaming directly impacts Core Web Vitals:

| Metric | Impact |
|--------|--------|
| **TTFB** (Time to First Byte) | May increase slightly because the server starts sending data before it's fully ready |
| **FCP** (First Contentful Paint) | Improves — static shell renders immediately |
| **LCP** (Largest Contentful Paint) | May improve if largest element is in static shell |
| **CLS** (Cumulative Layout Shift) | Risk if fallbacks and final content have different sizes. Match skeleton dimensions to content. |
| **INP** (Interaction to Next Paint) | Improves — hydration is prioritized for visible content |

**Best practice:** Design skeletons to match the dimensions of the final content to minimize CLS.

## Error Handling During Streaming

Errors in Suspense boundaries are caught by nearest `error.tsx`:

```tsx
// app/dashboard/error.tsx
'use client'

export default function ErrorBoundary({
  error,
  unstable_retry,
}: {
  error: Error
  unstable_retry: () => void
}) {
  return (
    <div className="error-fallback">
      <p>Failed to load dashboard data</p>
      <button onClick={() => unstable_retry()}>Retry</button>
    </div>
  )
}
```

The error boundary renders in place of the failed Suspense boundary, without affecting other streaming sections.

## When Streaming May Be Affected

| Factor | Impact |
|--------|--------|
| Reverse proxies (nginx, Apache) | May buffer responses. Disable buffering for streaming. |
| CDNs | May buffer or cache. Configure cache rules carefully. |
| Serverless platforms | Cold starts may add latency. Vercel supports streaming natively. |
| Compression (gzip/brotli) | May buffer. Use streaming-compatible compression. |
| Older browsers | May not support chunked encoding well. |

## Verifying Streaming Works

```bash
# Check Transfer-Encoding: chunked
curl -I http://localhost:3000

# Look for: Transfer-Encoding: chunked
# If you see Content-Length, streaming is not active
```

## loading.js vs Suspense

| | loading.js | `<Suspense>` |
|---|---|---|
| Scope | Entire page | Specific component subtree |
| Setup | Single file | Inline in JSX |
| Granularity | Page-level | Component-level |
| Use when | Page needs all data | Parts of page are independent |

**Recommendation:** Use `<Suspense>` for granular control. Use `loading.js` only for simple full-page skeletons.
