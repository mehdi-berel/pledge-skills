# Advanced APIs (Next.js 16)

## after()

Schedule work to execute after the response (or prerender) is finished. Non-blocking — useful for logging, analytics, and side effects.

```tsx
import { after } from 'next/server'

export default function Layout({ children }: { children: React.ReactNode }) {
  after(() => {
    // Runs after response is sent
    logAnalytics('page_view')
  })
  return <>{children}</>
}
```

**Rules:**
- In **Route Handlers and Server Functions**: Can call `cookies()`/`headers()` inside the `after` callback
- In **Server Components**: Cannot use request APIs inside `after`. Read them before and pass values in:

```tsx
export default async function Page() {
  const userAgent = (await headers()).get('user-agent') || 'unknown'

  after(() => {
    // Use the pre-read value
    logAnalytics({ userAgent })
  })

  return <h1>My Page</h1>
}
```

- `after` does NOT cause a route to become dynamic
- In static pages, the callback runs at build time or during revalidation

## connection()

Pause prerendering until request time. Useful when a component doesn't use request APIs but still needs per-request output (e.g., `Math.random()`, `new Date()`, sync DB drivers).

```tsx
import { connection } from 'next/server'

export default async function Page() {
  await connection() // prerendering stops here
  const rand = Math.random() // Only runs at request time
  return <span>{rand}</span>
}
```

**Use case — synchronous database drivers** (e.g., `better-sqlite3`):

```tsx
import { connection } from 'next/server'
import Database from 'better-sqlite3'

const db = new Database('app.db')

export async function getVisitorCount() {
  await connection() // Exclude from prerendering
  return db.prepare('SELECT value FROM counters WHERE name = ?').get('visitors')
}
```

## cacheTag()

Tag cached data for on-demand invalidation. Different from `updateTag` — `cacheTag` is for marking cache entries, `revalidateTag` invalidates them.

```tsx
import { cacheTag } from 'next/cache'

export async function Bookings({ type = 'haircut' }: { type: string }) {
  'use cache'
  cacheTag('bookings-data')

  const data = await fetch(`/api/bookings?type=${encodeURIComponent(type)}`)
  return <div>{/* ... */}</div>
}
```

Create tags from dynamic data:

```tsx
export async function Bookings({ type }: { type: string }) {
  async function getBookingsData() {
    'use cache'
    const data = await fetch(`/api/bookings?type=${type}`)
    cacheTag('bookings-data', data.id)
    return data
  }
  // ...
}
```

Invalidate tagged cache in a Server Action:

```tsx
'use server'
import { revalidateTag } from 'next/cache'

export async function updateBookings() {
  await updateBookingData()
  revalidateTag('bookings-data')
}
```

## draftMode()

Preview draft content from a headless CMS. Toggle between static and dynamic rendering.

```tsx
// app/api/draft/route.ts
import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.DRAFT_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  return NextResponse.redirect(new URL('/', request.url))
}
```

```tsx
// app/page.tsx
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()
  const posts = isEnabled
    ? await fetchDraftPosts()
    : await fetchPublishedPosts()

  return <div>{/* ... */}</div>
}
```

## generateSitemaps

Generate multiple sitemaps for large sites:

```tsx
import { MetadataRoute } from 'next'

export async function generateSitemaps() {
  // Fetch total number of products
  const totalProducts = await fetchProductCount()
  const sitemapCount = Math.ceil(totalProducts / 50000)

  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const products = await fetchProducts({ page: id, limit: 50000 })
  return products.map((product) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.id}`,
    lastModified: product.updatedAt,
  }))
}
```

## JSON-LD

Add structured data for SEO:

```tsx
import type { Metadata } from 'next'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>{/* ... */}</div>
    </>
  )
}
```
