# Prefetching and Partial Prerendering (PPR)

## Prefetching

Prefetching makes navigation feel instant by fetching page resources before the user clicks.

### Automatic Prefetch

`<Link>` prefetches automatically when visible in the viewport:

```tsx
import Link from 'next/link'

export default function Nav() {
  return <Link href="/about">About</Link> // Auto-prefetched when visible
}
```

**Static routes:** Full page prefetched (HTML + RSC payload)
**Dynamic routes:** `loading.js` UI + shared layout prefetched (RSC payload on navigation)

### Manual Prefetch

```tsx
'use client'
import { useRouter } from 'next/navigation'

export function PricingCard() {
  const router = useRouter()

  return (
    <div onMouseEnter={() => router.prefetch('/pricing')}>
      <Link href="/pricing">View Pricing</Link>
    </div>
  )
}
```

### Hover-Triggered Prefetch

```tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

export function HoverLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

`prefetch={null}` restores default static prefetching once active.

### Disable Prefetch

```tsx
<Link href="/about" prefetch={false}>About</Link>
```

## Partial Prerendering (PPR)

PPR combines static and dynamic rendering in a single route:
- **Build time:** Static HTML shell generated
- **Request time:** Dynamic portions stream in via `<Suspense>`

### How It Works

```tsx
// app/page.tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      {/* Static: rendered at build time */}
      <Header />
      <StaticHero />

      {/* Dynamic: streamed at request time */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductRecommendations />
      </Suspense>

      <Suspense fallback={<ReviewSkeleton />}>
        <LiveReviews />
      </Suspense>
    </>
  )
}
```

At build time:
1. Static shell (Header, StaticHero, skeletons) → prerendered HTML
2. Dynamic boundaries marked with `postponedState` blob

At request time:
1. Static shell served immediately
2. Dynamic content streams in as it resolves

### Enabling PPR

PPR works automatically with Cache Components (`"use cache"`). Components outside cached scopes become dynamic boundaries wrapped in `<Suspense>`.

### Client Cache

Prefetched data is cached in the browser:
- Static routes: Cached for duration configured by `staleTimes`
- Dynamic routes: Cached for `staleTimes.dynamic` (default: 30s)

Client cache is invalidated when:
- `revalidatePath` / `revalidateTag` / `updateTag` is called
- User performs a mutation (Server Action)
- `router.refresh()` is called

### Prefetch Scheduling

Next.js intelligently schedules prefetches to avoid network congestion:
- Prefetches are deprioritized behind user-initiated navigation
- Multiple prefetches are batched
- Prefetching pauses when network is slow or data saver is on

### Troubleshooting

**Unwanted side-effects during prefetch:**
- Server Functions called during prefetch may trigger side effects
- Wrap side-effect code in `if (typeof window !== 'undefined')` checks
- Use `unstable_noStore()` to opt out of caching for data that shouldn't be prefetched

**Too many prefetches:**
- Use `prefetch={false}` for low-priority links
- Consider hover-triggered prefetch for large link lists

## Rendering Philosophy

Next.js treats static and dynamic as a **spectrum**, not a binary choice:

| Traditional Framework | Next.js 16 |
|----------------------|-----------|
| Static vs Dynamic at **route level** | Static vs Dynamic at **component level** |
| Decide at build time | Decide per-function with `"use cache"` |
| Full page revalidation | Granular cache invalidation by tag |

This enables:
- Faster perceived load times (static shell renders immediately)
- Incremental caching (add `"use cache"` without architectural changes)
- Granular control (cache a function, not a route)
