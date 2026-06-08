# Third-Party Libraries & Backend for Frontend (Next.js 16)

## @next/third-parties

Optimized components for popular third-party libraries:

```bash
npm install @next/third-parties
```

### Google Tag Manager

```tsx
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleTagManager gtmId="GTM-XYZ" />
    </html>
  )
}
```

### Google Analytics

```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

### Google Maps Embed

```tsx
import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Map() {
  return (
    <GoogleMapsEmbed
      apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}
      height={400}
      width="100%"
      mode="place"
      q="Brooklyn+Bridge,New+York,NY"
    />
  )
}
```

### YouTube Embed

```tsx
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Video() {
  return <YouTubeEmbed videoid="dQw4w9WgXcQ" height={400} />
}
```

## Backend for Frontend (BFF) Pattern

Use Next.js as an API layer between frontend and backend services.

### Public Endpoints with Route Handlers

```ts
// app/api/weather/route.ts
export async function POST(request: Request) {
  const body = await request.json()

  // Transform, filter, aggregate data
  const weatherResponse = await fetch(
    `https://weather-api.com?lat=${body.lat}&lng=${body.lng}`
  )

  if (!weatherResponse.ok) {
    return new Response('Failed to fetch weather', { status: 500 })
  }

  const data = await weatherResponse.json()
  const parsed = parseWeatherData(data)

  return new Response(JSON.stringify(parsed), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

**Use POST for sensitive data** (avoids caching/logging of query params):

```ts
// ❌ Sensitive data in URL (may be cached/logged)
fetch(`/api/weather?lat=${lat}&lng=${lng}`)

// ✅ POST with body
fetch('/api/weather', {
  method: 'POST',
  body: JSON.stringify({ lat, lng }),
})
```

### Content Negotiation

```ts
// app/api/data/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const accept = request.headers.get('accept')
  const data = await fetchData()

  if (accept?.includes('application/xml')) {
    return new Response(toXML(data), {
      headers: { 'Content-Type': 'application/xml' },
    })
  }

  return NextResponse.json(data)
}
```

### Proxying to Backend

Route Handler as proxy:

```ts
// app/api/proxy/[[...slug]]/route.ts
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const pathname = slug?.join('/') || ''

  // Validate before forwarding
  const isValid = await validateRequest(request)
  if (!isValid) {
    return new Response(null, { status: 400 })
  }

  const proxyURL = new URL(pathname, 'https://backend-api.com')
  const proxyRequest = new Request(proxyURL, request)

  try {
    return fetch(proxyRequest)
  } catch (error) {
    return new Response('Proxy error', { status: 500 })
  }
}
```

Or use `next.config.ts` rewrites:

```ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://backend-api.com/:path*',
      },
    ]
  },
}
```

### Rate Limiting in Route Handlers

```ts
// app/api/data/route.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  return NextResponse.json(await fetchData())
}
```

### Webhooks

```ts
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }
}
```

### Security Best Practices

1. **Validate all inputs** — Never trust client data
2. **Use `request.clone()`** before reading body multiple times
3. **Set proper CORS headers** for cross-origin requests
4. **Verify webhook signatures** — Don't process unverified webhooks
5. **Rate limit public endpoints** — Protect against abuse
6. **Don't expose internal APIs** — Use transformation/proxy layers
7. **Secure Server Functions** — Always verify auth before mutations

## When to Use BFF vs Direct API Calls

| Scenario | Approach |
|----------|----------|
| Simple CRUD, public data | Direct API calls from Client Components |
| Sensitive data, auth required | Server Components or Route Handlers |
| Data transformation/aggregation | Route Handlers (BFF) |
| File uploads | Route Handlers with multipart parsing |
| Real-time data | Route Handlers with streaming |
| Microservice proxy | `next.config.ts` rewrites or Route Handlers |
