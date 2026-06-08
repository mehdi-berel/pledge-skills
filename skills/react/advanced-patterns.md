# Advanced Patterns (React)

## Custom Hooks

Extract reusable stateful logic.

```tsx
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '') ?? initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    setStored(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [stored, setValue]
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

### Data Fetching Hook

```tsx
function useFetch<T>(url: string) {
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

## Compound Components

Components that work together as a system.

```tsx
// Tabs.tsx
const TabsContext = createContext<{ activeTab: string; setActiveTab: (id: string) => void } | null>(null)

function Tabs({ defaultTab, children }: { defaultTab: string; children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <TabsContext value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext>
  )
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div role="tablist" className="flex gap-2">{children}</div>
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tab must be inside Tabs')
  return (
    <button
      role="tab"
      aria-selected={ctx.activeTab === id}
      onClick={() => ctx.setActiveTab(id)}
      className={ctx.activeTab === id ? 'border-b-2 border-blue-500' : ''}
    >
      {children}
    </button>
  )
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabPanel must be inside Tabs')
  if (ctx.activeTab !== id) return null
  return <div role="tabpanel">{children}</div>
}

Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panel = TabPanel

// Usage
<Tabs defaultTab="account">
  <Tabs.List>
    <Tabs.Tab id="account">Account</Tabs.Tab>
    <Tabs.Tab id="security">Security</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="account">Account content</Tabs.Panel>
  <Tabs.Panel id="security">Security content</Tabs.Panel>
</Tabs>
```

## Render Props

Pass a function as a child/prop for flexible composition.

```tsx
function MouseTracker({ render }: { render: (state: { x: number; y: number }) => React.ReactNode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <div onMouseMove={e => setPosition({ x: e.clientX, y: e.clientY })}>
      {render(position)}
    </div>
  )
}

// Usage
<MouseTracker render={({ x, y }) => (
  <p>Mouse: {x}, {y}</p>
)} />
```

## Higher-Order Components (HOCs)

Wrap components to inject props or behavior.

```tsx
function withAuth<P extends object>(
  WrappedComponent: ComponentType<P & { user: User }>
) {
  return function WithAuth(props: P) {
    const user = useAuth()
    if (!user) return <LoginPrompt />
    return <WrappedComponent {...props} user={user} />
  }
}

// Usage
function Dashboard({ user }: { user: User }) {
  return <div>Welcome, {user.name}</div>
}

export default withAuth(Dashboard)
```

**Note:** Prefer hooks over HOCs for new code. HOCs add component nesting and can be confusing.

## Controlled vs Uncontrolled

```tsx
// Controlled: React owns state
function ControlledInput() {
  const [value, setValue] = useState('')
  return <input value={value} onChange={e => setValue(e.target.value)} />
}

// Uncontrolled: DOM owns state
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleSubmit = () => {
    console.log(inputRef.current?.value)
  }
  return <input ref={inputRef} defaultValue="" />
}
```

## State Reducer Pattern

Allow consumers to customize state logic.

```tsx
function useToggle({
  initial = false,
  reducer = (state: boolean) => !state,
}: { initial?: boolean; reducer?: (state: boolean) => boolean } = {}) {
  const [on, setOn] = useState(initial)
  const toggle = () => setOn(reducer)
  return { on, toggle }
}
```

## Inversion of Control

```tsx
function DataTable<T>({
  data,
  renderRow,
}: {
  data: T[]
  renderRow: (item: T) => React.ReactNode
}) {
  return (
    <table>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>{renderRow(item)}</tr>
        ))}
      </tbody>
    </table>
  )
}

// Usage
<DataTable
  data={users}
  renderRow={user => (
    <>
      <td>{user.name}</td>
      <td>{user.email}</td>
    </>
  )}
/>
```

## Slot Pattern

```tsx
function Card({
  children,
  header,
  footer,
}: {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}

// Usage
<Card header={<h2>Title</h2>} footer={<button>Action</button>}>
  <p>Content</p>
</Card>
```

## Polymorphic Components

```tsx
type AsProp<T extends React.ElementType> = {
  as?: T
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'>

function Box<T extends React.ElementType = 'div'>(
  { as, children, ...props }: AsProp<T>
) {
  const Component = as || 'div'
  return <Component {...props}>{children}</Component>
}

// Usage
<Box as="button" onClick={handleClick}>Button</Box>
<Box as="a" href="/">Link</Box>
```

## Factory Pattern

```tsx
function createDataContext<T>() {
  const Context = createContext<T | null>(null)

  function Provider({ value, children }: { value: T; children: React.ReactNode }) {
    return <Context value={value}>{children}</Context>
  }

  function useData() {
    const data = useContext(Context)
    if (!data) throw new Error('Must be used within Provider')
    return data
  }

  return { Provider, useData }
}

// Usage
const { Provider: UserProvider, useData: useUser } = createDataContext<User>()
```
