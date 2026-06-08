# Metadata and SEO (Next.js 16)

## Static Metadata

Export a `Metadata` object from any layout or page:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'A blog about Next.js',
  openGraph: {
    title: 'My Blog',
    images: ['/og-image.jpg'],
  },
}
```

## Generated Metadata

Use `generateMetadata` for data-dependent metadata:

```tsx
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug
  const post = await fetch(`https://api.example.com/blog/${slug}`).then(r => r.json())

  return {
    title: post.title,
    description: post.description,
  }
}
```

## Memoizing Data Requests

Avoid duplicate fetches when both `generateMetadata` and the page need the same data:

```tsx
import { cache } from 'react'

export const getPost = cache(async (slug: string) => {
  return db.posts.findBySlug(slug)
})

export async function generateMetadata({ params }: Props) {
  const post = await getPost((await params).slug)
  return { title: post.title }
}

export default async function Page({ params }: Props) {
  const post = await getPost((await params).slug)
  return <div>{post.title}</div>
}
```

## Streaming Metadata

For dynamically rendered pages, Next.js streams metadata separately — it injects into HTML once `generateMetadata` resolves without blocking UI rendering.

Streaming is **disabled** for bots/crawlers that expect metadata in `<head>` (e.g., Twitterbot, Slackbot, Bingbot). Customize with `htmlLimitedBots` in `next.config.ts`:

```ts
const nextConfig = {
  htmlLimitedBots: 'Twitterbot|Slackbot|Bingbot',
}
```

Prerendered pages don't use streaming — metadata is resolved at build time.

## generateImageMetadata

Generate multiple icon sizes or image variants in a single file:

```tsx
// app/icon.tsx
import { ImageResponse } from 'next/og'

export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return [
    {
      id: 'small',
      alt: `Small icon for ${slug}`,
      size: { width: 32, height: 32 },
      contentType: 'image/png',
    },
    {
      id: 'large',
      alt: `Large icon for ${slug}`,
      size: { width: 180, height: 180 },
      contentType: 'image/png',
    },
  ]
}

export default async function Icon({ id }: { id: string }) {
  const size = id === 'small' ? 32 : 180
  return new ImageResponse(
    <div style={{ fontSize: size / 2, background: 'black', width: '100%', height: '100%' }}>A</div>,
    { width: size, height: size }
  )
}
```

Useful for generating multiple favicon sizes without hard-coding metadata values.

## File-Based Metadata

Place these in any route segment. The most specific file wins:

```
favicon.ico / icon.png / apple-icon.png   # App icons
opengraph-image.jpg / twitter-image.jpg    # OG images (static)
robots.txt / robots.ts                     # Crawler rules
sitemap.xml / sitemap.ts                   # Sitemap
```

### Generated OG Images

Create dynamic OG images with `ImageResponse`:

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getPost } from '@/lib/data'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

**Note:** `ImageResponse` supports flexbox and a subset of CSS. Grid does not work. See [Vercel OG Playground](https://og-playground.vercel.app/).

## generateViewport

Generate dynamic viewport settings:

```tsx
import type { Viewport } from 'next'

export async function generateViewport({ params }: { params: Promise<{ slug: string }> }): Promise<Viewport> {
  const { slug } = await params
  const post = await getPost(slug)

  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: post.themeColor || '#000000',
    colorScheme: post.darkMode ? 'dark' : 'light',
  }
}
```

Or export a static `viewport` object:

```tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}
```

### App Icons (Generated)

```tsx
// app/icon.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ fontSize: 24, background: 'black', width: '100%', height: '100%' }}>
        A
      </div>
    ),
    { width: 32, height: 32 }
  )
}
```
