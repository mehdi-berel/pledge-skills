# Project Structure and Routing (Next.js 16)

## Component Hierarchy (Rendering Order)

In nested routes, components render in this order:

```
layout.js        → Shared UI across all routes (persists, doesn't re-render on nav)
  template.js    → Like layout but re-mounts on every navigation
    error.js     → Error boundary (catches errors in child segments)
      loading.js → Suspense boundary (shown while children load)
        not-found.js → Error boundary for 404s
          page.js  → Route-specific UI
            (nested layout.js / page.js continues...)
```

Components are rendered recursively — each child segment nests inside its parent's layout.

## File Colocation

Files in `app/` route segments are **not publicly routable** unless they match a Next.js file convention (`page.js`, `route.js`, `layout.js`, etc.). This means you can safely colocate project files alongside routes:

```
app/
  blog/
    [slug]/
      page.tsx          # Public route: /blog/my-post
      get-post.ts       # Not routable — safe to colocate
      types.ts          # Not routable — safe to colocate
```

You don't have to colocate in `app/`. You can also keep files outside the `app` directory if you prefer.

## Top-Level Structure

```
app/          # App Router (default)
pages/        # Pages Router (legacy)
public/       # Static assets (served from /)
src/          # Optional: move app/ inside src/
```

## public Folder (Static Assets)

Files in `public/` are served at the root path `/`:

```
public/
  favicon.ico
  robots.txt
  images/
    logo.png
  fonts/
    custom.woff2
```

```tsx
// Reference from code
import Image from 'next/image'

export default function Page() {
  // Direct URL reference
  return <Image src="/images/logo.png" alt="Logo" width={100} height={50} />
}
```

**Rules:**
- Files in `public/` are served as static files, not processed by Next.js
- Don't put files in `public/` that should be processed by Next.js (use `app/` for those)
- `robots.txt` in `public/` takes precedence over `app/robots.ts`
- `favicon.ico` in `public/` is used as default if no `app/icon.tsx`

### src Directory

Move `app/` inside `src/` for organizational preference:

```
src/
  app/
    layout.tsx
    page.tsx
  lib/
    utils.ts
  components/
    Button.tsx
public/
  images/
```

When using `src/`, all application code goes inside it. `public/` stays at the project root.

**Note:** The `src/` directory is optional and purely for preference. Next.js works identically with or without it.

**Top-level files:**
```
next.config.ts       # Configuration (TypeScript-first)
proxy.ts             # Network boundary (replaces middleware.ts)
instrumentation.ts   # Observability hooks
.env / .env.local    # Environment variables
```

## Routing Files

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI (makes route public) |
| `layout.tsx` | Shared UI, wraps children. Root MUST include `<html>` and `<body>`. Preserves state, does NOT re-render on nav |
| `loading.tsx` | Loading skeleton (streams via Suspense) |
| `error.tsx` | Error boundary. **Must be Client Component** |
| `not-found.tsx` | 404 UI |
| `global-error.tsx` | Global error fallback (replaces entire page) |
| `route.ts` | API route handler |
| `template.tsx` | Like layout but **re-mounts** on every navigation. Use for animations, state reset |
| `default.tsx` | Fallback for parallel routes when slot has no matching state. Renders when the parallel route slot doesn't have a matching page for the current URL |

## Dynamic Routes

```
[slug]              # Single param: /blog/my-post
[...slug]           # Catch-all: /shop/clothing/shirts
[[...slug]]         # Optional catch-all: /docs or /docs/getting-started
```

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  return <div>{post.title}</div>
}
```

## generateStaticParams

For static generation of dynamic routes at build time:

```tsx
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

## Route Groups (No URL Impact)

```
app/(marketing)/page.tsx    # URL is still /
app/(shop)/cart/page.tsx    # URL is /cart
```

Use route groups to:
- Organize code without changing URLs
- Apply different layouts to different parts of the app
- Create multiple root layouts

## Private Folders (Not Routable)

```
app/_lib/utils.ts           # _ prefix = not a route segment
app/_components/Button.tsx
```

Private folders are useful for:
- Separating UI logic from routing logic
- Consistently organizing internal files across a project
- Sorting and grouping files in code editors
- Avoiding potential naming conflicts with future Next.js file conventions

**URL segments starting with underscore:** Use `%5F` prefix (URL-encoded underscore):

```
app/%5Fhidden/page.tsx       # Route: /_hidden
```

## Parallel Routes (@slot)

Named slots rendered by a parent layout:

```
app/
  layout.tsx          # Renders {children}, {team}, {analytics}
  @team/
    page.tsx          # props.team in layout
  @analytics/
    page.tsx          # props.analytics in layout
```

```tsx
// app/layout.tsx
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}
      {props.team}
      {props.analytics}
    </section>
  )
}
```

## Intercepted Routes (Modals)

Render a route inside the current layout without changing URL:

```
(.)folder        # Same level
(..)folder       # One level up
(..)(..)folder   # Two levels up
(...)folder      # Root level
```

Example: Show a photo detail as a modal over the gallery:
```
app/
  photos/
    page.tsx           # Gallery list
    [id]/
      page.tsx         # Full photo page (direct visit)
  photos/
    (.)[id]/
      page.tsx         # Modal version (intercepted from gallery)
```

Close intercepted modals with `router.back()`:

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <div className="modal-overlay" onClick={() => router.back()}>
      <div className="modal-content">{children}</div>
    </div>
  )
}
```

## Linking and Navigation

```tsx
import Link from 'next/link'

// Standard link
<Link href="/blog/my-post">Read more</Link>

// With prefetch disabled
<Link href="/dashboard" prefetch={false}>Dashboard</Link>
```

**Programmatic navigation (Client Component):**

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  return <button onClick={() => router.push('/dashboard')}>Go</button>
}
```

**Important:** Use `next/navigation`, NOT `next/router` (that's Pages Router).
