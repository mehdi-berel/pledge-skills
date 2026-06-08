# Edge Runtime (Next.js 16)

## Overview

Next.js has two server runtimes:

| Runtime | APIs | Use Case |
|---------|------|----------|
| **Node.js** (default) | Full Node.js API set | Rendering, data fetching, file system |
| **Edge Runtime** | Limited Web Standard APIs | `proxy.ts`, lightweight middleware |

The Edge Runtime is used automatically for `proxy.ts`. It provides a lightweight, fast-starting environment close to the user (geographically distributed).

## Edge Runtime APIs

### Supported Web Standard APIs

- **Network:** `fetch`, `Request`, `Response`, `Headers`, `WebSocket`
- **Encoding:** `TextEncoder`, `TextDecoder`, `atob`, `btoa`
- **Streams:** `ReadableStream`, `WritableStream`, `TransformStream`
- **Crypto:** `crypto`, `CryptoKey`, `SubtleCrypto`
- **URL:** `URL`, `URLSearchParams`
- **Timers:** `setInterval`, `setTimeout`, `clearInterval`, `clearTimeout`
- **Web Standards:** `AbortController`, `ReadableStream`, `Blob`, `FormData`

### Next.js Specific Polyfills

- `AsyncLocalStorage` (Node.js compatibility)
- `NextRequest` / `NextResponse` (extended from Web Standard Request/Response)

### Unsupported APIs

The Edge Runtime does NOT support:
- Node.js built-in modules (`fs`, `path`, `http`, `crypto`, etc.)
- Native Node.js APIs (`process`, `Buffer`)
- `require()` (CommonJS)
- File system operations
- Child processes
- `eval()` / `new Function()`

## proxy.ts with Edge Runtime

`proxy.ts` runs in the Edge Runtime by default. It replaces `middleware.ts` from earlier Next.js versions.

### Basic Usage

```ts
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  // Edge Runtime: no fs, no db connections
  // Use lightweight logic only

  const country = request.geo?.country || 'US'
  const token = request.cookies.get('token')

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Add geo header for downstream use
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-country', country)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}
```

### Matcher (Config Object)

Control which paths the proxy runs on:

```ts
// proxy.ts
export const config = {
  // Run on specific paths
  matcher: ['/dashboard/:path*', '/admin/:path*'],

  // Negative matching (exclude)
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

**Matcher rules:**
- `*` matches a single path segment
- `**` matches any number of path segments
- `:param` captures dynamic segments
- `(?!...)` negative lookahead for exclusions

### Execution Order

Proxies execute in this order:
1. `proxy.ts` (Edge Runtime) — request interception
2. Route matching — find the matching App Router page
3. Layout render — root → nested layouts
4. Page render — Server Component

Proxies run **before** any page rendering. They cannot access rendered output.

### waitUntil (NextFetchEvent)

Defer work after the response is sent:

```ts
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function proxy(request: NextRequest, event: any) {
  const response = NextResponse.next()

  // Log analytics without blocking the response
  event.waitUntil(
    fetch('https://analytics.example.com/log', {
      method: 'POST',
      body: JSON.stringify({ path: request.nextUrl.pathname }),
    })
  )

  return response
}
```

Use `waitUntil` for:
- Analytics logging
- Cache warming
- Non-critical background tasks

## NextRequest / NextResponse

`NextRequest` extends Web Standard `Request` with Next.js-specific helpers:

```ts
import { NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
  // URL helpers
  request.nextUrl.pathname    // "/dashboard"
  request.nextUrl.searchParams // URLSearchParams
  request.nextUrl.locale       // "en-US"

  // Geolocation (Vercel only)
  request.geo?.country    // "US"
  request.geo?.city       // "San Francisco"
  request.geo?.region     // "CA"

  // IP address
  request.ip              // "1.2.3.4"

  // Cookies
  request.cookies.get('token')?.value
  request.cookies.has('session')

  // NextResponse helpers
  NextResponse.next()           // Continue to next handler
  NextResponse.redirect(url)    // 307 redirect
  NextResponse.rewrite(url)     // Rewrite URL internally
  NextResponse.json(data)       // JSON response
  NextResponse.json(data, { status: 201 })
}
```

## Environment Variables in Edge Runtime

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
EDGE_API_KEY=edge-key-xxx
```

