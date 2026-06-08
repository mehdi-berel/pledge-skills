# Server and Client Components Deep Dive (Next.js 16)

## The Server-First Model

In the App Router, every component is a Server Component by default. Only opt into Client Components when you need browser-specific features.

## Server Components

### What They Can Do
- Be `async` and directly access databases, files, APIs
- Access server-only modules and environment variables
- Render Server Components and Client Components
- Use `cacheLife` and `"use cache"`

### What They Cannot Do
- Use React hooks (`useState`, `useEffect`, etc.)
- Use browser APIs (`window`, `document`, `localStorage`)
- Handle events (`onClick`, `onSubmit`, etc.)
- Be async in a way that requires client-side state

### Example: Direct DB Access

```tsx
// app/posts/page.tsx
import { db } from '@/lib/db'

export default async function PostsPage() {
  const posts = await db.posts.findMany({
    where: { published: true },
  })

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </li>
      ))}
    </ul>
  )
}
```

## Client Components

### What They Can Do
- Use all React hooks
- Use browser APIs
- Handle events
- Use client-side state

### What They Cannot Do
- Be `async` (no async Client Components)
- Directly access server-only resources
- Be imported by Server Components (Server → Client OK, Client → Server NOT OK for components)

### Example: Interactive UI

```tsx
'use client'

import { useState } from 'react'

export default function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  return (
    <button
      onClick={() => {
        setLiked(!liked)
        setCount(c => c + (liked ? -1 : 1))
      }}
    >
      {liked ? '❤️' : '🤍'} {count}
    </button>
  )
}
```

## Interleaving Server and Client Components

The key pattern: **Server Components can import Client Components, but not vice versa.**

```tsx
// ✅ CORRECT: Server Component imports Client Component
// app/page.tsx (Server Component)
import LikeButton from '@/components/LikeButton'

export default async function Page() {
  const posts = await getPosts()
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <LikeButton postId={post.id} /> {/* Client Component */}
        </article>
      ))}
    </div>
  )
}
```

```tsx
// ❌ WRONG: Client Component cannot import Server Component
'use client'
import PostList from '@/components/PostList' // Server Component

export default function Page() {
  return <PostList /> // ❌ Error!
}
```

### Workaround: Pass Server Component as children

```tsx
// ✅ CORRECT
'use client'
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children}
    </div>
  )
}

// app/page.tsx
import ClientWrapper from '@/components/ClientWrapper'
import PostList from '@/components/PostList' // Server Component

export default async function Page() {
  const posts = await getPosts()
  return (
    <ClientWrapper>
      <PostList posts={posts} /> {/* Server Component as children */}
    </ClientWrapper>
  )
}
```

## Context Providers

Place context providers in a Client Component near the root:

```tsx
// app/providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}

// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Reducing JS Bundle Size

Move data fetching and heavy computation to Server Components:

```tsx
// ❌ BEFORE: Everything is a Client Component
'use client'
import { useState, useEffect } from 'react'

export default function ProductList() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])
  return (
    <ul>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </ul>
  )
}

// ✅ AFTER: Server Component fetches data, Client Component handles interactivity
// app/products/page.tsx
import ProductCard from '@/components/ProductCard'

export default async function ProductList() {
  const products = await db.products.findMany()
  return (
    <ul>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </ul>
  )
}

// components/ProductCard.tsx
'use client'
export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <li
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {product.name}
    </li>
  )
}
```

## Third-Party Components

When a third-party library requires client features, create a thin wrapper:

```tsx
// components/Map.tsx
'use client'

import { Map as LeafletMap } from 'react-leaflet'

export default function Map(props: React.ComponentProps<typeof LeafletMap>) {
  return <LeafletMap {...props} />
}
```

Then use in a Server Component:

```tsx
// app/contact/page.tsx
import Map from '@/components/Map'

export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <Map center={[51.505, -0.09]} zoom={13} />
    </div>
  )
}
```

## Preventing Environment Poisoning

Never pass server-only data to Client Components:

```tsx
// ❌ WRONG: Passing server secrets to client
'use client'
export default function Config({ apiKey }: { apiKey: string }) { ... }

// app/page.tsx
import Config from '@/components/Config'
export default function Page() {
  return <Config apiKey={process.env.SECRET_API_KEY!} /> // ❌ Leaked!
}
```

```tsx
// ✅ CORRECT: Keep secrets on server
// lib/api.ts
import 'server-only'

export async function fetchData() {
  const apiKey = process.env.SECRET_API_KEY
  return fetch('https://api.example.com/data', {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
}
```

Use the `server-only` package to enforce server-only imports:

```bash
npm install server-only
```

```ts
// lib/db.ts
import 'server-only'

export const db = createClient({ ... })
```

## Summary Rules

1. Start with Server Components everywhere
2. Add `"use client"` only when you need: hooks, browser APIs, events
3. Server Components can import Client Components
4. Client Components CANNOT import Server Components directly
5. Pass Server Components as `children` to Client Components when needed
6. Keep data fetching in Server Components
7. Keep context providers in a single Client Component near root
8. Use `server-only` package to protect server-only code
