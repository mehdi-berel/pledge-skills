# Forms (React)

## Controlled Components

React controls the form state.

```tsx
function NameForm() {
  const [name, setName] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(name)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Uncontrolled Components

DOM manages form state. Use refs to read values.

```tsx
function NameForm() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(inputRef.current?.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Form Actions (React 19)

Pass a function to `action` prop:

```tsx
function Form() {
  async function submitAction(formData: FormData) {
    'use server'  // Server Action
    await saveToDatabase(formData)
  }

  return (
    <form action={submitAction}>
      <input name="email" type="email" required />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Client-Side Action

```tsx
function Form() {
  function handleSubmit(formData: FormData) {
    const email = formData.get('email') as string
    console.log(email)
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## useActionState with Forms

```tsx
function Form() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: State, formData: FormData) => {
      const email = formData.get('email') as string

      try {
        await subscribeEmail(email)
        return { success: true, message: 'Subscribed!' }
      } catch (error) {
        return { success: false, message: 'Failed. Try again.' }
      }
    },
    { success: false, message: '' }
  )

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <button disabled={isPending}>
        {isPending ? 'Submitting...' : 'Subscribe'}
      </button>
      {state.message && (
        <p className={state.success ? 'text-green-500' : 'text-red-500'}>
          {state.message}
        </p>
      )}
    </form>
  )
}
```

## useFormStatus (react-dom)

Read pending state of parent `<form>`:

```tsx
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus()

  return (
    <button disabled={pending} type="submit">
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

// Usage
function Form() {
  return (
    <form action={handleAction}>
      <input name="email" />
      <SubmitButton />
    </form>
  )
}
```

## Form Validation

### HTML5 Validation

```tsx
<input type="email" required minLength={3} maxLength={50} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
```

### Custom Validation

```tsx
function Form() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validate = (value: string) => {
    if (!value.includes('@')) return 'Invalid email'
    if (value.length < 5) return 'Too short'
    return ''
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setError(validate(value))
  }

  return (
    <form>
      <input value={email} onChange={handleChange} />
      {error && <span className="text-red-500">{error}</span>}
    </form>
  )
}
```

### With Zod (Recommended)

```tsx
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
})

type FormData = z.infer<typeof schema>

function Form() {
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    const result = schema.safeParse(data)
    if (!result.success) {
      const fieldErrors: typeof errors = {}
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as keyof FormData
        fieldErrors[path] = issue.message
      })
      setErrors(fieldErrors)
    }
  }
}
```

## Multiple Fields

```tsx
function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <form>
      <input value={form.name} onChange={handleChange('name')} placeholder="Name" />
      <input value={form.email} onChange={handleChange('email')} placeholder="Email" />
      <textarea value={form.message} onChange={handleChange('message')} placeholder="Message" />
    </form>
  )
}
```
