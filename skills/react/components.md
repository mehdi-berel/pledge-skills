# Built-in Components (React)

## Fragment

Group elements without adding DOM nodes.

```tsx
// Short syntax (recommended)
<>
  <h1>Title</h1>
  <p>Content</p>
</>

// With key (required in lists)
<Fragment key={item.id}>
  <dt>{item.term}</dt>
  <dd>{item.description}</dd>
</Fragment>
```

## StrictMode

Enables extra development checks.

```tsx
<StrictMode>
  <App />
</StrictMode>
```

Checks:
- Double-invokes render, effects, state initializers
- Warns about deprecated APIs
- Warns about impure components
- Warns about side effects during render
- Checks for mismatched server/client HTML

## Profiler

Measure rendering performance.

```tsx
<Profiler id="Navigation" onRender={onRender}>
  <Navigation />
</Profiler>
```

```tsx
function onRender(
  id: string,           // Profiler id
  phase: string,       // "mount" | "update"
  actualDuration: number,     // Time spent rendering
  baseDuration: number,       // Estimated time without memoization
  startTime: number,          // When React began rendering
  commitTime: number,         // When React committed
  interactions: Set<Interaction>
) {
  console.log(`${id} rendered in ${actualDuration}ms`)
}
```

## Suspense

Declarative loading state. See `suspense.md`.

## ViewTransition (React 19)

Animate view transitions natively.

```tsx
import { ViewTransition } from 'react'

function Gallery({ photos, selectedId }: Props) {
  return (
    <div className="gallery">
      {photos.map(photo => (
        <ViewTransition
          key={photo.id}
          name={photo.id === selectedId ? 'selected-photo' : 'photo'}
        >
          <img src={photo.src} />
        </ViewTransition>
      ))}
    </div>
  )
}
```

**Note:** Requires browser support and experimental React flag.

## Error Boundaries

Catch JavaScript errors in child components.

```tsx
class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}

// Usage
<ErrorBoundary fallback={<ErrorMessage />}>
  <BuggyComponent />
</ErrorBoundary>
```

### With Reset

```tsx
class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, key: 0 }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  reset = () => {
    this.setState({ hasError: false, key: this.state.key + 1 })
  }

  render() {
    if (this.state.hasError) {
      return <button onClick={this.reset}>Retry</button>
    }
    return <div key={this.state.key}>{this.props.children}</div>
  }
}
```

## createPortal

Render children into a different DOM node.

```tsx
import { createPortal } from 'react-dom'

function Modal({ children, onClose }: Props) {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!  // Target DOM node
  )
}
```

Use for: modals, tooltips, dropdowns that need to escape parent CSS (overflow, z-index).

## createContext / Provider

See `context.md`.

```tsx
const ThemeContext = createContext('light')

// React 19: Context is the provider
<ThemeContext value={theme}>
  <App />
</ThemeContext>

// Pre-19
<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>
```
