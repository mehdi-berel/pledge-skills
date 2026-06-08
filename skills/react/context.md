# Context (React)

Context lets components pass data through the tree without prop drilling.

## createContext

```tsx
import { createContext, useContext } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
})
```

## Provider Pattern

```tsx
// React 19+: Context IS the provider
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  )
}

// Pre-React 19
// <ThemeContext.Provider value={{ theme, toggleTheme }}>
```

## useContext

```tsx
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <button
      className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
      onClick={toggleTheme}
    >
      Toggle
    </button>
  )
}
```

## Custom Hook Pattern (Recommended)

```tsx
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Usage
function ThemedButton() {
  const { theme, toggleTheme } = useTheme()  // Type-safe, throws if outside provider
  // ...
}
```

## Context with Reducer

```tsx
interface State {
  user: User | null
  isAuthenticated: boolean
}

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }

const AuthContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | null>(null)

function authReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, isAuthenticated: true }
    case 'LOGOUT':
      return { user: null, isAuthenticated: false }
    default:
      return state
  }
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
  })

  return (
    <AuthContext value={{ state, dispatch }}>
      {children}
    </AuthContext>
  )
}
```

## Optimizing Context Performance

### Problem: All consumers re-render when context changes

```tsx
// ❌ Bad: single context with many consumers
function App() {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)

  return (
    <AppContext value={{ theme, setTheme, user, setUser }}>
      {/* Every consumer re-renders when theme OR user changes */}
    </AppContext>
  )
}
```

### Solution 1: Split Contexts

```tsx
const ThemeContext = createContext(null)
const UserContext = createContext(null)

function App() {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)

  return (
    <ThemeContext value={{ theme, setTheme }}>
      <UserContext value={{ user, setUser }}>
        <Layout />
      </UserContext>
    </ThemeContext>
  )
}
```

### Solution 2: Memoize the context value

```tsx
function Provider({ children }) {
  const [theme, setTheme] = useState('light')

  // ✅ Memoize so consumers don't re-render unnecessarily
  const value = useMemo(() => ({ theme, setTheme }), [theme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}
```

### Solution 3: Separate state from dispatch

```tsx
const CountStateContext = createContext(0)
const CountDispatchContext = createContext<React.Dispatch<React.SetStateAction<number>>>(() => {})

function CounterProvider({ children }) {
  const [count, setCount] = useState(0)

  return (
    <CountStateContext value={count}>
      <CountDispatchContext value={setCount}>
        {children}
      </CountDispatchContext>
    </CountStateContext>
  )
}

// Components reading only state won't re-render when dispatchers change
function Display() {
  const count = useContext(CountStateContext)  // Only re-renders when count changes
  return <p>{count}</p>
}
```

## Overriding Context for a Subtree

```tsx
function App() {
  return (
    <ThemeContext value={lightTheme}>
      <Page />
      <ThemeContext value={darkTheme}>  {/* Override for sidebar */}
        <Sidebar />
      </ThemeContext>
    </ThemeContext>
  )
}
```

## Context vs Prop Drilling vs External State

| Scenario | Solution |
|----------|----------|
| Theme, auth, locale (rarely change) | Context |
| Form data (complex, local) | useState/useReducer or form library |
| Server state | React Query, SWR, or framework loaders |
| Global UI state (modals, toasts) | Context or state library |
| Deeply nested data that changes frequently | Lift state or external library |
| 3-5 levels of props | Consider Context |
| 1-2 levels of props | Prop drilling is fine |

## Common Patterns

### Compound Component Pattern with Context

```tsx
const TabsContext = createContext({
  activeTab: '',
  setActiveTab: (id: string) => {},
})

function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
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
  const { activeTab, setActiveTab } = useContext(TabsContext)
  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      onClick={() => setActiveTab(id)}
      className={activeTab === id ? 'border-b-2 border-blue-500' : ''}
    >
      {children}
    </button>
  )
}

// Usage
<Tabs defaultTab="account">
  <TabList>
    <Tab id="account">Account</Tab>
    <Tab id="security">Security</Tab>
  </TabList>
</Tabs>
```
