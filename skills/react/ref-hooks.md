# Ref Hooks (React)

## useRef

Refs hold mutable values that persist across renders without triggering re-renders.

```tsx
const ref = useRef(initialValue)
// ref.current — mutable value
```

### Referencing a DOM Element

```tsx
function TextInputWithFocusButton() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.focus()
  }

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Focus</button>
    </>
  )
}
```

### Storing Previous Values

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  const prevCountRef = useRef(0)

  useEffect(() => {
    prevCountRef.current = count
  })

  const prevCount = prevCountRef.current

  return (
    <p>
      Current: {count}, Previous: {prevCount}
    </p>
  )
}
```

### Storing Timeout/Interval IDs

```tsx
function DelayedNotification() {
  const [show, setShow] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleShow = () => {
    timeoutRef.current = setTimeout(() => setShow(true), 3000)
  }

  const handleCancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <>
      <button onClick={handleShow}>Show in 3s</button>
      <button onClick={handleCancel}>Cancel</button>
      {show && <div>Notification!</div>}
    </>
  )
}
```

### Tracking Click Count (Non-Render Data)

```tsx
function ClickTracker() {
  const countRef = useRef(0)
  const [_, forceRender] = useState({})

  const handleClick = () => {
    countRef.current++
    console.log('Clicked', countRef.current, 'times')
  }

  return <button onClick={handleClick}>Click me</button>
}
```

## useImperativeHandle

Customize the ref exposed by a component. Rarely needed.

```tsx
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface FancyInputRef {
  focus: () => void
  scrollIntoView: () => void
}

const FancyInput = forwardRef<FancyInputRef, Props>(
  function FancyInput(props, ref) {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus()
      },
      scrollIntoView() {
        inputRef.current?.scrollIntoView({ behavior: 'smooth' })
      },
    }), [])

    return <input ref={inputRef} {...props} />
  }
)

// Usage
const inputRef = useRef<FancyInputRef>(null)

<button onClick={() => inputRef.current?.focus()}>Focus</button>
<FancyInput ref={inputRef} />
```

## Refs as Props (React 19)

No more `forwardRef` needed:

```tsx
// React 19 — ref is a regular prop
function Input({ ref, ...props }: React.ComponentProps<'input'> & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}

// Usage
const inputRef = useRef<HTMLInputElement>(null)
<Input ref={inputRef} placeholder="Type here" />
```

### Pre-React 19 with forwardRef

```tsx
const Input = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>
  (function Input(props, ref) {
    return <input ref={ref} {...props} />
  })
```

## Ref Callbacks

```tsx
function MeasureExample() {
  const [height, setHeight] = useState(0)

  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height)
    }
  }, [])

  return (
    <>
      <div ref={measuredRef}>Hello, world</div>
      <p>Height: {height}px</p>
    </>
  )
}
```

## Refs with Multiple Elements

```tsx
function ItemList({ items }: { items: string[] }) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const scrollToItem = (index: number) => {
    itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <ul>
      {items.map((item, i) => (
        <li
          key={i}
          ref={el => { itemRefs.current[i] = el }}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
```

## Common Ref Patterns

### Auto-focus Input

```tsx
function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => inputRef.current?.focus(), [])
  return <input ref={inputRef} />
}
```

### Scroll to Bottom (Chat)

```tsx
function Chat({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div>
      {messages.map(m => <Message key={m.id} {...m} />)}
      <div ref={bottomRef} />
    </div>
  )
}
```

### Measure Element After Resize

```tsx
function ResizablePanel() {
  const panelRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })

    if (panelRef.current) observer.observe(panelRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={panelRef}>
      {size.width}x{size.height}
    </div>
  )
}
```
