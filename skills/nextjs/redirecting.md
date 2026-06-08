# Redirecting (Next.js 16)

## Overview

Next.js provides multiple redirect strategies. Choose based on where the redirect logic lives and when it executes.

| Method | When | Use Case |
|--------|------|----------|
| `redirect()` | Server Component / Server Function | Conditional redirects after auth check |
| `permanentRedirect()` | Server Component / Server Function | Permanent redirects (308) |
| `useRouter().push()` | Client Component | Programmatic navigation after user action |
| `next.config.ts` `redirects` | Build-time config | Static redirects, bulk redirects |
| `NextResponse.redirect()` | `proxy.ts` / Route Handler | Request-time redirects, dynamic logic |
| `redirects` in `next.config.ts` | Build-time | Large-scale redirect maps |

## Server-Side Redirects

### redirect() — Temporary (307)

```tsx
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()
  if (!session) {
    redirect('/login') // 307 Temporary Redirect
  }
  return <div>Dashboard</div>
}
```

### permanentRedirect() — Permanent (308)

```tsx
import { permanentRedirect } from 'next/navigation'

export default async function OldBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  permanentRedirect(`/blog/${slug}`) // 308 Permanent Redirect
}
```

**307 vs 308:** Both preserve the HTTP method (POST stays POST). 308 is cached by browsers indefinitely.

## Client-Side Redirects

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const result = await loginAction(formData)
    if (result.success) {
      router.push('/dashboard')
      // or router.replace('/dashboard') to not add to history
    }
  }

  return <form action={handleSubmit}>...</form>
}
```

## Config-Based Redirects

```ts
// next.config.ts
const nextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/about',
        destination: '/about-us',
        permanent: true,
      },
      // Wildcard matching
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
      // Catch-all
      {
        source: '/old-docs/:path*',
        destination: '/docs/:path*',
        permanent: false,
      },
      // Regex matching
      {
        source: '/product/:id(\d+)',
        destination: '/products/:id',
        permanent: true,
      },
      // Query parameter forwarding
      {
        source: '/search',
        destination: '/search-results',
        permanent: false,
      },
      // Has conditions
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'old-domain.com' }],
        destination: 'https://new-domain.com/:path*',
        permanent: true,
      },
    ]
  },
}
```

### Redirect Options

```ts
interface Redirect {
  source: string           // Incoming path pattern
  destination: string      // Target path
  permanent: boolean      // true = 308, false = 307
  basePath?: false        // Disable basePath matching
  locale?: false          // Disable locale matching
  has?: HasCondition[]    // Match conditions
  missing?: HasCondition[] // Missing conditions
}
```

## proxy.ts Redirects

For dynamic, request-time redirects:

```ts
// proxy.ts
import { NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'

interface RedirectEntry {
  destination: string
  permanent: boolean
}

export async function proxy(request: Request) {
  const { pathname } = (request as any).nextUrl

  // Check redirect map (e.g., Edge Config, Redis, database)
  const redirectData = await get(pathname)
  if (redirectData) {
    const entry: RedirectEntry = JSON.parse(redirectData as string)
    const statusCode = entry.permanent ? 308 : 307
    return NextResponse.redirect(entry.destination, statusCode)
  }

  // Domain redirect
  const host = request.headers.get('host')
  if (host === 'old-site.com') {
    return NextResponse.redirect(
      `https://new-site.com${pathname}`,
      301
    )
  }

  return NextResponse.next()
}
```

## Managing Redirects at Scale

### 1. Store Redirect Map in Database

```ts
// lib/redirects.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function getRedirect(path: string) {
  return redis.hget('redirects', path)
}
```

```ts
// proxy.ts
import { getRedirect } from './lib/redirects'

export async function proxy(request: Request) {
  const { pathname } = (request as any).nextUrl
  const redirect = await getRedirect(pathname)

  if (redirect) {
    const { destination, permanent } = JSON.parse(redirect as string)
    return NextResponse.redirect(destination, permanent ? 308 : 307)
  }

  return NextResponse.next()
}
```

### 2. Optimizing Data Lookup

For large redirect sets, use efficient data structures:

```ts
// Use a Trie or hash map for O(1) lookups
const redirectMap = new Map([
  ['/old', '/new'],
  ['/blog/post-1', '/blog/updated-post-1'],
  // ... thousands of entries
])

export function proxy(request: Request) {
  const { pathname } = (request as any).nextUrl
  const destination = redirectMap.get(pathname)

  if (destination) {
    return NextResponse.redirect(destination, 308)
  }

  return NextResponse.next()
}
```

### 3. Bulk Redirect Import

```ts
// scripts/import-redirects.ts
import { Redis } from '@upstash/redis'
import redirects from './redirects.json'

const redis = new Redis({ url: '...', token: '...' })

async function importRedirects() {
  const entries = redirects.map((r) => ({
    source: r.source,
    destination: r.destination,
    permanent: r.permanent ?? true,
  }))

  for (const entry of entries) {
    await redis.hset('redirects', {
      [entry.source]: JSON.stringify(entry),
    })
  }

  console.log(`Imported ${entries.length} redirects`)
}

importRedirects()
```

## Redirect Status Codes

| Code | Meaning | Use When |
|------|---------|----------|
| 301 | Moved Permanently | Legacy. Use 308 instead. |
| 302 | Found | Legacy. Use 307 instead. |
| 307 | Temporary Redirect | Content temporarily at new URL |
| 308 | Permanent Redirect | Content permanently at new URL |

**Important:** 307/308 preserve the HTTP method (POST stays POST). 301/302 may change POST to GET.

## Testing Redirects

```bash
# Test a redirect
curl -I http://localhost:3000/old-path

# Check status code and Location header
# HTTP/1.1 308 Permanent Redirect
# Location: /new-path
```

## Common Patterns

### After Login

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  async function handleLogin(formData: FormData) {
    const result = await login(formData)
    if (result.success) {
      router.push(callbackUrl)
    }
  }

  return <form action={handleLogin}>...</form>
}
```

### Language Redirect

```ts
// proxy.ts
export function proxy(request: Request) {
  const acceptLang = request.headers.get('accept-language') || 'en'
  const lang = acceptLang.startsWith('fr') ? 'fr' : 'en'

  const { pathname } = (request as any).nextUrl
  if (!pathname.startsWith(`/${lang}`)) {
    return NextResponse.redirect(
      new URL(`/${lang}${pathname}`, request.url)
    )
  }

  return NextResponse.next()
}
```

### Trailing Slash Normalization

```ts
// next.config.ts
const nextConfig = {
  trailingSlash: true, // All URLs end with /
  // OR
  // trailingSlash: false, // No trailing slashes
}
```
