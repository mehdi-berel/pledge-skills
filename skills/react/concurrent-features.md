# Concurrent Features (React)

## useTransition

Marks a state update as non-blocking, allowing urgent updates to interrupt it.

```tsx
const [isPending, startTransition] = useTransition()
```

### Basic Usage

```tsx
function TabContainer() {
  const [tab, setTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  const selectTab = (nextTab: string) => {
    startTransition(() => {
      setTab(nextTab)  // Non-urgent — can be interrupted
    })
  }

  return (
    <>
      <TabButton
        isActive={tab === 'home'}
        onClick={() => selectTab('home')}
      >
        Home
      </TabButton>
      {isPending && <Spinner />}
      <TabPanel tab={tab} />
    </>
  )
}
```

### Without Hook (Direct API)

```tsx
import { startTransition } from 'react'

function handleClick() {
  startTransition(() => {
    setTab('about')
  })
}
```

### With Actions (React 19)

```tsx
function UpdateButton() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      await updateDatabase(data)
      setData(data)
    })
  }

  return (
    <button disabled={isPending} onClick={handleSubmit}>
      {isPending ? 'Saving...' : 'Save'}
    </button>
  )
}
```

## useDeferredValue

Defers updating a part of the UI, keeping the previous value until the new one is ready.

```tsx
const deferredValue = useDeferredValue(value, initialValue?)
```

### Search with Deferred Results

```tsx
function SearchPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  // Input updates immediately, results update after
  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <SearchResults query={deferredQuery} />
    </>
  )
}

function SearchResults({ query }: { query: string }) {
  const results = useMemo(() => search(query), [query])
  const isStale = query !== useDeferredValue(query)  // Check if stale

  return (
    <ul style={{ opacity: isStale ? 0.5 : 1 }}>
      {results.map(r => <li key={r.id}>{r.name}</li>)}
    </ul>
  )
}
```

### Keep Previous UI During Load

```tsx
function Profile({ userId }: { userId: string }) {
  const deferredId = useDeferredValue(userId)

  return (
    <Suspense fallback={<Skeleton />}>
      <ProfileData userId={deferredId} />
    </Suspense>
  )
}
```

## useActionState

Manages state for async actions with pending status (React 19).

```tsx
const [state, formAction, isPending] = useActionState(action, initialState)
```

### Form Submission

```tsx
async function submitAction(prevState: State, formData: FormData): Promise<State> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  try {
    await saveUser({ name, email })
    return { success: true, message: 'Saved!' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

function Form() {
  const [state, action, isPending] = useActionState(submitAction, {
    success: false,
    message: '',
  })

  return (
    <form action={action}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {state.message && <p>{state.message}</p>}
    </form>
  )
}
```

### With useOptimistic

```tsx
function MessageForm() {
  const [messages, setMessages] = useState<Message[]>([])
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: string) => [...state, { id: Date.now(), text: newMessage, sending: true }]
  )

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      const text = formData.get('text') as string

      addOptimisticMessage(text)

      const saved = await saveMessage(text)
      setMessages(prev => [...prev, saved])

      return { sent: true }
    },
    null
  )

  return (
    <>
      <form action={formAction}>
        <input name="text" />
        <button disabled={isPending}>Send</button>
      </form>
      {optimisticMessages.map(m => (
        <div key={m.id} style={{ opacity: m.sending ? 0.5 : 1 }}>
          {m.text}
        </div>
      ))}
    </>
  )
}
```

## useOptimistic

Apply temporary updates while async operations are in progress.

```tsx
const [optimisticState, addOptimistic] = useOptimistic(
  state,
  (currentState, optimisticValue) => {
    // Return optimistic state
  }
)
```

### Optimistic Like Button

```tsx
function LikeButton({ postId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes)
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (currentLikes) => currentLikes + 1
  )

  const handleLike = async () => {
    addOptimisticLike(undefined)  // Trigger optimistic update
    try {
      const newLikes = await api.likePost(postId)
      setLikes(newLikes)
    } catch {
      // Optimistic update automatically reverts on error
    }
  }

  return (
    <button onClick={handleLike}>
      ❤️ {optimisticLikes}
    </button>
  )
}
```

### Optimistic List Updates

```tsx
function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos)
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }]
  )

  async function addTodo(formData: FormData) {
    const text = formData.get('text') as string
    const tempId = crypto.randomUUID()

    addOptimisticTodo({ id: tempId, text, completed: false })

    const saved = await api.createTodo(text)
    setTodos(prev => prev.map(t => t.id === tempId ? saved : t))
  }

  return (
    <>
      <form action={addTodo}>
        <input name="text" />
        <button>Add</button>
      </form>
      {optimisticTodos.map(todo => (
        <div key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
          {todo.text}
        </div>
      ))}
    </>
  )
}
```

## Comparison: useTransition vs useDeferredValue

| Feature | `useTransition` | `useDeferredValue` |
|---------|----------------|-------------------|
| **What you control** | When the update starts | What the UI shows |
| **Use case** | Button click → slow tab change | Fast input → slow search results |
| **Has pending state** | ✅ `isPending` | ❌ (use `isStale` check) |
| **Reverts on interruption** | ✅ | ✅ (keeps old value) |
| **API style** | Imperative (wrap setState) | Declarative (wrap value) |

## Comparison Table

| Feature | Urgency | User Sees | Use For |
|---------|---------|-----------|---------|
| Regular state | Urgent | Immediate | Typing, clicks |
| `useTransition` | Deferred | Previous + pending indicator | Tab switching, filters |
| `useDeferredValue` | Deferred | Previous until ready | Search results, charts |
| `useOptimistic` | Immediate (then revert) | Optimistic, then real | Likes, send message |
| `useActionState` | Async | Pending state | Form submissions |