```ts
// proxy.ts
export default function proxy(request: NextRequest) {
  // Both work in Edge Runtime
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const edgeKey = process.env.EDGE_API_KEY

  // Can make fetch calls to external APIs
  return NextResponse.next()
}
```

## userAgent from next/server

Parse and detect user agent information in Route Handlers or Server Components:

```tsx
import { userAgent } from 'next/server'

export default function proxy(request: Request) {
  const { ua, browser, device, os, isBot } = userAgent(request)

  console.log(ua)              // Full user agent string
  console.log(browser.name)    // "Chrome"
  console.log(browser.version) // "120.0.0.0"
  console.log(os.name)         // "Windows"
  console.log(device.type)     // "mobile" | "tablet" | undefined (desktop)
  console.log(isBot)           // true if crawler/bot

  if (isBot) {
    return NextResponse.next()
  }

  if (device.type === 'mobile') {
    return NextResponse.rewrite(new URL('/mobile', request.url))
  }

  return NextResponse.next()
}
```

**Detection capabilities:**
- `browser.name` — Chrome, Firefox, Safari, Edge, etc.
- `browser.version` — Browser version string
- `os.name` — Windows, macOS, Linux, Android, iOS
- `os.version` — OS version
- `device.model` — Device model (e.g., iPhone, Pixel)
- `device.type` — "mobile", "tablet", or undefined (desktop)
- `isBot` — Whether the request is from a known bot/crawler

## When to Use Edge Runtime

**Good for:**
- Request interception (`proxy.ts`)
- Auth checks (lightweight, no DB)
- A/B testing
- Geolocation-based redirects
- Bot detection
- Header manipulation

**Not for:**
- Database queries (use Server Components or Route Handlers)
- File system operations
- Heavy computation
- Server Actions (require Node.js runtime)
- Cache Components (require Node.js runtime)

## Adapters (Platform Deployment)

Build custom deployment adapters for Next.js:

```ts
// adapter.ts
import type { NextAdapter } from 'next/adapters'

const adapter: NextAdapter = {
  name: 'my-platform',

  async modifyConfig(config) {
    // Modify build config before build starts
    return {
      ...config,
      output: 'standalone',
    }
  },

  async onBuildComplete({
    routes,
    output,
    options,
  }) {
    // Process build output for your platform
    for (const route of routes) {
      console.log(`Route: ${route.pathname}`)
    }

    // Generate platform-specific config
    await writePlatformConfig(output)
  },
}

export default adapter
```

Configure in `next.config.ts`:

```ts
const nextConfig = {
  experimental: {
    adapterPath: require.resolve('./adapter.ts'),
  },
}
```

Or via environment variable:

```bash
NEXT_ADAPTER_PATH=./adapter.ts next build
```

### Adapter Use Cases

- Custom deployment platforms (internal infrastructure)
- Modifying build output for edge functions
- Generating platform-specific routing configs
- Implementing custom caching layers
- Transforming static output for CDN deployment

### Routing with @next/routing

Use `@next/routing` in adapters to apply Next.js route matching:

```ts
import { matchRoute } from '@next/routing'

const match = matchRoute('/blog/[slug]', '/blog/hello-world')
// { params: { slug: 'hello-world' } }
```

### Implementing PPR in an Adapter

Adapters can support Partial Prerendering by:
1. Identifying PPR routes in build output
2. Serving static shells from CDN
3. Streaming dynamic content from origin
4. Implementing the resume protocol for hydration

See the full adapter API reference for details.

## Edge Runtime vs Node.js Runtime

| Feature | Node.js | Edge Runtime |
|---------|---------|-------------|
| Startup time | Slower (cold start) | Faster |
| Memory | Higher | Lower |
| APIs | Full Node.js | Web Standards only |
| npm packages | Most | Lightweight only |
| Database drivers | Full support | HTTP-based only |
| File system | Yes | No |
| Geolocation | No | Yes (platform) |

## Important Notes

- `proxy.ts` uses Edge Runtime by default
- Server Components, Server Actions, and Cache Components require Node.js runtime
- The `runtime = 'edge'` export is **NOT supported** with Cache Components
- For database access, use Node.js runtime (Server Components or Route Handlers)
