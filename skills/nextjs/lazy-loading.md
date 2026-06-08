# Lazy Loading (Next.js 16)

## Overview

Lazy loading defers loading Client Components and libraries until they're needed, reducing initial JavaScript bundle size.

**Server Components are automatically code-split.** Lazy loading applies to **Client Components only**.

## next/dynamic

`next/dynamic` is a composite of `React.lazy()` and `<Suspense>`. Works the same in App Router and Pages Router.

### Basic Usage

```tsx
import dynamic from 'next/dynamic'

const DynamicModal = dynamic(() => import('@/components/Modal'), {
  loading: () => <p>Loading modal...</p>,
})

export default function Page() {
  const [show, setShow] = useState(false)

  return (
    <div>
      <button onClick={() => setShow(true)}>Open Modal</button>
      {show && <DynamicModal onClose={() => setShow(false)} />}
    </div>
  )
}
```

### Skipping SSR

For browser-only components (e.g., chart libraries using `window`):

```tsx
const DynamicChart = dynamic(() => import('@/components/Chart'), {
  ssr: false,          // Only render on client
  loading: () => <p>Loading chart...</p>,
})
```

### Loading External Libraries

```tsx
const DynamicSlider = dynamic(() => import('react-slick'), {
  ssr: false,
})
```

### Importing Named Exports

```tsx
const DynamicComponent = dynamic(
  () => import('@/components/Hello').then((mod) => mod.Hello),
  { loading: () => <p>Loading...</p> }
)
```

### With TypeScript

```tsx
import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

const DynamicModal = dynamic(() => import('@/components/Modal'))

type ModalProps = ComponentProps<typeof DynamicModal>

export default function Page() {
  return <DynamicModal title="Hello" onClose={() => {}} />
}
```

## React.lazy() with Suspense

For more control, use React's built-in lazy loading directly:

```tsx
'use client'
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('@/components/HeavyComponent'))

export default function Page() {
  return (
    <Suspense fallback={<div>Loading heavy UI...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

**Difference from `next/dynamic`:**
- `next/dynamic` — handles loading state, SSR options, works outside Suspense boundaries
- `React.lazy()` — requires explicit `<Suspense>` wrapper, more control over fallback placement

## Magic Comments

### webpackIgnore / turbopackIgnore

Prevent bundling a dynamic import (load at runtime from URL):

```tsx
const DynamicWidget = dynamic(() => import(
  /* webpackIgnore: true */
  /* turbopackIgnore: true */
  'https://cdn.example.com/widget.js'
))
```

### turbopackOptional (Turbopack only)

Mark an import as optional — if it fails, the module resolves to `undefined` instead of throwing:

```tsx
const OptionalFeature = dynamic(() => import(
  /* turbopackOptional: true */
  '@/components/OptionalFeature'
))
```

Useful for progressive enhancement where a feature might not be available.

## When to Lazy Load

| Scenario | Approach |
|----------|----------|
| Large component rarely used (modals, wizards) | `next/dynamic` |
| Browser-only library (charts, maps, editors) | `next/dynamic` with `ssr: false` |
| Heavy third-party package | `next/dynamic` |
| Feature behind a flag | `next/dynamic` with `turbopackOptional` |
| Component below the fold | `next/dynamic` or `React.lazy()` |

## Lazy Loading Server Components

Server Components are automatically code-split. You don't need `next/dynamic` for them. Use streaming with `<Suspense>` instead:

```tsx
import { Suspense } from 'react'

// These are Server Components, automatically code-split
import { ProductList } from '@/components/ProductList'
import { Reviews } from '@/components/Reviews'

export default function Page() {
  return (
    <div>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList />
      </Suspense>
      <Suspense fallback={<ReviewSkeleton />}>
        <Reviews />
      </Suspense>
    </div>
  )
}
```

## Best Practices

1. **Lazy load below-the-fold content** — Components the user doesn't see immediately
2. **Lazy load heavy libraries** — Charting, rich text editors, maps
3. **Use `ssr: false` sparingly** — Only for browser-only APIs (`window`, `document`)
4. **Design good loading states** — Match skeleton dimensions to final content to prevent CLS
5. **Don't lazy load everything** — Over-splitting can increase network requests
6. **Server Components don't need lazy loading** — They're already optimized
