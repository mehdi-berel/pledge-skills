# Error Handling (Next.js 16)

## Expected Errors (Return Values, NOT Throws)

Model expected errors as return values. Use `useActionState` in forms:

```tsx
'use server'
export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  const res = await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
  if (!res.ok) {
    return { message: 'Failed to create post' }
  }
  return { message: 'Created successfully', success: true }
}

// Client
'use client'
import { useActionState } from 'react'
export function Form() {
  const [state, formAction, pending] = useActionState(createPost, { message: '' })
  return (
    <form action={formAction}>
      <input name="title" required />
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>Create</button>
    </form>
  )
}
```

## Uncaught Exceptions (Error Boundaries)

Create `error.tsx` (must be a Client Component) to catch rendering errors:

```tsx
// app/blog/error.tsx
'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => unstable_retry()}>Try again</button>
    </div>
  )
}
```

**Note:** Error boundaries DON'T catch errors in event handlers or async code. Use `useState` for those.

## Custom Error Boundaries (unstable_catchError)

```tsx
'use client'
import { unstable_catchError as catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(
  props: { title: string },
  { error, unstable_retry }: ErrorInfo
) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{error.message}</p>
      <button onClick={() => unstable_retry()}>Try again</button>
    </div>
  )
}

export default catchError(ErrorFallback)
```

Use as a wrapper in any layout or page:

```tsx
import ErrorBoundary from './custom-error-boundary'
export default function Component({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary title="Dashboard Error">{children}</ErrorBoundary>
}
```

## Not Found (404)

```tsx
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) {
    notFound() // Renders nearest not-found.tsx
  }
  return <div>{post.title}</div>
}
```

Create a `not-found.tsx` file in any route segment:

```tsx
// app/blog/not-found.tsx
export default function NotFound() {
  return <div>404 - Blog post not found</div>
}
```

## Server Component Expected Errors

When fetching data in Server Components, return error UI conditionally:

```tsx
export default async function Page() {
  const res = await fetch(`https://api.example.com/data`)
  if (!res.ok) {
    return 'There was an error loading this page.'
  }
  const data = await res.json()
  return <div>{data.title}</div>
}
```

## Event Handler Errors

Error boundaries don't catch errors in event handlers. Catch manually:

```tsx
'use client'
import { useState } from 'react'

export function Button() {
  const [error, setError] = useState<Error | null>(null)

  const handleClick = () => {
    try {
      // work that might fail
      throw new Error('Something went wrong')
    } catch (reason) {
      setError(reason as Error)
    }
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return <button onClick={handleClick}>Click me</button>
}
```
