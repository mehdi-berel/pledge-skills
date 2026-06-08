# Utility Types (TypeScript)

All utility types are globally available — no import needed.

## `Awaited<T>`

Recursively unwraps Promise types:

```ts
type A = Awaited<Promise<string>>         // string
type B = Awaited<Promise<Promise<number>>> // number
type C = Awaited<string | Promise<number>>  // string | number
```

## `Partial<T>`

Makes all properties optional:

```ts
interface Todo {
  title: string
  description: string
}

function updateTodo(todo: Todo, fields: Partial<Todo>) {
  return { ...todo, ...fields }
}

updateTodo({ title: 'A', description: 'B' }, { title: 'C' })
```

## `Required<T>`

Makes all properties required (removes `?`):

```ts
interface Props {
  a?: number
  b?: string
}

const obj: Required<Props> = { a: 0, b: '' }
```

## `Readonly<T>`

Makes all properties `readonly`:

```ts
interface Todo {
  title: string
}

const todo: Readonly<Todo> = { title: 'Delete inactive users' }
todo.title = 'Hello'  // ❌ Error
```

## `Record<Keys, Type>`

Creates a type with keys from union and values of given type:

```ts
type PageInfo = { title: string }

type Page = 'home' | 'about' | 'contact'

const nav: Record<Page, PageInfo> = {
  home: { title: 'Home' },
  about: { title: 'About' },
  contact: { title: 'Contact' },
}
```

## `Pick<T, K>` / `Omit<T, K>`

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>
// { title: string; completed: boolean }

type TodoInfo = Omit<Todo, 'completed'>
// { title: string; description: string }
```

## `Exclude<Union, Excluded>` / `Extract<Union, Extracted>`

```ts
type T0 = Exclude<'a' | 'b' | 'c', 'a'>           // 'b' | 'c'
type T1 = Exclude<string | number | (() => void), Function>  // string | number

type T2 = Extract<'a' | 'b' | 'c', 'a' | 'f'>     // 'a'
type T3 = Extract<string | number | (() => void), Function>  // () => void
```

## `NonNullable<T>`

Removes `null` and `undefined`:

```ts
type T = NonNullable<string | number | undefined>  // string | number
```

## `Parameters<T>` / `ConstructorParameters<T>`

```ts
type T0 = Parameters<(a: number, b: string) => void>  // [a: number, b: string]

type T1 = ConstructorParameters<ErrorConstructor>  // [message?: string]
```

## `ReturnType<T>` / `InstanceType<T>`

```ts
function f() {
  return { a: 1, b: 2 }
}

type T0 = ReturnType<typeof f>  // { a: number; b: number }

class C {
  x = 0
  y = 0
}

type T1 = InstanceType<typeof C>  // C
```

## `ThisParameterType<T>` / `OmitThisParameter<T>`

```ts
function toHex(this: Number) {
  return this.toString(16)
}

type T0 = ThisParameterType<typeof toHex>  // Number
type T1 = OmitThisParameter<typeof toHex>   // () => string
```

## `NoInfer<T>` (TypeScript 5.4+)

Prevents TypeScript from inferring a type parameter from a specific position:

```ts
function create<T>(value: T, defaultValue: NoInfer<T>) {
  return value ?? defaultValue
}

// Without NoInfer: T would be inferred from defaultValue as 'hello'
// With NoInfer: T inferred from value as string, defaultValue must match
create('', 'hello')  // T = string
```

## `ThisType<T>`

Sets the type of `this` in an object literal:

```ts
type ObjectDescriptor<D, M> = {
  data?: D
  methods?: M & ThisType<D & M>  // methods have `this` typed as D & M
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  const data: object = desc.data || {}
  const methods: object = desc.methods || {}
  return { ...data, ...methods } as D & M
}

const obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx  // `this` is { x: number; y: number; moveBy: ... }
      this.y += dy
    },
  },
})
```

## Intrinsic String Manipulation Types

```ts
type Greet = 'hello world'

type T0 = Uppercase<Greet>      // 'HELLO WORLD'
type T1 = Lowercase<Greet>      // 'hello world'
type T2 = Capitalize<Greet>     // 'Hello world'
type T3 = Uncapitalize<Greet>   // 'hello world'
```
