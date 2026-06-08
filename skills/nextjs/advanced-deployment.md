# Advanced Deployment Topics (Next.js 16)

## Multi-Tenant Applications

Serve multiple tenants from a single Next.js app using dynamic segments:

```
app/
  [tenant]/
    layout.tsx
    page.tsx
    dashboard/
      page.tsx
```

```tsx
// app/[tenant]/layout.tsx
import { notFound } from 'next/navigation'

const tenants = ['acme', 'globex', 'initech']

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  if (!tenants.includes(tenant)) {
    notFound()
  }

  return (
    <div data-tenant={tenant}>
      <TenantNav tenant={tenant} />
      {children}
    </div>
  )
}
```

**Recommended approach:** See the [Platforms Starter Kit](https://vercel.com/templates/next.js/platforms-starter-kit) for a complete example with custom domains.

## Multi-Zones (Micro-frontends)

Deploy multiple Next.js apps under a single domain using `proxy.ts`:

```ts
// proxy.ts (in main app)
import { NextResponse } from 'next/server'

export default function proxy(request: Request) {
  const { pathname } = (request as any).nextUrl

  if (pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(
      new URL(pathname, 'https://dashboard-app.vercel.app')
    )
  }

  if (pathname.startsWith('/blog')) {
    return NextResponse.rewrite(
      new URL(pathname, 'https://blog-app.vercel.app')
    )
  }

  return NextResponse.next()
}
```

**Linking between zones:**

```tsx
// Use absolute URLs for cross-zone navigation
<Link href="/blog/my-post">Read Blog Post</Link>
```

**Sharing code between zones:**

Create a shared UI package:

```
packages/
  ui/
    package.json
    src/
      Button.tsx
      Card.tsx
apps/
  main/
  dashboard/
  blog/
```

Configure `transpilePackages` in each app:

```ts
// apps/main/next.config.ts
const nextConfig = {
  transpilePackages: ['@acme/ui'],
}
```

**Server Actions across zones:**

Server Actions only work within the same app/zone. For cross-zone mutations, use API routes or direct HTTP requests.

## Bundle Analyzer

### Turbopack Bundle Analyzer (Experimental)

```bash
npx next build --analyze
```

This opens a visual report in your browser showing:
- Bundle size by module
- Import chains
- Duplicate dependencies

### Webpack Bundle Analyzer

```bash
npm install -D @next/bundle-analyzer
```

```ts
// next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})({
  // your config
})
```

```bash
ANALYZE=true npm run build
```

## Optimizing Large Bundles

### Packages with Many Exports

Use `optimizePackageImports` for tree-shaking:

```ts
const nextConfig = {
  optimizePackageImports: [
    'lodash',
    'date-fns',
    '@mui/material',
    '@radix-ui/react-icons',
  ],
}
```

### Opting Out of Bundling (Server)

For large native dependencies, mark them as external:

```ts
const nextConfig = {
  serverExternalPackages: ['sharp', 'bcrypt', 'sqlite3'],
}
```

## PWA (Progressive Web App)

Next.js doesn't have built-in PWA support, but you can use `next-pwa`:

```bash
npm install next-pwa
```

```ts
// next.config.ts
import withPWA from 'next-pwa'

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})({
  // your config
})
```

Add to root layout:

```tsx
// app/layout.tsx
export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#000000',
}
```

## Video Optimization

Use `next/video` for video optimization:

```tsx
import Video from 'next/video'

export default function Hero() {
  return (
    <Video
      src="/intro.mp4"
      width={1920}
      height={1080}
      controls
      preload="none"
    />
  )
}
```

For external videos, use `video.js` or native HTML5 video.

## OpenGraph and Twitter Cards

Complete social media metadata:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Page description',
  openGraph: {
    title: 'My Page',
    description: 'Page description',
    url: 'https://example.com',
    siteName: 'My Site',
    images: [
      {
        url: 'https://example.com/og.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Page',
    description: 'Page description',
    images: ['https://example.com/og.png'],
  },
}
```

## robots.txt

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/private'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

## sitemap.xml

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()

  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `https://example.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
```

For multiple sitemaps, use `generateSitemaps`:

```ts
// app/sitemap.ts
export async function generateSitemaps() {
  const totalPosts = await getPostCount()
  const sitemaps = Math.ceil(totalPosts / 50000)

  return Array.from({ length: sitemaps }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }) {
  const posts = await getPosts({ page: id, limit: 50000 })
  return posts.map((post) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }))
}
```
