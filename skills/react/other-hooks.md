# Other Hooks (React)

## useId

Generate unique IDs for accessibility. Stable across server/client.

```tsx
function PasswordField() {
  const passwordId = useId()
  const hintId = useId()

  return (
    <>
      <label htmlFor={passwordId}>Password:</label>
      <input id={passwordId} aria-describedby={hintId} type="password" />
      <p id={hintId}>Must be 8+ characters</p>
    </>
  )
}
```

## useSyncExternalStore

Subscribe to an external data store.

```tsx
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

```tsx
function useOnlineStatus() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener('online', cb)
      window.addEventListener('offline', cb)
      return () => {
        window.removeEventListener('online', cb)
        window.removeEventListener('offline', cb)
      }
    },
    () => navigator.onLine,
    () => true  // Server: assume online
  )
}
```

## useDebugValue

Label custom hooks in React DevTools.

```tsx
function useFriendStatus(friendId: string) {
  const [isOnline, setIsOnline] = useState(false)
  useDebugValue(isOnline ? 'Online' : 'Offline')
  return isOnline
}
```

## use (React 19)

Read a Promise or Context during render. Can be called conditionally.

```tsx
function Comments({ commentsPromise }: { commentsPromise: Promise<Comment[]> }) {
  const comments = use(commentsPromise)  // Suspends until resolved
  return comments.map(c => <p key={c.id}>{c.text}</p>)
}

// With Suspense
<Suspense fallback={<Spinner />}>
  <Comments commentsPromise={fetchComments(postId)} />
</Suspense>
```

**Key difference from `useContext`:** `use()` works conditionally and in loops. `useContext()` follows hooks rules.

## useInsertionEffect

For CSS-in-JS libraries. Fires before DOM mutations.

```tsx
useInsertionEffect(() => {
  const style = document.createElement('style')
  style.textContent = rule
  document.head.appendChild(style)
  return () => document.head.removeChild(style)
}, [rule])
```

## useEffectEvent (Experimental)

Non-reactive function for effects.

```tsx
function ChatRoom({ roomId, onMessage }: Props) {
  const onMessageEvent = useEffectEvent(onMessage)

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.onMessage = (msg) => onMessageEvent(msg)
    return () => connection.disconnect()
  }, [roomId])  // No need to include onMessage
}
```

## useFormStatus (react-dom)

Track pending state of a parent `<form>`.

```tsx
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus()

  return (
    <button disabled={pending} type="submit">
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}
```

## Hook Comparison

| Hook | Purpose | Triggers Re-render |
|------|---------|-------------------|
| `useState` | Component state | ✅ |
| `useReducer` | Complex state logic | ✅ |
| `useContext` | Read context | ✅ |
| `useRef` | Persistent mutable value | ❌ |
| `useMemo` | Cache calculation | ❌ (value only) |
| `useCallback` | Cache function | ❌ (function only) |
| `useEffect` | Side effects | ❌ |
| `useLayoutEffect` | Synchronous DOM effect | ❌ |
| `useId` | Unique ID | ❌ |
| `useSyncExternalStore` | External store | ✅ |
| `useTransition` | Non-blocking updates | ✅ (isPending) |
| `useDeferredValue` | Defer UI update | ✅ |
| `useActionState` | Async form action | ✅ |
| `useOptimistic` | Temporary state | ✅ |
| `use` | Read Promise/Context | ✅ (suspends) |
