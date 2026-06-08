# Effect Hooks (React)

## useEffect

Synchronizes a component with an external system.

```tsx
useEffect(setup, dependencies?)
```

### Basic Pattern

```tsx
useEffect(() => {
  // Setup: connect to external system
  const connection = createConnection(serverUrl)
  connection.connect()

  // Cleanup: disconnect before re-running or unmounting
  return () => {
    connection.disconnect()
  }
}, [serverUrl])  // Dependencies: re-run when these change
```

### Common Use Cases

```tsx
// Connect to chat room
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(roomId)
    connection.connect()
    return () => connection.disconnect()
  }, [roomId])
}

// Subscribe to store
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    function handleStatusChange(status: boolean) {
      setIsOnline(status)
    }
    subscribeToStatus(handleStatusChange)
    return () => unsubscribeFromStatus(handleStatusChange)
  }, [])
}

// Fetch data (simple case)
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchUser(userId).then(data => {
      if (!cancelled) setUser(data)
    })

    return () => { cancelled = true }
  }, [userId])
}
```

### Dependency Rules

```tsx
// ✅ Include all reactive values
useEffect(() => {
  console.log(name, count)
}, [name, count])

// ✅ Empty deps = run once on mount
useEffect(() => {
  console.log('Mounted')
}, [])

// ✅ No deps = run after every render (rarely needed)
useEffect(() => {
  console.log('Every render')
})

// ❌ Missing dependency
useEffect(() => {
  console.log(count)  // Uses count
}, [])  // ❌ Missing count — ESLint will warn
```

### ESLint Plugin (exhaustive-deps)

```bash
npm install -D eslint-plugin-react-hooks
```

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Fixing Dependency Issues

```tsx
// Problem: function dependency
function ChatRoom({ onMessage }: { onMessage: (msg: string) => void }) {
  useEffect(() => {
    socket.on('message', onMessage)
    return () => socket.off('message', onMessage)
  }, [onMessage])  // ❌ Changes every render
}

// Solution 1: Memoize the callback
const handleMessage = useCallback((msg: string) => {
  setMessages(prev => [...prev, msg])
}, [])

// Solution 2: Use ref for latest value
function useEvent<T extends (...args: any[]) => void>(fn: T) {
  const ref = useRef(fn)
  useEffect(() => { ref.current = fn }, [fn])
  return useCallback((...args: Parameters<T>) => ref.current(...args), [])
}

// Solution 3: Use useEffectEvent (React 19, experimental)
function ChatRoom({ onMessage }: { onMessage: () => void }) {
  const onMessageEvent = useEffectEvent(onMessage)
  useEffect(() => {
    socket.on('message', () => onMessageEvent())
  }, [])  // ✅ No need to include onMessage
}
```

### Fetching Data (Proper Pattern)

```tsx
function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let ignore = false
    setIsLoading(true)

    fetchResults(query).then(data => {
      if (!ignore) {
        setResults(data)
        setIsLoading(false)
      }
    })

    return () => { ignore = true }
  }, [query])

  return (
    <>
      {isLoading && <Spinner />}
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </>
  )
}
```

## useLayoutEffect

Fires **synchronously** after all DOM mutations but before the browser paints.

```tsx
useLayoutEffect(() => {
  // Measure DOM before paint
  const { width, height } = ref.current.getBoundingClientRect()
  setTooltipPosition({ x: width, y: height })
}, [])
```

**Use when:** You need to measure DOM or mutate DOM before the user sees it. Use `useEffect` for everything else.

## useInsertionEffect

Fires **before** React makes DOM mutations. Used by CSS-in-JS libraries.

```tsx
useInsertionEffect(() => {
  // Inject styles before any layout effects read new styles
  const style = document.createElement('style')
  style.textContent = getDynamicStyles()
  document.head.appendChild(style)
  return () => document.head.removeChild(style)
}, [])
```

**Use when:** Injecting dynamic CSS that needs to be available before `useLayoutEffect` runs. Not needed for regular apps.

## Effect Comparison

| Hook | Timing | Use Case |
|------|--------|----------|
| `useInsertionEffect` | Before DOM mutations | CSS-in-JS injection |
| `useLayoutEffect` | After DOM, before paint | Measure DOM, prevent visual flicker |
| `useEffect` | After paint | Data fetching, subscriptions, side effects |

## When You DON'T Need an Effect

| Goal | Instead of Effect | Use |
|------|-------------------|-----|
| Transform data | `useEffect` | Compute during render or `useMemo` |
| Handle user events | `useEffect` | Event handler |
| Reset state on prop change | `useEffect` | `key` prop |
| Sync state to prop | `useEffect` | Lift state up or use controlled component |
| Subscribe to external store | `useEffect` | `useSyncExternalStore` |
| Fetch data | `useEffect` | Framework data fetching (Next.js, Remix) |

## Custom Data Fetching Hook

```tsx
function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    fetch(url)
      .then(r => r.json())
      .then(data => { if (!ignore) setData(data) })
      .catch(err => { if (!ignore) setError(err) })
      .finally(() => { if (!ignore) setIsLoading(false) })

    return () => { ignore = true }
  }, [url])

  return { data, error, isLoading }
}
```

## Troubleshooting

### Effect runs twice in development

React intentionally runs effects twice in Strict Mode to test cleanup logic. Ensure cleanup functions properly clean up:

```tsx
useEffect(() => {
  const connection = createConnection()
  connection.connect()
  return () => connection.disconnect()  // Must cleanup
}, [])
```

### Infinite loops

```tsx
// ❌ setState in useEffect without deps
useEffect(() => {
  setCount(count + 1)
})

// ✅ Add dependency or use ref
useEffect(() => {
  // Only run when specific prop changes
}, [specificProp])
```

### Race conditions

```tsx
useEffect(() => {
  let cancelled = false

  fetchData().then(data => {
    if (!cancelled) setData(data)
  })

  return () => { cancelled = true }  // Ignore stale responses
}, [query])
```
