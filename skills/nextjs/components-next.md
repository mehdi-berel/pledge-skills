# Built-in Next.js Components

## `<Form>` (next/form)

Extends HTML `<form>` with prefetching of loading UI, client-side navigation on submission, and progressive enhancement.

**Search params form:**

```tsx
import Form from 'next/form'

export default function SearchForm() {
  return (
    <Form action="/search">
      {/* On submit, navigates to /search?query=abc with client-side nav */}
      <input name="query" placeholder="Search..." />
      <button type="submit">Search</button>
    </Form>
  )
}
```

**Same-route search params:**

```tsx
<Form action=""> {/* Navigates to same route with updated search params */}
  <input name="sort" />
</Form>
```

**With Server Action:**

```tsx
import Form from 'next/form'
import { createPost } from './actions'

export default function PostForm() {
  return (
    <Form action={createPost}>
      <input name="title" required />
      <button type="submit">Create Post</button>
    </Form>
  )
}
```

The `<Form>` component prefetches shared UI (`layout.js`, `loading.js`) when visible in the viewport. On submission, it immediately navigates and shows loading UI.

## `<Script>` (next/script)

Optimize third-party scripts with loading strategies:

```tsx
import Script from 'next/script'

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <Script src="https://analytics.com/script.js" strategy="afterInteractive" />
    </>
  )
}
```

**Strategies:**
- `beforeInteractive`: Load before any Next.js code (e.g., consent managers). Must be in `head`
- `afterInteractive` (default): Load early but after some hydration
- `lazyOnload`: Load during browser idle time (low priority)
- `worker` (experimental): Load in a web worker

**Inline scripts need an `id`:**

```tsx
<Script id="show-banner" strategy="afterInteractive">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

**Layout-level scripts:**

```tsx
// app/dashboard/layout.tsx
import Script from 'next/script'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://dashboard-widget.com/script.js" />
    </>
  )
}
```

Scripts in layouts are deduplicated — they only load once even across route navigations.

## `<Image>` (next/image)

See `image-font-optimization.md` for full details.

## `<Link>` (next/link)

### Key Props

| Prop | Description |
|------|-------------|
| `href` | Path or URL to navigate to. Can be string or `{ pathname, query }` object |
| `replace` | Replace current history entry instead of pushing |
| `scroll` | `true` (default) — scroll to top of page. `false` — maintain scroll position |
| `prefetch` | `"auto"`/`null` (default), `true` (full prefetch), `false` (disabled) |
| `onNavigate` | Event handler called during client-side nav. Can call `e.preventDefault()` to block |
| `transitionTypes` | Array of transition type strings for `<ViewTransition>` animations |

### onNavigate — Blocking Navigation

Block navigation conditionally (e.g., unsaved form changes):

```tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function EditPage() {
  const [hasChanges, setHasChanges] = useState(false)

  return (
    <Link
      href="/"
      onNavigate={(e) => {
        if (hasChanges && !window.confirm('Unsaved changes. Leave anyway?')) {
          e.preventDefault()
        }
      }}
    >
      Home
    </Link>
  )
}
```

**Differences from `onClick`:**
- `onClick` fires for ALL clicks (including Ctrl/Cmd + click for new tabs)
- `onNavigate` only fires during actual client-side navigation
- External URLs don't trigger `onNavigate`
- Download links work with `onClick` but not `onNavigate`

### transitionTypes

Apply different View Transition animations per navigation:

```tsx
import Link from 'next/link'

export default function Gallery() {
  return (
    <Link href="/photo/1" transitionTypes={['slide-in']}>
      View Photo
    </Link>
  )
}
```

```css
::view-transition-group(.slide-in) {
  animation: slide-in 400ms ease;
}
```

### Scroll Offset with Sticky Headers

Disable automatic scroll to account for sticky headers:

```tsx
<Link href="/about" scroll={false}>
  About
</Link>
```

When `scroll={false}`, Next.js won't scroll to the first Page element. Combine with manual scroll:

```tsx
'use client'
import Link from 'next/link'

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      onClick={() => {
        const offset = 80 // Sticky header height
        window.scrollTo({ top: offset, behavior: 'smooth' })
      }}
    >
      {children}
    </Link>
  )
}
```

### Checking Active Links

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={isActive ? 'text-blue-600 font-bold' : 'text-gray-600'}
    >
      {children}
    </Link>
  )
}
```

## `<ViewTransition>` (React 19)

Animate elements during navigation:

```tsx
import { ViewTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Gallery page
function PhotoGrid({ photos }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {photos.map((photo) => (
        <Link key={photo.id} href={`/photo/${photo.id}`}>
          <ViewTransition name={`photo-${photo.id}`}>
            <Image src={photo.src} alt={photo.title} width={200} height={200} />
          </ViewTransition>
        </Link>
      ))}
    </div>
  )
}

// Detail page
async function PhotoContent({ id }) {
  const photo = await getPhoto(id)
  return (
    <ViewTransition name={`photo-${photo.id}`}>
      <Image src={photo.src} alt={photo.title} fill />
    </ViewTransition>
  )
}
```

Elements with the same `name` morph between pages automatically. Customize with `share="morph"` and CSS:

```css
::view-transition-group(.morph) {
  animation-duration: 400ms;
}
::view-transition-image-pair(.morph) {
  animation-name: via-blur;
}
@keyframes via-blur {
  30% { filter: blur(3px); }
}
```

## `<Suspense>` for Streaming

```tsx
import { Suspense } from 'react'

export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  )
}
```

## `loading.js` vs `<Suspense>`

- `loading.js`: Page-level loading UI. Replaces entire page content while loading.
- `<Suspense>`: Granular loading boundaries. Wraps specific components.

Prefer `<Suspense>` for granular control. Use `loading.js` for simple page-level skeletons.
