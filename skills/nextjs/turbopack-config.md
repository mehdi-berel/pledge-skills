# Turbopack, React Compiler, and Configuration (Next.js 16)

## Turbopack (Stable, Default)

Turbopack is the default bundler for both development and production. No configuration needed.

- 2-5x faster production builds
- Up to 10x faster Fast Refresh

To keep using webpack:
```bash
next dev --webpack
next build --webpack
```

### Turbopack File System Caching (beta)

Store compiler artifacts on disk for faster dev restarts:

```ts
// next.config.ts
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
}
```

## React Compiler (Stable)

Automatic memoization without `useMemo` or `React.memo`:

```ts
// next.config.ts
const nextConfig = {
  reactCompiler: true,
}
```

Install the Babel plugin:
```bash
npm install babel-plugin-react-compiler@latest
```

**Not enabled by default** — compile times are higher when enabled.

## proxy.ts (Replaces middleware.ts)

In Next.js 16, `middleware.ts` is deprecated. Use `proxy.ts`:

```ts
// proxy.ts (at project root)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/old')) {
    return NextResponse.redirect(new URL('/new', request.url))
  }
  return NextResponse.next()
}
```

- `proxy.ts` runs on the Node.js runtime
- `middleware.ts` still works but is deprecated and will be removed
- Simply rename `middleware.ts` to `proxy.ts` and rename the exported function to `proxy`

## Configuration (next.config.ts)

Use TypeScript-first configuration:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com' },
    ],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  // Disable streaming metadata for specific bots
  htmlLimitedBots: 'Twitterbot|Slackbot',
}

export default nextConfig
```

## React 19.2 Features

Next.js 16 ships with React 19.2 (Canary):

- **View Transitions**: Animate elements during navigation
- **useEffectEvent**: Extract non-reactive logic from Effects
- **Activity**: Render background activity with `display: none` while preserving state
- **React Compiler**: Automatic memoization (stable, opt-in)

## Build Adapters API (alpha)

Create custom adapters to hook into the build process:

```ts
const nextConfig = {
  experimental: {
    adapterPath: require.resolve('./my-adapter.js'),
  },
}
```

Useful for deployment platforms that need to modify build output.

## Instrumentation

```ts
// instrumentation.ts
export async function register() {
  // Initialize observability, monitoring, etc.
}
```

## Self-Hosting (Docker)

```ts
const nextConfig = {
  output: 'standalone',
}
```

Generates a minimal `server.js` and `node_modules` for Docker deployment.

For multi-instance ISR, configure a custom cache handler:
```ts
const nextConfig = {
  cacheHandler: require.resolve('./cache-handler.js'),
}
```

## Redirects, Rewrites, and Headers

```ts
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true, // 308 redirect
      },
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: false, // 307 redirect
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}
```

## Other Common Config Options

```ts
const nextConfig: NextConfig = {
  basePath: '/docs',              // Deploy under a subpath
  assetPrefix: 'https://cdn.com', // Serve static assets from CDN
  compress: true,                  // Enable gzip compression (default: true)
  poweredByHeader: false,        // Remove X-Powered-By header
  productionBrowserSourceMaps: true, // Enable source maps in production
  reactStrictMode: true,           // Enable React Strict Mode
  trailingSlash: true,             // URLs end with /
  pageExtensions: ['tsx', 'ts'], // Only .tsx/.ts files are pages

  // Transpile specific packages from node_modules
  transpilePackages: ['some-esm-package'],

  // Mark packages as external on the server (don't bundle)
  serverExternalPackages: ['bcrypt', 'sharp'],

  // Optimize specific package imports (automatic tree-shaking)
  optimizePackageImports: ['lodash', 'date-fns'],

  // Environment variables available at build time
  env: {
    CUSTOM_VAR: 'value',
  },
}
```

## Custom Webpack Config (Legacy)

If you need webpack customization (not recommended with Turbopack):

```ts
const nextConfig: NextConfig = {
  webpack: (config, { buildId, dev, isServer, nextRuntime, webpack }) => {
    // Modify config here
    config.plugins.push(new webpack.DefinePlugin({
      __BUILD_ID__: JSON.stringify(buildId),
    }))
    return config
  },
}
```

## Turbopack Configuration

```ts
const nextConfig: NextConfig = {
  turbopack: {
    // Resolve aliases
    resolveAlias: {
      underscore: 'lodash',
    },
    // Resolve extensions
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    // Custom loaders
    loaders: {
      '.svg': {
        loader: '@svgr/webpack',
        options: { typescript: true },
      },
    },
    // Ignore specific issues
    ignoreIssue: [
      { message: 'Some known non-critical issue' },
    ],
  },
}
```

## Pages Router (Legacy)

The Pages Router is still supported in Next.js 16. Key differences from App Router:

| Feature | Pages Router | App Router |
|---------|-------------|------------|
| Layout | `_app.js`, `_document.js` | `layout.tsx` |
| Routing | `pages/index.js` = `/` | `app/page.tsx` = `/` |
| Data fetching | `getServerSideProps`, `getStaticProps`, `getStaticPaths` | Direct async in Server Components |
| API routes | `pages/api/*` | `app/*/route.ts` |
| Params | Synchronous: `ctx.params` | Async: `await params` |
| router | `next/router` | `next/navigation` |
| Caching | Implicit (auto) | Explicit opt-in (`"use cache"`) |

**Pages Router example:**

```tsx
// pages/blog/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchPosts()
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await fetchPost(params!.slug as string)
  return { props: { post }, revalidate: 60 }
}

