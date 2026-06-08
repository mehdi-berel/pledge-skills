# State Hooks (React)

## useState

Declares a state variable that triggers re-renders when updated.

```tsx
const [state, setState] = useState(initialValue)
```

### Basic Usage

```tsx
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### Functional Updates (Prev State)

```tsx
function Counter() {
  const [count, setCount] = useState(0)

  // ✅ Correct — updater function guarantees latest state
  const increment = () => setCount(c => c + 1)

  // ⚠️ Risky — stale closure if batched
  const riskyIncrement = () => setCount(count + 1)

  return <button onClick={increment}>{count}</button>
}
```

### Lazy Initialization

```tsx
function ExpensiveComponent() {
  // Function only runs on first render
  const [data, setData] = useState(() => computeExpensiveValue())

  return <div>{data}</div>
}
```

### Objects & Arrays in State

```tsx
function UserProfile() {
  const [user, setUser] = useState({ name: '', age: 0 })

  // ✅ Replace entire object (or spread)
  const updateName = (name: string) => {
    setUser({ ...user, name })  // Spread existing fields
  }

  // ⚠️ Mutating existing object — WRONG
  const wrongUpdate = (name: string) => {
    user.name = name  // ❌ Mutates state
    setUser(user)     // ❌ Same reference, no re-render
  }

  return <input value={user.name} onChange={e => updateName(e.target.value)} />
}
```

### Arrays in State

```tsx
function TodoList() {
  const [todos, setTodos] = useState<{ id: number; text: string }[]>([])

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text }])
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    )
  }

  return <ul>{todos.map(t => <li key={t.id}>{t.text}</li>)}</ul>
}
```

### Resetting State with Key

```tsx
function Chat({ userId }: { userId: string }) {
  // Reset state when userId changes
  return <ChatRoom key={userId} userId={userId} />
}

function ChatRoom({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  // Messages reset automatically when key changes
}
```

## useReducer

For complex state logic or when next state depends on multiple values.

```tsx
const [state, dispatch] = useReducer(reducer, initialState)
```

### Basic Pattern

```tsx
type State = { count: number }
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return { count: 0 }
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })

  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </>
  )
}
```

### With Initializer (Lazy)

```tsx
function reducer(state: State, action: Action): State { /* ... */ }

function createInitialState(username: string): State {
  return { count: 0, user: username }
}

function Counter({ username }: { username: string }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState  // Init function
  )
}
```

### With Immer

```tsx
import { useImmerReducer } from 'use-immer'

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case 'increment':
      draft.count++  // Mutate draft directly
      break
    case 'addTodo':
      draft.todos.push(action.todo)
      break
  }
}
```

## State Comparison: useState vs useReducer

| Scenario | Recommendation |
|----------|---------------|
| Primitive value (string, number, boolean) | `useState` |
| Single object with a few fields | `useState` + spread |
| Complex object with many interdependent fields | `useReducer` |
| State updates depend on previous state | `useState` with updater function or `useReducer` |
| Multiple related state variables | `useReducer` (single state object) |
| State logic needs to be tested independently | `useReducer` (extract reducer to module) |

## Common State Patterns

### Toggle

```tsx
const [isOn, setIsOn] = useState(false)
const toggle = () => setIsOn(v => !v)
```

### Boolean with Force Value

```tsx
const [isOpen, setIsOpen] = useState(false)
const open = () => setIsOpen(true)
const close = () => setIsOpen(false)
```

### Form State

```tsx
const [form, setForm] = useState({ name: '', email: '' })

const updateField = (field: string, value: string) => {
  setForm(prev => ({ ...prev, [field]: value }))
}

// Or with reducer for complex forms
```

### Derived State

```tsx
// ✅ Compute during render (cheap)
const [items, setItems] = useState<Item[]>([])
const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
const itemCount = items.length

// ✅ Memoize if expensive
const sortedItems = useMemo(
  () => [...items].sort((a, b) => b.price - a.price),
  [items]
)

// ❌ Don't store derived values in state
const [total, setTotal] = useState(0)
useEffect(() => {
  setTotal(items.reduce((s, i) => s + i.price, 0))  // Unnecessary
}, [items])
```

## State Troubleshooting

### "Too many re-renders"

```tsx
// ❌ Wrong — calling setter during render
function Bad() {
  const [count, setCount] = useState(0)
  setCount(count + 1)  // ❌ Infinite loop
  return <div>{count}</div>
}

// ✅ Correct — event handler or useEffect
function Good() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### State not updating synchronously

```tsx
function Example() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
    console.log(count)  // ❌ Still old value (stale closure)

    setCount(c => c + 1)
    console.log(count)  // ❌ Still old value
  }

  // ✅ Use ref for latest value, or updater function for next value
}
```

### Initializing with props

```tsx
// ❌ Props that might change won't update state
function Bad({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  // initialCount changes won't update count
}

// ✅ Use key to reset, or derive from props directly
function Good({ count: propCount }: { count: number }) {
  const [localCount, setLocalCount] = useState(propCount)
  // Or just use the prop directly if you don't need local state
}
```
