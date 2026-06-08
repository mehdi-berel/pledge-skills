# Performance (React)

## useMemo

Cache the result of an expensive calculation.

```tsx
const cachedValue = useMemo(calculateValue, dependencies)
```

### Skipping Expensive Calculations

```tsx
function TodoList({ todos, filter }: { todos: Todo[]; filter: Filter }) {
  const visibleTodos = useMemo(
    () => todos.filter(todo => {
      switch (filter) {
        case 'active': return !todo.completed
        case 'completed': return todo.completed
        default: return true
      }
    }),
    [todos, filter]  // Only recalculate when these change
  )

  return (
    <ul>
      {visibleTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </ul>
  )
}
```

### Memoizing a Dependency

```tsx
function Dropdown({ allItems, selectedId }: Props) {
  const selectedItem = useMemo(
    () => allItems.find(item => item.id === selectedId),
    [allItems, selectedId]
  )

  // selectedItem reference is stable, won't trigger unnecessary effects
  useEffect(() => {
    console.log('Selected:', selectedItem?.name)
  }, [selectedItem])

  return <div>...</div>
}
```

### When NOT to Use useMemo

```tsx
// ❌ Simple calculation — not worth memoizing
const fullName = useMemo(() => `${first} ${last}`, [first, last])

// ✅ Just compute during render
const fullName = `${first} ${last}`

// ❌ Object that's always new anyway
const config = useMemo(() => ({ a, b }), [a, b])

// ❌ Called conditionally or in loop (hooks rules)
// ✅ Use inside component at top level only
```

## useCallback

Cache a function definition to prevent child re-renders.

```tsx
const cachedFn = useCallback(fn, dependencies)
```

### Preventing Child Re-renders

```tsx
function Parent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  // Without useCallback: Child re-renders every time Parent renders
  // With useCallback: Child only re-renders when handleClick changes (never here)
  const handleClick = useCallback(() => {
    console.log('Clicked')
  }, [])

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveChild onClick={handleClick} />
    </>
  )
}

const ExpensiveChild = memo(function ExpensiveChild({ onClick }: { onClick: () => void }) {
  console.log('ExpensiveChild render')
  return <button onClick={onClick}>Click me</button>
})
```

### With Dynamic Dependencies

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = useCallback((text: string) => {
    socket.send({ roomId, text })
  }, [roomId])

  // Stable reference until roomId changes
  useEffect(() => {
    socket.on('message', handleMessage)
    return () => socket.off('message', handleMessage)
  }, [sendMessage])  // sendMessage is stable thanks to useCallback
}
```

## memo

Skip re-rendering a component when its props haven't changed.

```tsx
const MemoizedComponent = memo(Component, arePropsEqual?)
```

### Basic Usage

```tsx
import { memo } from 'react'

const ExpensiveItem = memo(function Item({ data }: { data: ItemData }) {
  return <div>{/* Expensive render */}</div>
})
```

### Custom Comparison

```tsx
const Item = memo(
  function Item({ data }: { data: ItemData }) {
    return <div>{data.name}</div>
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.data.id === nextProps.data.id
  }
)
```

### memo + useMemo Pattern

```tsx
function Parent({ data }: { data: Data }) {
  // Memoize the prop value itself
  const processed = useMemo(() => process(data), [data])

  return <MemoizedChild data={processed} />
}

const MemoizedChild = memo(Child)
```

## React Compiler (React 19+)

Automatically memoizes your components — no manual `useMemo`/`useCallback`/`memo` needed.

### Enabling

```bash
npm install -D babel-plugin-react-compiler
```

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {}],
  ],
}
```

### ESLint Plugin

```bash
npm install -D eslint-plugin-react-compiler
```

```json
{
  "plugins": ["react-compiler"],
  "rules": {
    "react-compiler/react-compiler": "error"
  }
}
```

### Directives (Fine-grained Control)

```tsx
// Opt-out a component from compilation
function NotMemoizedComponent() {
  'use no memo'  // Compiler skips this component
  return <div />
}

// Opt-out a single hook call
function Component() {
  const [state, setState] = useState(0)
  'use no memo'  // Following expression not memoized
  const derived = computeExpensive(state)
}
```

### Do You Still Need memo with React Compiler?

**No.** The compiler handles memoization automatically. But:
- Keep existing `memo`/`useMemo`/`useCallback` until you enable the compiler
- The compiler doesn't optimize everything perfectly — profile if needed
- External libraries not compiled still benefit from manual memoization

## Performance Optimization Strategies

### 1. Profile First

```tsx
// Use React DevTools Profiler
// Look for:
// - Components with high render count
// - Components with long render time
// - Unnecessary re-renders
```

### 2. Lift Content Up

```tsx
// ❌ Bad: Layout re-renders when count changes
function Parent() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <Header />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Footer />
    </div>
  )
}

// ✅ Good: Counter is isolated
function Parent() {
  return (
    <div>
      <Header />
      <Counter />
      <Footer />
    </div>
  )
}
```

### 3. Virtualize Long Lists

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 4. Code Splitting

```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 5. useDeferredValue for Search

```tsx
function SearchResults({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query)

  // Results update after urgent UI (input cursor) is handled
  const results = useMemo(() => search(deferredQuery), [deferredQuery])

  const isStale = query !== deferredQuery

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      {results.map(r => <Result key={r.id} {...r} />)}
    </div>
  )
}
```

## Performance Checklist

- [ ] Profile with React DevTools before optimizing
- [ ] Ensure keys are stable (not array index for changing lists)
- [ ] Split large components into smaller ones
- [ ] Memoize expensive calculations with `useMemo`
- [ ] Memoize callbacks passed to optimized children with `useCallback`
- [ ] Wrap pure components with `memo`
- [ ] Virtualize lists with 100+ items
- [ ] Code-split routes and heavy components
- [ ] Use `useDeferredValue` for text input + expensive list filtering
- [ ] Use `useTransition` for non-urgent state updates