export default function BlogPost({ post }: { post: Post }) {
  return <article>{post.content}</article>
}
```

### Custom App (`pages/_app.js`)

Wraps all pages. Used for global styles, providers, and layout:

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

### Custom Document (`pages/_document.js`)

Controls the entire HTML document structure. Useful for adding attributes to `<html>` or `<body>`, or injecting scripts into `<head>`:

```tsx
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

**Only rendered on the server.** Cannot use browser APIs or event handlers.

### Pages Router API Routes

```ts
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Hello from Pages Router' })
}
```

### appDir Config

Disable App Router and use Pages Router exclusively:

```ts
const nextConfig = {
  appDir: false, // Default: true
}
```

**Recommendation:** Use App Router for all new projects. Pages Router is maintained for backward compatibility.

## Missing Config Options Reference

### authInterrupts

Enable `forbidden()` and `unauthorized()` without explicit `error.tsx`:

```ts
const nextConfig = {
  authInterrupts: true,
}
```

### serverActions

Configure Server Actions body size limit and allowed origins:

```ts
const nextConfig = {
  serverActions: {
    bodySizeLimit: '2mb',         // Max request body size
    allowedOrigins: ['my-site.com', '*.my-site.com'],
  },
}
```

### distDir

Customize build output directory:

```ts
const nextConfig = {
  distDir: 'build', // Default: '.next'
}
```

### typedRoutes

Enable type-safe route checking for `next/link` and `next/router`:

```ts
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
}
```

When enabled, invalid paths in `<Link href>` produce TypeScript errors:
```tsx
// ❌ TypeScript error: "/dahsboard" is not a valid route
<Link href="/dahsboard">Dashboard</Link>
```

### viewTransition

Enable View Transition API support:

```ts
const nextConfig = {
  viewTransition: true,
}
```

### devIndicators

Customize dev indicators shown in the browser:

```ts
const nextConfig = {
  devIndicators: {
    buildActivity: true,        // Show build progress indicator
    buildActivityPosition: 'bottom-right',
  },
}
```

### logging

Control build and runtime logging:

```ts
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,  // Log full fetch URLs in dev
    },
  },
}
```

### crossOrigin

Set CORS policy for scripts:

```ts
const nextConfig = {
  crossOrigin: 'anonymous', // or 'use-credentials'
}
```

### taint

Enable tainting for Server Environment Variables:

```ts
const nextConfig = {
  taint: true,
}
```

### onDemandEntries

Control how long dev pages stay in memory:

```ts
const nextConfig = {
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // 25 seconds
    pagesBufferLength: 2,
  },
}
```

### urlImports

Import modules directly from URLs:

```ts
const nextConfig = {
  urlImports: ['https://cdn.example.com'],
}
```

Then import directly:
```tsx
import confetti from 'https://cdn.example.com/confetti.js'
```

### serverComponentsHmrCache

Enable/disable HMR cache for Server Components:

```ts
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: true,
  },
}
```

### allowedDevOrigins

Restrict allowed origins in development to prevent unauthorized requests:

```ts
const nextConfig = {
  allowedDevOrigins: ['localhost', '*.local'],
}
```

### proxyClientMaxBodySize

Set the maximum body size for requests handled by `proxy.ts`:

```ts
const nextConfig = {
  proxyClientMaxBodySize: '1mb', // Default: '1mb'
}
```

### reactMaxHeadersLength

Configure the maximum headers length for React's streaming renderer:

```ts
const nextConfig = {
  reactMaxHeadersLength: 6000, // Default
}
```

### deploymentId

Specify a deployment identifier for cache busting:

```ts
const nextConfig = {
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
}
```

### generateBuildId

Generate a custom build ID (replaces the default timestamp):

```ts
const nextConfig = {
  generateBuildId: async () => {
    // e.g., use Git commit SHA
    return process.env.GIT_COMMIT_SHA || 'dev'
  },
}
```

### generateEtags

Enable or disable ETag generation for static files:

```ts
const nextConfig = {
  generateEtags: true, // Default
}
```

### httpAgentOptions

Configure the Node.js HTTP agent used by `fetch()`:

```ts
const nextConfig = {
  httpAgentOptions: {
    keepAlive: true,
  },
}
```

### staticGeneration

Configure static generation behavior:

```ts
const nextConfig = {
  staticGeneration: {
    // Maximum number of pages to generate statically
    maxPages: 100,
    // Allow dynamic params in generateStaticParams
    allowDynamicParams: true,
  },
}
```

### cssChunking

Configure CSS chunking strategy:

```ts
const nextConfig = {
  cssChunking: 'loose', // 'loose' (default) or 'strict'
}
```

- `loose`: CSS is chunked more aggressively for better caching
- `strict`: CSS is chunked less aggressively, fewer requests but larger chunks

### useLightningcss

Use Lightning CSS instead of PostCSS for CSS processing:

```ts
const nextConfig = {
  useLightningcss: true,
}
```

### inlineCss

Inline critical CSS into the HTML to reduce render-blocking requests:

```ts
const nextConfig = {
  inlineCss: true,
}
```

### exportPathMap

Define custom path mappings for static export (`output: 'export'`):

```ts
const nextConfig = {
  output: 'export',
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      ...defaultPathMap,
      '/custom-page': { page: '/about' },
    }
  },
}
```

## Next.js CLI Commands

```bash
# Development
next dev                    # Start dev server (Turbopack by default)
next dev --webpack          # Use webpack instead
next dev --turbo            # Explicitly use Turbopack

# Production
next build                  # Build for production
next build --webpack        # Build with webpack
next start                  # Start production server

# Other
next lint                   # ⚠️ REMOVED in v16 — use ESLint directly
next analyze                # Analyze bundle size (with @next/bundle-analyzer)
```
