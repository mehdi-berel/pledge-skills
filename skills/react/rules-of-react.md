# Rules of React

## Components and Hooks Must Be Pure

Same inputs → same outputs. No side effects during render.

```tsx
// ❌ Wrong: side effect during render
function Component() {
  localStorage.setItem('key', 'value')  // Side effect!
  return <div />
}

// ✅ Correct: side effects in useEffect
function Component() {
  useEffect(() => {
    localStorage.setItem('key', 'value')
  }, [])
  return <div />
}

// ❌ Wrong: mutating props
function Component({ items }: { items: Item[] }) {
  items.push(newItem)  // Mutates prop!
  return <List items={items} />
}

// ✅ Correct: create new array
function Component({ items }: { items: Item[] }) {
  return <List items={[...items, newItem]} />
}
```

## Rules of Hooks

1. **Only call hooks at the top level** — not inside loops, conditions, or nested functions
2. **Only call hooks from React functions** — components or custom hooks

```tsx
// ❌ Wrong
function Component({ shouldShow }) {
  if (shouldShow) {
    useEffect(() => {})  // Conditional hook!
  }
  return <div />
}

// ✅ Correct
function Component({ shouldShow }) {
  useEffect(() => {
    if (shouldShow) {
      // Effect logic here
    }
  }, [shouldShow])
  return shouldShow ? <div /> : null
}
```

## React Calls Components and Hooks

Never call components directly. Let React call them.

```tsx
// ❌ Wrong: calling component as function
const result = MyComponent(props)

// ✅ Correct: JSX
const element = <MyComponent {...props} />

// ❌ Wrong: calling hook conditionally
if (condition) {
  const [state] = useState(0)  // ❌
}

// ✅ Correct
const [state] = useState(condition ? 0 : 1)
```

## State is Snapshot, Not Live

```tsx
function Counter() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
    console.log(count)  // Still 0! State is a snapshot.
  }

  // Use updater function for latest state
  const handleClickCorrect = () => {
    setCount(c => c + 1)
  }
}
```

## State Updates are Batched

```tsx
function Component() {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  const handleClick = () => {
    setCount(c => c + 1)  // Queued
    setFlag(f => !f)        // Queued
    // Both applied together in single re-render
  }
}
```

## ESLint Configuration

```bash
npm install -D eslint-plugin-react-hooks eslint-plugin-react-compiler
```

```json
{
  "plugins": ["react-hooks", "react-compiler"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react-compiler/react-compiler": "warn"
  }
}
```

## Keys Must Be Stable

```tsx
// ❌ Wrong: array index as key for dynamic lists
{todos.map((todo, index) => (
  <li key={index}>{todo.text}</li>  // Bug when reordering!
))}

// ✅ Correct: stable unique ID
{todos.map(todo => (
  <li key={todo.id}>{todo.text}</li>
))}
```

## Don't Suppress Dependency Warnings

```tsx
// ❌ Wrong: disabling lint
useEffect(() => {
  console.log(count)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

// ✅ Correct: include dependencies or use ref
useEffect(() => {
  console.log(count)
}, [count])
```

## Props Are Immutable

```tsx
// ❌ Wrong: mutating props
function Component({ style }: { style: CSSProperties }) {
  style.color = 'red'  // Mutates parent's object!
  return <div style={style} />
}

// ✅ Correct: create new object
function Component({ style }: { style: CSSProperties }) {
  return <div style={{ ...style, color: 'red' }} />
}
```
