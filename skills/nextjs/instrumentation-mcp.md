# Instrumentation and MCP Server (Next.js 16)

## Instrumentation

Run code at server startup with `instrumentation.ts`:

```ts
// instrumentation.ts
export async function register() {
  // Runs once when the server starts
  // Initialize observability, monitoring, etc.
  await initOpenTelemetry()
}
```

### Client-Side Instrumentation

For client-side setup, use `instrumentation-client.ts`:

```ts
// instrumentation-client.ts
export function onInit() {
  // Runs once in the browser
  // Initialize client-side analytics, error tracking, etc.
  initAnalytics()
}
```

## MCP Server (Next.js Devtools MCP)

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) enables coding agents to access your application's internals.

**Setup:**

```bash
npm install next-devtools-mcp
```

```ts
// next.config.ts
const nextConfig = {
  experimental: {
    mcp: true,
  },
}
```

Run your dev server with MCP:

```bash
npx next-devtools-mcp
```

**Capabilities:**
- Application runtime access (read state, errors, routes)
- Development tools integration
- Error detection and diagnosis
- Upgrade and best practice recommendations

### onRequestError

Handle request errors globally:

```ts
// instrumentation.ts

export async function register() {
  await initOpenTelemetry()
}

// Runs when a request error occurs (Next.js 16+)
export async function onRequestError(
  err: Error,
  request: {
    path: string
    method: string
    headers: Record<string, string>
  },
  context: {
    routerKind: 'App Router' | 'Pages Router'
    renderKind: 'Server Components' | 'Route Handler'
    routePath: string
  }
) {
  await fetch('https://monitoring.example.com/errors', {
    method: 'POST',
    body: JSON.stringify({
      error: err.message,
      stack: err.stack,
      path: request.path,
      routerKind: context.routerKind,
    }),
  })
}
```

## OpenTelemetry

Instrument your app with OpenTelemetry for distributed tracing:

```bash
npm install @opentelemetry/api @opentelemetry/sdk-node
```

```ts
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  }),
})

export async function register() {
  sdk.start()
}
```

## Speed Insights

Measure and track page performance:

```bash
npm install @vercel/speed-insights
```

```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## Analytics

Vercel Analytics for web vitals:

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Default Spans in Next.js (OpenTelemetry)

Next.js automatically creates the following spans when OpenTelemetry is configured:

| Span Name | Description |
|-----------|-------------|
| `[http.method] [next.route]` | Route request (e.g., `GET /blog/[slug]`) |
| `render route (app) [next.route]` | App Router Server Component render |
| `fetch [http.method] [http.url]` | `fetch()` calls inside components |
| `executing api route (app) [next.route]` | App Router Route Handler execution |
| `render route (pages) [next.route]` | Pages Router SSR |
| `getServerSideProps [next.route]` | Pages `getServerSideProps` |
| `getStaticProps [next.route]` | Pages `getStaticProps` |
| `generateMetadata [next.page]` | Metadata generation |
| `resolve page components` | Page component resolution |
| `resolve segment modules` | Layout/segment module resolution |
| `start response` | Response streaming start |

### Custom Spans

Create your own spans for tracing:

```ts
// lib/otel.ts
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('my-app', '1.0.0')

export async function fetchUserData(userId: string) {
  return tracer.startActiveSpan('fetch-user-data', async (span) => {
    span.setAttribute('user.id', userId)

    try {
      const data = await db.users.findById(userId)
      span.setAttribute('user.found', !!data)
      return data
    } catch (error) {
      span.recordException(error as Error)
      throw error
    } finally {
      span.end()
    }
  })
}
```

### Testing Your Instrumentation

Run your app with the `OTEL_LOG_LEVEL` environment variable:

```bash
OTEL_LOG_LEVEL=debug next dev
```

This prints all spans to the console for verification.

## Vercel Analytics & Speed Insights

### Speed Insights

```bash
npm install @vercel/speed-insights
```

```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

Tracks Core Web Vitals: TTFB, FCP, LCP, CLS, INP. Data visible in Vercel dashboard.

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

Tracks page views, visitors, referrers, and geographic data. Compliant with GDPR — no cookies used.

### Web Vitals Reporting

```tsx
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
    // Send to analytics endpoint
    fetch('/api/vitals', {
      method: 'POST',
      body: JSON.stringify(metric),
    })
  })

  return null
}
