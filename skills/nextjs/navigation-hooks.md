# Navigation Hooks and APIs (Next.js 16)

All navigation hooks come from `next/navigation` (NOT `next/router` — that's Pages Router only).

## useRouter

For programmatic navigation in Client Components:

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  )
}
```

**Methods:**
- `router.push('/path')` — Navigate to path, adds to history stack
- `router.replace('/path')` — Navigate without adding to history
- `router.back()` — Go back
- `router.forward()` — Go forward
- `router.refresh()` — Refresh the current route (re-fetches data)
- `router.prefetch('/path')` — Prefetch a route manually

## usePathname

Get the current URL pathname:

```tsx
'use client'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname() // e.g., "/blog/my-post"
  return <nav>Current: {pathname}</nav>
}
```

## useSearchParams

Read URL search parameters. **Requires a Suspense boundary** when used in a page/layout:

```tsx
'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Search() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  return <div>Search: {query}</div>
}

// Wrap in Suspense — causes CSR bailout without it
export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Search />
    </Suspense>
  )
}
```

**Important:** `useSearchParams` causes the closest parent Suspense boundary to switch to Client-side Rendering (CSR). Place it deep in the tree to minimize impact.

## useParams

Access dynamic route parameters:

```tsx
'use client'
import { useParams } from 'next/navigation'

export default function BlogPost() {
  const params = useParams() // { slug: 'my-post' }
  return <div>Post: {params.slug}</div>
}
```

## useLinkStatus

Track if a `<Link>` is navigating (loading state):

```tsx
'use client'
import { useLinkStatus } from 'next/navigation'
import Link from 'next/link'

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { pending } = useLinkStatus()
  return (
    <Link href={href}>
      {children}
      {pending && <span>Loading...</span>}
    </Link>
  )
}
```

## useSelectedLayoutSegment / useSelectedLayoutSegments

Access the active route segment from a parent layout:

```tsx
'use client'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function TabNav() {
  const segment = useSelectedLayoutSegment() // "settings", "profile", etc.
  return <div>Active tab: {segment}</div>
}
```

`useSelectedLayoutSegments()` returns an array of all nested segments.

## redirect / permanentRedirect

For server-side redirects:

```tsx
import { redirect, permanentRedirect } from 'next/navigation'

export default async function Page() {
  const session = await verifySession()
  if (!session) {
    redirect('/login') // 307 temporary redirect
  }
  // ...
}
```

`permanentRedirect('/new-path')` sends a 308 permanent redirect.

## notFound

Renders the nearest `not-found.tsx`:

```tsx
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug)
  if (!post) {
    notFound()
  }
  return <div>{post.title}</div>
}
```

## forbidden / unauthorized (Next.js 16, experimental)

Requires `experimental.authInterrupts: true` in `next.config.ts`:

```tsx
import { forbidden, unauthorized } from 'next/navigation'

export default async function AdminPage() {
  const session = await verifySession()
  if (!session) {
    unauthorized() // Renders unauthorized.js (401)
  }
  if (session.role !== 'admin') {
    forbidden() // Renders forbidden.js (403)
  }
  return <div>Admin Dashboard</div>
}
```

Create `forbidden.js`/`unauthorized.js` files for custom UI:

```tsx
// app/forbidden.tsx
export default function ForbiddenPage() {
  return <div>403 - You do not have permission to access this page</div>
}
```
