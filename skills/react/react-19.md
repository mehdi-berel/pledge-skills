# React 19 New Features

## Ref as Prop

No more `forwardRef`. Ref is a regular prop.

```tsx
// React 19
function Input({ ref, ...props }: React.ComponentProps<'input'> & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}

// Pre-19 with forwardRef
const Input = forwardRef<HTMLInputElement, Props>(function Input(props, ref) {
  return <input ref={ref} {...props} />
})
```

## Context as Provider

```tsx
const ThemeContext = createContext('light')

// React 19
function App() {
  return (
    <ThemeContext value={theme}>
      <Page />
    </ThemeContext>
  )
}

// Pre-19
<ThemeContext.Provider value={theme}>
  <Page />
</ThemeContext.Provider>
```

## Actions

Functions passed to `<form action>`.

```tsx
function Form() {
  async function submitAction(formData: FormData) {
    'use server'
    await saveToDatabase(formData)
  }

  return (
    <form action={submitAction}>
      <input name="email" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## useActionState

Manage async action state.

```tsx
const [state, formAction, isPending] = useActionState(action, initialState)
```

See `concurrent-features.md` for details.

## useOptimistic

Temporary UI updates during async operations.

```tsx
const [optimisticState, addOptimistic] = useOptimistic(state, updateFn)
```

See `concurrent-features.md` for details.

## use

Read resources during render. Can be called conditionally.

```tsx
const data = use(promise)
const value = use(Context)  // Conditional useContext replacement
```

See `other-hooks.md` for details.

## Document Metadata

`<title>`, `<meta>`, `<link>` anywhere in the tree.

```tsx
function BlogPost({ post }: { post: Post }) {
  return (
    <>
      <title>{post.title}</title>
      <meta name="description" content={post.summary} />
      <link rel="canonical" href={post.url} />
      <article>{post.content}</article>
    </>
  )
}
```

## Stylesheet Preloading

Built-in `preload` and `preinit` support.

```tsx
function Component() {
  return (
    <>
      <link rel="preload" href="font.woff2" as="font" type="font/woff2" />
      <link rel="stylesheet" precedence="default" href="styles.css" />
    </>
  )
}
```

## Error Handling

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => logError(error, errorInfo)}
  onReset={(details) => {
    // Reset logic
  }}
>
  <App />
</ErrorBoundary>
```

## React Compiler

Automatic memoization without manual `useMemo`/`useCallback`/`memo`.

```bash
npm install -D babel-plugin-react-compiler
```

```js
// babel.config.js
module.exports = {
  plugins: [['babel-plugin-react-compiler', {}]],
}
```

## Server Components

Components that run on the server. Can access databases, filesystem, etc.

```tsx
// Server Component (default in App Router)
async function ProductList() {
  const products = await db.products.findAll()
  return (
    <ul>
      {products.map(p => <Product key={p.id} product={p} />)}
    </ul>
  )
}
```

See Next.js skill for full Server Components coverage.

## View Transitions

Native browser view transition support.

```tsx
import { ViewTransition } from 'react'

function Gallery({ photos, selectedId }: Props) {
  return (
    <div className="gallery">
      {photos.map(photo => (
        <ViewTransition
          key={photo.id}
          name={photo.id === selectedId ? 'selected-photo' : 'photo'}
        >
          <img src={photo.src} />
        </ViewTransition>
      ))}
    </div>
  )
}
```
