# Suspense (React)

Suspense lets you declaratively specify a loading state while a child component is loading.

## Basic Usage

```tsx
import { Suspense } from 'react'

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Comments />
    </Suspense>
  )
}
```

When `<Comments>` suspends (throws a Promise or reads an unresolved Promise with `use()`), React shows `<Spinner>`. When the Promise resolves, React renders `<Comments>`.

## Lazy Loading Components

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

## Data Fetching with Suspense

```tsx
// Wrap fetch in a Promise
function fetchUser(userId: string): Promise<User> {
  // Caches and returns the same promise for same userId
  return fetch(`/api/users/${userId}`).then(r => r.json())
}

function UserProfile({ userId }: { userId: string }) {
  const user = use(fetchUser(userId))
  return <h1>{user.name}</h1>
}

// Usage
function App() {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserProfile userId="123" />
    </Suspense>
  )
}
```

## Nested Suspense

Inner boundaries catch errors and show their own fallback:

```tsx
function App() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <NavBar />  {/* Always ready */}
      <Suspense fallback={<ContentSpinner />}>
        <MainContent />  {/* Suspends */}
      </Suspense>
      <Suspense fallback={<SidebarSpinner />}>
        <Sidebar />  {/* Suspends independently */}
      </Suspense>
    </Suspense>
  )
}
```

## Revealing Content Together

Wrap siblings that should appear together:

```tsx
function ProfilePage({ username }: { username: string }) {
  return (
    <Suspense fallback={<BigSpinner />}>
      {/* Both appear together when ALL are ready */}
      <ProfileCover username={username} />
      <ProfileTimeline username={username} />
    </Suspense>
  )
}
```

## Showing Stale Content

```tsx
function SearchResults({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query)

  return (
    <div style={{ opacity: query !== deferredQuery ? 0.5 : 1 }}>
      <Suspense fallback={<ResultsSkeleton />}>
        <Results query={deferredQuery} />
      </Suspense>
    </div>
  )
}
```

## Resetting Suspense Boundaries

Use `key` to reset:

```tsx
function Router() {
  const [page, setPage] = useState('/home')

  return (
    <Suspense fallback={<Spinner />}>
      {/* Reset and show fallback on page change */}
      <PageContent key={page} page={page} />
    </Suspense>
  )
}
```

## Error Handling

Suspense does NOT catch errors. Use Error Boundaries:

```tsx
<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Spinner />}>
    <Profile />
  </Suspense>
</ErrorBoundary>
```

## Server-Only Content

```tsx
function Component() {
  const isServer = typeof window === 'undefined'

  return (
    <>
      {isServer ? <ServerContent /> : (
        <Suspense fallback={<ClientSpinner />}>
          <ClientContent />
        </Suspense>
      )}
    </>
  )
}
```
