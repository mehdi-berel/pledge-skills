# React DOM

## createRoot (React 18+)

Entry point for concurrent features.

```tsx
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

### With TypeScript

```tsx
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

const root = createRoot(container)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

## hydrateRoot

Hydrate server-rendered HTML.

```tsx
import { hydrateRoot } from 'react-dom/client'

const root = hydrateRoot(
  document.getElementById('root')!,
  <App />
)
```

## flushSync

Force synchronous DOM update. Escape hatch — avoid when possible.

```tsx
import { flushSync } from 'react-dom'

function handleClick() {
  flushSync(() => {
    setCount(c => c + 1)  // Synchronous
  })
  // DOM is updated here
  console.log(ref.current?.textContent)  // Latest value
}
```

## createPortal

Render into a different DOM node.

```tsx
import { createPortal } from 'react-dom'

function Modal({ children, onClose }: Props) {
  return createPortal(
    <div className="modal" onClick={onClose}>
      {children}
    </div>,
    document.getElementById('modal-root')!
  )
}
```

## findDOMNode (Legacy)

```tsx
import { findDOMNode } from 'react-dom'

const node = findDOMNode(componentRef)
```

**Deprecated.** Use refs instead.

## Server APIs (react-dom/server)

### renderToString

```tsx
import { renderToString } from 'react-dom/server'

const html = renderToString(<App />)
```

### renderToStaticMarkup

Non-interactive HTML (no React attributes).

```tsx
import { renderToStaticMarkup } from 'react-dom/server'

const html = renderToStaticMarkup(<EmailTemplate />)
```

### renderToPipeableStream (Node.js)

Streaming SSR.

```tsx
import { renderToPipeableStream } from 'react-dom/server'

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html')
    pipe(response)
  },
})
```

### renderToReadableStream (Web Streams)

```tsx
import { renderToReadableStream } from 'react-dom/server'

const stream = await renderToReadableStream(<App />, {
  bootstrapScripts: ['/main.js'],
})
```

## Static APIs (react-dom/static)

### prerender

Generate static HTML for prerendering.

```tsx
import { prerender } from 'react-dom/static'

const { prelude } = await prerender(<App />)
```

## Common Patterns

### Modal Root Setup

```tsx
// index.html
<body>
  <div id="root"></div>
  <div id="modal-root"></div>
</body>
```

```tsx
// Modal.tsx
function Modal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root')!
  )
}
```

### Dynamic Import with Loading

```tsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./Dashboard'))

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  )
}
```

### Scroll Restoration

```tsx
import { useEffect } from 'react'

function useScrollRestoration() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
}

function Page() {
  useScrollRestoration()
  return <div>Page content</div>
}
```
