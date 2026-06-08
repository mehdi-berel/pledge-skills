# JSX (TypeScript)

## JSX Modes

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"    // or "react", "preserve", "react-native", "react-jsxdev"
  }
}
```

| Mode | Input | Output | Import Source |
|------|-------|--------|---------------|
| `preserve` | `.tsx` | `.jsx` | N/A |
| `react` | `.tsx` | `.js` with `React.createElement` | `React` |
| `react-jsx` | `.tsx` | `.js` with `_jsx` | `react/jsx-runtime` |
| `react-jsxdev` | `.tsx` | `.js` with `_jsxDEV` | `react/jsx-runtime` (dev) |
| `react-native` | `.tsx` | `.js` (preserved for bundler) | N/A |

**`react-jsx`** is recommended — no need to import `React`.

## Intrinsic Elements

HTML elements are typed via `JSX.IntrinsicElements`:

```ts
// In a .d.ts file or global augmentation
declare namespace JSX {
  interface IntrinsicElements {
    'my-custom-element': {
      'data-value': string
    }
  }
}
```

## Function Components

```ts
// With explicit return type
function Greeting({ name }: { name: string }): JSX.Element {
  return <h1>Hello, {name}</h1>
}

// With interface
interface GreetingProps {
  name: string
  age?: number
}

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      {age && <p>Age: {age}</p>}
    </div>
  )
}

// Generic component
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>
}
```

## Class Components

```ts
import { Component } from 'react'

interface CounterProps {
  initialCount?: number
}

interface CounterState {
  count: number
}

class Counter extends Component<CounterProps, CounterState> {
  state: CounterState = {
    count: this.props.initialCount ?? 0,
  }

  render() {
    return <button>{this.state.count}</button>
  }
}
```

## Common React Types

```ts
import type {
  ReactNode,      // string | number | ReactElement | ...
  ReactElement,   // Result of createElement
  JSX.Element,    // Alias for ReactElement
  ComponentType,  // FunctionComponent | ComponentClass
  PropsWithChildren,  // P & { children?: ReactNode }
  CSSProperties,  // Style object type
} from 'react'

// PropsWithChildren helper
interface ButtonProps {
  onClick: () => void
}

function Button({ onClick, children }: PropsWithChildren<ButtonProps>) {
  return <button onClick={onClick}>{children}</button>
}
```

## Event Types

```ts
function Form() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.textContent)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  )
}
```

### Common Event Types

| Event | Type |
|-------|------|
| Change | `React.ChangeEvent<T>` |
| Click | `React.MouseEvent<T>` |
| Submit | `React.FormEvent<T>` |
| Key | `React.KeyboardEvent<T>` |
| Focus/Blur | `React.FocusEvent<T>` |
| Drag | `React.DragEvent<T>` |
| Touch | `React.TouchEvent<T>` |
| Wheel | `React.WheelEvent<T>` |
| Animation | `React.AnimationEvent<T>` |
| Transition | `React.TransitionEvent<T>` |

## Ref Types

```ts
import { useRef, useImperativeHandle, forwardRef } from 'react'

// DOM ref
function Input() {
  const inputRef = useRef<HTMLInputElement>(null)

  const focus = () => {
    inputRef.current?.focus()
  }

  return <input ref={inputRef} />
}

// Imperative handle
interface FancyInputHandle {
  focus: () => void
}

const FancyInput = forwardRef<FancyInputHandle, { placeholder: string }>(
  ({ placeholder }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }))

    return <input ref={inputRef} placeholder={placeholder} />
  }
)
```

## Type-Safe Context

```ts
import { createContext, useContext } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

## Polymorphic Components

```ts
import type { ElementType, ComponentPropsWithoutRef } from 'react'

interface BoxProps<T extends ElementType = 'div'> {
  as?: T
  children?: React.ReactNode
}

function Box<T extends ElementType = 'div'>(
  { as, ...props }: BoxProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof BoxProps<T>>
) {
  const Component = as || 'div'
  return <Component {...props} />
}

// Usage:
<Box as="button" type="submit">Click</Box>  // type is correctly typed
<Box as="a" href="/">Link</Box>             // href is correctly typed
```

## Children Types

```ts
// Single child
function SingleChild({ children }: { children: React.ReactElement }) {
  return <div>{children}</div>
}

// Specific element type
function ListItem({ children }: { children: React.ReactElement<'li'> }) {
  return <ul>{children}</ul>
}

// Render prop
type RenderProp<T> = (item: T) => React.ReactNode
```
