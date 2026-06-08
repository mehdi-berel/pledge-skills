# Forms, Validation, and Optimistic Updates (Next.js 16)

## Server Action Forms

The simplest form uses a Server Action directly:

```tsx
// Server Component
export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server'
    const rawData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }
    await db.invoices.create(rawData)
    revalidateTag('invoices')
  }

  return (
    <form action={createInvoice}>
      <input name="customerId" />
      <input name="amount" type="number" />
      <select name="status">
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
      </select>
      <button type="submit">Create</button>
    </form>
  )
}
```

## Passing Additional Arguments

Use `.bind()` to pass extra data:

```tsx
// app/page.tsx
import { updateUser } from './actions'

export default function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input name="name" />
      <button type="submit">Update</button>
    </form>
  )
}

// app/actions.ts
'use server'
export async function updateUser(userId: string, formData: FormData) {
  await db.users.update(userId, { name: formData.get('name') })
  revalidateTag(`user-${userId}`)
}
```

## Form Validation with Zod

```tsx
'use server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  amount: z.coerce.number().positive(),
})

export async function createInvoice(prevState: any, formData: FormData) {
  const validated = schema.safeParse({
    email: formData.get('email'),
    amount: formData.get('amount'),
  })

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Missing or invalid fields',
    }
  }

  await db.invoices.create(validated.data)
  revalidateTag('invoices')
  return { message: 'Invoice created' }
}
```

## Client-Side Validation with useActionState

```tsx
'use client'
import { useActionState } from 'react'
import { createInvoice } from './actions'

const initialState = { message: '', errors: {} }

export function InvoiceForm() {
  const [state, formAction, pending] = useActionState(createInvoice, initialState)

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      {state.errors?.email && <p>{state.errors.email}</p>}

      <input name="amount" type="number" required />
      {state.errors?.amount && <p>{state.errors.amount}</p>}

      <button disabled={pending}>
        {pending ? 'Creating...' : 'Create Invoice'}
      </button>

      <p aria-live="polite">{state.message}</p>
    </form>
  )
}
```

## Pending States with useFormStatus

```tsx
'use client'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} type="submit">
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

// Use in any form:
<form action={createInvoice}>
  <input name="email" />
  <SubmitButton />
</form>
```

**Note:** In React 19, `useFormStatus` also returns `data`, `method`, and `action`.

## Optimistic Updates

Use `useOptimistic` to update UI before the server responds:

```tsx
'use client'
import { useOptimistic } from 'react'
import { sendMessage } from './actions'

type Message = { id: string; text: string; sending?: boolean }

export function Chat({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [
      ...state,
      { ...newMessage, sending: true },
    ]
  )

  async function formAction(formData: FormData) {
    const text = formData.get('message') as string
    const tempId = crypto.randomUUID()
    addOptimisticMessage({ id: tempId, text })
    await sendMessage(text)
  }

  return (
    <div>
      {optimisticMessages.map((msg) => (
        <div key={msg.id} style={{ opacity: msg.sending ? 0.5 : 1 }}>
          {msg.text}
        </div>
      ))}
      <form action={formAction}>
        <input name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

## Nested Form Elements

The `formAction` on a button can override the form's action:

```tsx
<form action={createInvoice}>
  <input name="customerId" />
  <button type="submit">Create</button>
  <button formAction={createDraft}>Save as Draft</button>
</form>
```

## Programmatic Form Submission

```tsx
'use client'
import { useRef } from 'react'

export function Search() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={searchAction}>
      <input
        name="query"
        onChange={(e) => {
          if (e.target.value.length > 2) {
            formRef.current?.requestSubmit()
          }
        }}
      />
    </form>
  )
}
```
