# Server Functions and Server Actions (Next.js 16)

## Terminology

- **Server Function**: Any async function that runs on the server. Called from client via network request.
- **Server Action**: A Server Function used specifically for form submissions and mutations.

**Always verify authentication and authorization inside every Server Function.** They are reachable via direct POST requests, not just through your UI.

## Defining Server Functions

File-level directive (recommended for shared actions):

```tsx
// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'
import { auth } from '@/lib/auth'

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  const title = formData.get('title')
  await db.posts.create({ title, userId: session.user.id })
  revalidateTag('posts', 'max')
}

export async function deletePost(formData: FormData) {
  const id = formData.get('id')
  await db.posts.delete(id)
  revalidateTag('posts', 'max')
}
```

Inline Server Functions (inside Server Components):

```tsx
export default function Page() {
  async function createPost(formData: FormData) {
    'use server'
    await db.posts.create({ title: formData.get('title') })
    revalidateTag('posts', 'max')
  }

  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  )
}
```

## Invoking from Client Components

Import from a `'use server'` file:

```tsx
'use client'
import { createPost } from '@/app/actions'

export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

### Passing Actions as Props

```tsx
// Server Component
import { updateItem } from './actions'
import ClientForm from './ClientForm'

export default function Page() {
  return <ClientForm updateItemAction={updateItem} />
}

// ClientForm.tsx
'use client'
export default function ClientForm({
  updateItemAction,
}: {
  updateItemAction: (formData: FormData) => void
}) {
  return <form action={updateItemAction}>{/* ... */}</form>
}
```

## Progressive Enhancement

Forms with Server Actions work **without JavaScript**:
- Server Components support progressive enhancement by default
- The browser submits the form natively
- Next.js handles it server-side
- After hydration, the browser does not refresh on form submission

In Client Components, form submissions are queued if JS isn't loaded yet and prioritized for hydration.

## Redirect After Mutation

```tsx
'use server'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const post = await db.posts.create({
    title: formData.get('title'),
  })
  redirect(`/blog/${post.slug}`)
}
```

## Cookies in Server Functions

```tsx
'use server'
import { cookies } from 'next/headers'

export async function setCookie() {
  const cookieStore = await cookies()
  cookieStore.set('theme', 'dark')
}
```

## Refresh Data After Mutation

```tsx
'use server'
import { revalidatePath } from 'next/cache'

export async function updatePost(id: string) {
  await db.posts.update(id)
  revalidatePath('/blog/[slug]', 'page')
}
```

## When to Use Server Actions vs Route Handlers

| Use Server Actions | Use Route Handlers |
|-------------------|-------------------|
| Form submissions | External API consumers |
| Mutations triggered by UI | Webhooks |
| When you want progressive enhancement | When you need full control over HTTP (headers, status codes) |
| When returning updated UI | When not using React Server Components |

Route handlers run in a non-React environment (no React DOM). Use Server Actions when possible.
