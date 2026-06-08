# Environment Variables (Next.js 16)

## Loading Environment Variables

Next.js automatically loads environment variables from `.env*` files in the project root:

```
.env                 # Loaded in all environments
.env.local           # Loaded in all environments, ignored by git
.env.{development,test,production}     # Environment-specific
.env.{development,test,production}.local # Environment-specific, ignored by git
```

**Load order** (later overrides earlier):
1. `process.env` (system env)
2. `.env.{development,test,production}.local`
3. `.env.local` (not checked in test env)
4. `.env.{development,test,production}`
5. `.env`

## Server-Only Variables

Access in Server Components, Server Functions, Route Handlers:

```bash
# .env.local
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
API_SECRET_KEY=sk_live_xxx
```

```tsx
// Server Component or Server Function
export default async function Page() {
  const dbUrl = process.env.DATABASE_URL
  const apiKey = process.env.API_SECRET_KEY
  // ...
}
```

**Security:** Non-`NEXT_PUBLIC_` variables are NEVER sent to the browser.

## Browser-Accessible Variables

Prefix with `NEXT_PUBLIC_` to inline into the client bundle:

```bash
# .env.local
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXX-X
NEXT_PUBLIC_API_URL=https://api.example.com
```

```tsx
// Any component (Client or Server)
export default function Analytics() {
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID
  return <script src={`https://analytics.com/${analyticsId}`} />
}
```

**Important:** `NEXT_PUBLIC_` variables are **inlined at build time**. They don't update at runtime. If you build once and deploy to multiple environments, set these values at build time.

## Dynamic Lookups (NOT Inlined)

Dynamic lookups won't be inlined — the variable must be referenced directly:

```tsx
// ❌ Will NOT work — dynamic lookup
const varName = 'NEXT_PUBLIC_ANALYTICS_ID'
const id = process.env[varName]

// ❌ Will NOT work
const env = process.env
const id = env.NEXT_PUBLIC_ANALYTICS_ID

// ✅ Works — direct reference
const id = process.env.NEXT_PUBLIC_ANALYTICS_ID
```

## Runtime Environment Variables

For values that change at runtime (e.g., per-deployment), fetch them from an API:

```tsx
// app/api/env/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    featureFlag: process.env.FEATURE_FLAG,
    apiVersion: process.env.API_VERSION,
  })
}
```

```tsx
// Client Component
'use client'
import { useEffect, useState } from 'react'

export default function FeatureToggle() {
  const [features, setFeatures] = useState(null)

  useEffect(() => {
    fetch('/api/env').then(r => r.json()).then(setFeatures)
  }, [])

  return features?.featureFlag ? <NewFeature /> : <OldFeature />
}
```

## TypeScript Types

Add types for autocomplete:

```ts
// types/env.d.ts
namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly DATABASE_URL: string
    readonly API_SECRET_KEY: string
    readonly NEXT_PUBLIC_ANALYTICS_ID: string
    readonly NEXT_PUBLIC_API_URL: string
  }
}
```

## Testing Environment Variables

```bash
# .env.test
DATABASE_URL=postgresql://user:pass@localhost:5432/test
```

For unit tests, load `.env.test` manually:

```ts
// vitest.config.ts
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir, true) // true = test environment
```

## Best Practices

1. **Never commit `.env.local`** — it's in `.gitignore` by default
2. **Use `NEXT_PUBLIC_` sparingly** — only for values the UI genuinely needs
3. **Validate env vars at startup** — fail fast if required vars are missing
4. **Use runtime API for dynamic values** — don't rebuild for config changes
