# Authentication, Authorization, and Security (Next.js 16)

## Overview

Authentication in Next.js breaks down into three concepts:
1. **Authentication**: Verifies who the user is (username/password, OAuth, etc.)
2. **Session Management**: Tracks auth state across requests
3. **Authorization**: Controls what routes and data the user can access

**Recommendation:** Use an auth library (Auth.js/NextAuth.js, Clerk, Lucia, etc.) rather than building custom auth from scratch.

## Session Management

### Stateless Sessions (JWT in cookie)

Session data stored in browser cookies. Sent with each request.

```tsx
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.SESSION_SECRET)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function decrypt(session: string) {
  const { payload } = await jwtVerify(session, secret, { clockTolerance: 60 })
  return payload
}

export async function createSession(userId: string) {
  const session = await encrypt({ userId, role: 'admin' })
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
}
```

### Database Sessions

Store session data server-side, browser only gets encrypted session ID:

```tsx
import { cookies } from 'next/headers'

export async function createSession(userId: string) {
  const sessionId = crypto.randomUUID()
  await db.sessions.create({
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })

  const cookieStore = await cookies()
  cookieStore.set('session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
}
```

## Authorization Patterns

### Data Access Layer (DAL)

Centralize authorization logic:

```tsx
// app/lib/dal.ts
import { cookies } from 'next/headers'
import { decrypt } from './session'

export async function verifySession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  if (!sessionCookie) return null

  const session = await decrypt(sessionCookie)
  if (!session?.userId) return null

  return session as { userId: string; role: string }
}

export async function getUserData(userId: string) {
  const session = await verifySession()
  if (!session || session.userId !== userId) {
    throw new Error('Unauthorized')
  }
  return db.users.findById(userId)
}
```

### Auth Checks in Pages

Do auth checks close to data, NOT in layouts (layouts don't re-render on navigation due to Partial Rendering):

```tsx
// app/dashboard/page.tsx
import { verifySession } from '@/app/lib/dal'

export default async function DashboardPage() {
  const session = await verifySession()
  if (!session) {
    redirect('/login')
  }
  const user = await getUserData(session.userId)
  return <div>Welcome, {user.name}</div>
}
```

### Auth Checks in Server Actions

Always verify auth inside every Server Action:

```tsx
'use server'
import { verifySession } from '@/app/lib/dal'

export async function deleteUser(formData: FormData) {
  const session = await verifySession()
  if (session?.role !== 'admin') {
    return { error: 'Unauthorized' }
  }
  const userId = formData.get('userId')
  await db.users.delete(userId)
  revalidateTag('users')
}
```

### Optimistic Checks with Proxy (Optional)

For quick UI decisions based on cookie data:

```ts
// proxy.ts
import { NextResponse } from 'next/server'

export default async function proxy(request: Request) {
  const token = request.cookies.get('token')
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
```

## Data Security

### Tainting (React Experimental)

Prevent accidental exposure of sensitive data to the client:

```tsx
import { experimental_taintObjectReference } from 'react'

export async function getUserData() {
  const user = await db.users.findById('123')
  experimental_taintObjectReference('Do not pass raw user objects to client', user)
  return user
}
```

Enable in `next.config.ts`:
```ts
const nextConfig = {
  experimental: { taint: true },
}
```

### Server-Only Modules

Prevent server-only code from running on the client:

```tsx
import 'server-only'

export async function getSecretData() {
  // This will throw a build error if imported in a Client Component
  return db.secrets.findAll()
}
```

### Environment Variables

- Server-only: `DATABASE_URL`, `API_SECRET` (no prefix)
- Client-accessible: `NEXT_PUBLIC_ANALYTICS_ID` (prefix with `NEXT_PUBLIC_`)
- `NEXT_PUBLIC_` vars are inlined at build time — they don't update at runtime

## Content Security Policy (CSP)

### Nonce-Based CSP (Recommended)

```tsx
// proxy.ts
import { NextResponse } from 'next/server'

export default function proxy(request: Request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = `default-src 'self'; script-src 'nonce-${nonce}' 'strict-dynamic'; style-src 'nonce-${nonce}'`

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  return NextResponse.next({ request: { headers: requestHeaders } })
}
```

Using nonces **forces dynamic rendering** (no static generation possible). For static sites, use Subresource Integrity (SRI) instead.

### Subresource Integrity (Experimental)

Enable in `next.config.ts`:
```ts
const nextConfig = {
  experimental: { sri: { algorithm: 'sha384' } },
}
```

## Form Validation with Zod

```tsx
'use server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function signup(prevState: any, formData: FormData) {
  const validated = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  // Proceed with signup
}
```

## Rate Limiting

Implement in your DAL or route handlers:

```tsx
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

export async function serverAction(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for')
  const { success } = await ratelimit.limit(ip ?? 'anonymous')
  if (!success) {
    return { error: 'Rate limit exceeded' }
  }
  // ...
}
```
