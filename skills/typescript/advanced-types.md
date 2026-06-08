# Advanced Types (TypeScript)

## Mapped Types

Create new types by transforming properties of an existing type:

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}

type Required<T> = {
  [P in keyof T]-?: T[P]  // `-?` removes optionality
}

type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// Custom mapped type

type EventPayloads<EventConfig> = {
  [EventName in keyof EventConfig]: {
    eventName: EventName
    payload: EventConfig[EventName]
  }
}

type MyEvents = {
  click: { x: number; y: number }
  submit: { formData: FormData }
}

// Results in:
// { click: { eventName: 'click'; payload: { x: number; y: number } }, ... }
type EventTypes = EventPayloads<MyEvents>
```

### Key Remapping (as clause)

```ts
// Change property names to camelCase
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface Person {
  name: string
  age: number
}

type PersonGetters = Getters<Person>
// { getName: () => string; getAge: () => number }
```

## Conditional Types

```ts
type IsString<T> = T extends string ? true : false

type A = IsString<'hello'>     // true
type B = IsString<123>         // false

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never
type Arr = ToArray<string | number>  // string[] | number[]

// Non-distributive (wrap in tuple)
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never
type Arr2 = ToArrayNonDist<string | number>  // (string | number)[]
```

### `infer`

```ts
// Extract return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// Extract promise type
type Awaited<T> = T extends Promise<infer U> ? U : T

// Extract array element type
type ElementType<T> = T extends (infer E)[] ? E : never

type Num = ElementType<number[]>  // number
```

## Template Literal Types

```ts
type World = 'world'
type Greeting = `hello ${World}`  // 'hello world'

// With unions
type Color = 'red' | 'green' | 'blue'
type ColorHex = `#${Color}`  // '#red' | '#green' | '#blue'

// Practical: typed event names
type EventName<T extends string> = `on${Capitalize<T>}`
type ClickEvent = EventName<'click'>  // 'onClick'

// Intrinsic string types

type Greet = 'hello world'
type Upper = Uppercase<Greet>      // 'HELLO WORLD'
type Lower = Lowercase<Greet>      // 'hello world'
type FirstCap = Capitalize<Greet>    // 'Hello world'
type FirstLower = Uncapitalize<Greet> // 'hello world'
```

## Indexed Access Types

```ts
interface Person {
  age: number
  name: string
  isAlive: boolean
}

type Age = Person['age']  // number
type NameOrAge = Person['name' | 'age']  // string | number
type Values = Person[keyof Person]  // number | string | boolean

// With arrays
type MyArray = [{ a: 1 }, { b: 2 }]
type First = MyArray[0]      // { a: 1 }
type All = MyArray[number]   // { a: 1 } | { b: 2 }
```

## `keyof` Type Operator

```ts
interface Person {
  name: string
  age: number
}

type PersonKeys = keyof Person  // 'name' | 'age'

// With index signatures
interface StringMap {
  [key: string]: string
}

type MapKeys = keyof StringMap  // string | number
```

## `typeof` Type Operator

```ts
const config = {
  host: 'localhost',
  port: 3000,
}

type Config = typeof config
// { host: string; port: number }

// With `as const` for literal types
const config2 = {
  host: 'localhost',
  port: 3000,
} as const

type Config2 = typeof config2
// { readonly host: 'localhost'; readonly port: 3000 }

// With function return type
function createUser() {
  return { id: 1, name: 'Alice' }
}

type User = ReturnType<typeof createUser>
```

## Lookup Types with ` keyof`

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }
const name = getProperty(user, 'name')  // string
```

## Recursive Conditional Types

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T

interface Nested {
  a: { b: { c: string } }
}

type ReadonlyNested = DeepReadonly<Nested>
// { readonly a: { readonly b: { readonly c: string } } }
```

## Branded Types (Nominal Typing)

```ts
// Create nominal types using intersection with unique symbol
type UserId = string & { __brand: 'UserId' }
type PostId = string & { __brand: 'PostId' }

function getUser(id: UserId) { /* ... */ }
function getPost(id: PostId) { /* ... */ }

const userId = 'user-123' as UserId
const postId = 'post-456' as PostId

getUser(postId)  // ❌ Error — PostId not assignable to UserId
```
