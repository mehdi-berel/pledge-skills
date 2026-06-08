# Breaking Changes: Next.js 15 → 16.2.7 Migration Guide

## Async APIs

### params and searchParams are now Promises

```tsx
// ❌ Next.js 15
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
}

// ✅ Next.js 16
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
```

```tsx
// ❌ Next.js 15
export default async function Page({ searchParams }: { searchParams: { q: string } }) {
  const q = searchParams.q
}

// ✅ Next.js 16
export default async function Page({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const q = (await searchParams).q
}
```

### cookies(), headers(), draftMode() are async

```tsx
// ❌ Next.js 15
import { cookies, headers, draftMode } from 'next/headers'

export default function Page() {
  const cookieStore = cookies()
  const headerStore = headers()
  const { isEnabled } = draftMode()
}

// ✅ Next.js 16
import { cookies, headers, draftMode } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const headerStore = await headers()
  const { isEnabled } = await draftMode()
}
```

## Caching Changes

### experimental.ppr Removed

```ts
// ❌ Next.js 15
const nextConfig = {
  experimental: {
    ppr: true,
  },
}

// ✅ Next.js 16
const nextConfig = {
  cacheComponents: true,
}
```

### revalidateTag now requires cacheLife profile

```tsx
// ❌ Next.js 15
import { revalidateTag } from 'next/cache'
revalidateTag('posts')

// ✅ Next.js 16
import { revalidateTag } from 'next/cache'
revalidateTag('posts', 'max')     // With profile
revalidateTag('posts', 'hours')   // Or other profile
revalidateTag('posts', { expire: 3600 }) // Or inline object
```

## proxy.ts Replaces middleware.ts

```ts
// ❌ Next.js 15 (deprecated)
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}
```

```ts
// ✅ Next.js 16
// proxy.ts (at project root)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}
```

## Image Configuration

### images.domains Deprecated

```ts
// ❌ Next.js 15
const nextConfig = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
  },
}

// ✅ Next.js 16
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'example.com' },
      { protocol: 'https', hostname: 'cdn.example.com' },
    ],
  },
}
```

### Image Quality Changes

```ts
// Next.js 16
const nextConfig = {
  images: {
    qualities: [75], // Array format (default)
    // Or custom range:
    // qualities: [50, 75, 90],
  },
}
```

Individual image quality prop accepts values 1-100:
```tsx
<Image src="/photo.jpg" alt="" width={500} height={300} quality={85} />
```

## Removed Features

| Feature | Replacement |
|---------|-------------|
| `useAmp` hook | Removed (AMP support dropped) |
| `export const config = { amp: true }` | Removed |
| `next lint` | Use ESLint CLI directly: `npx eslint .` |
| `devIndicators` config | Removed |
| `serverRuntimeConfig` | Use `.env` files |
| `publicRuntimeConfig` | Use `.env` files |
| `images.localPatterns` | `images.dangerouslyAllowLocalIP: true` |
| `images.maximumRedirects` | Default is now `0` |
| `experimental.turbopack` | Turbopack is always on (stable) |
| `experimental.dynamicIO` | Removed |
| `scroll-behavior: smooth` (Link) | Removed |
| `data-scroll-behavior="smooth"` | Removed |
| `unstable_rootParams()` | Use `params` prop directly |

## generateImageMetadata Return Type

```tsx
// ❌ Next.js 15
export async function generateImageMetadata({ params }) {
  return [{ id: '1', alt: 'Photo' }] as Promise<string[]>
}

// ✅ Next.js 16
import { ImageMetadata } from 'next/image'

export async function generateImageMetadata({ params }: { params: Promise<{ id: string }> }) {
  return [{ id: '1', alt: 'Photo' }] as Promise<ImageMetadata[]>
}
```

## default.js in Parallel Routes

```tsx
// app/@team/default.tsx
// In Next.js 16, default.tsx must return null explicitly when not shown

export default function Default() {
  return null
}
```

## notFound() Behavior

```tsx
// Next.js 16: notFound() no longer throws an error you can catch
// It renders the nearest not-found.tsx boundary

import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound() // Renders not-found.tsx — no try/catch needed
  }

  return <ProductDetails product={product} />
}
```

## Sass Loader Changes

Next.js 16 uses a newer sass-loader. If you have custom Sass configuration, verify compatibility:

```ts
// next.config.ts
const nextConfig = {
  sassOptions: {
    // Options may need updating
  },
}
```

## Upgrade Steps

1. Install latest versions:
   ```bash
   npm install next@latest react@latest react-dom@latest
   ```

2. Run the codemod:
   ```bash
   npx @next/codemod@canary upgrade latest
   ```

3. Update `next.config.ts`:
   - Replace `experimental.ppr` with `cacheComponents: true`
   - Remove `experimental.turbopack`
   - Update `images.domains` to `images.remotePatterns`

4. Update all pages/layouts:
   - Add `await` to `params` and `searchParams`
   - Add `await` to `cookies()`, `headers()`, `draftMode()`

5. Rename `middleware.ts` to `proxy.ts`

6. Update `revalidateTag()` calls to include cacheLife profile

7. Review removed features list and replace as needed

## Codemod Commands

```bash
# Upgrade Next.js
npx @next/codemod@canary upgrade latest

# Fix async APIs
npx @next/codemod@canary next-async-request-api .

# Fix image config
npx @next/codemod@canary next-image-config .

# Fix dynamic APIs
npx @next/codemod@canary next-dynamic-api .
```
