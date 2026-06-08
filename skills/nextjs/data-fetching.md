# Data Fetching Deep Dive (Next.js 16)

## Server Component Fetching Patterns

### Basic Fetch

```tsx
export default async function Page() {
  const response = await fetch('https://api.example.com/posts')
  const posts = await response.json()
  return <PostsList posts={posts} />
}
```

With `"use cache"` for explicit caching:

```tsx
'use cache'
import { cacheLife } from 'next/cache'

export default async function Page() {
  cacheLife('hours')
  const response = await fetch('https://api.example.com/posts')
  const posts = await response.json()
  return <PostsList posts={posts} />
}
```

### Fetch with Options

```tsx
const data = await fetch('https://api.example.com/data', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  next: {
    tags: ['data'],
  },
})
```

### ORM / Database Direct Access

```tsx
import { db } from '@/lib/db'

export default async function Page() {
  const posts = await db.posts.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })
  return <PostsList posts={posts} />
}
```

## Streaming Patterns

### Loading.tsx (Route-Level)

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <div className="skeleton">Loading posts...</div>
}
```

Shown while the page's data is loading. Replaced automatically when data is ready.

### Suspense Boundaries (Component-Level)

```tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton />}>
        <RevenueChart />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <LatestInvoices />
      </Suspense>
    </main>
  )
}
```

### Error Boundaries

```tsx
// app/blog/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## Parallel Data Fetching

```tsx
export default async function ArtistPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  // Parallel fetches
  const [artist, albums] = await Promise.all([
    getArtist(username),
    getAlbums(username),
  ])

  return (
    <>
      <ArtistHeader artist={artist} />
      <AlbumGrid albums={albums} />
    </>
  )
}
```

## Sharing Data with React.cache

```tsx
import { cache } from 'react'

const getItem = cache(async (id: string) => {
  return db.items.findById(id)
})

// Both calls share the same cached promise
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getItem(id)
  return (
    <>
      <ItemDetails item={item} />
      <RelatedItems itemId={id} />
    </>
  )
}

async function RelatedItems({ itemId }: { itemId: string }) {
  const item = await getItem(itemId) // Same cached result
  return <div>{/* ... */}</div>
}
```

## Data Security with Taint

```tsx
import { experimental_taintObjectReference } from 'react'

export default async function Page() {
  const user = await getUser()
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client',
    user
  )
  // Only pass serializable, safe data
  return <Profile name={user.name} email={user.email} />
}
```

## Client Component Fetching

### useSWR

```tsx
'use client'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Profile() {
  const { data, error, isLoading } = useSWR('/api/profile', fetcher)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>Hello {data.name}</div>
}
```

### React Query (TanStack Query)

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'

export default function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts')
      return res.json()
    },
  })

  if (isLoading) return <div>Loading...</div>
  return <PostsList posts={data} />
}
```

## Mutations with Server Actions

### Form Actions

```tsx
// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function createInvoice(formData: FormData) {
  'use server'
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  }

  await db.invoices.create(rawFormData)
  revalidateTag('invoices', 'max')
}

// app/page.tsx
import { createInvoice } from './actions'

export default function Page() {
  return (
    <form action={createInvoice}>
      <input name="customerId" />
      <input name="amount" type="number" />
      <select name="status">
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
      </select>
      <button type="submit">Create Invoice</button>
    </form>
  )
}
```

### useActionState (React 19)

```tsx
'use client'
import { useActionState } from 'react'
import { createInvoice } from './actions'

export default function Form() {
  const [state, formAction, isPending] = useActionState(createInvoice, null)

  return (
    <form action={formAction}>
      {/* ... */}
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
```

### useFormStatus

```tsx
'use client'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}
```

## Route Handlers (API Routes)

```ts
// app/api/posts/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  const posts = await db.posts.search(query)
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const body = await request.json()
  const post = await db.posts.create(body)
  return NextResponse.json(post, { status: 201 })
}
```

Dynamic route handlers:

```ts
// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const post = await db.posts.findById(id)

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}
```

## Request Memoization

React automatically memoizes `fetch` requests with the same URL and options during a single render pass:

```tsx
export default async function Page() {
  // Both calls share the same promise (same URL, same options)
  const artistData = getArtist('picasso')
  const albumData = getAlbums('picasso')

  // But if options differ, they are separate:
  const artist1 = fetch('/api/artist/picasso', { cache: 'no-store' })
  const artist2 = fetch('/api/artist/picasso') // Different!
}
```
