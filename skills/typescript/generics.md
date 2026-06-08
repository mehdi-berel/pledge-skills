# Generics (TypeScript)

## Hello World of Generics

```ts
function identity<T>(arg: T): T {
  return arg
}

// Explicit type argument
let output = identity<string>('myString')

// Inferred
let output2 = identity('myString')  // T inferred as string
```

## Working with Generic Type Variables

```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length)  // ❌ Error — T doesn't have .length
  return arg
}

// Fix with constraint
function loggingIdentity2<T extends { length: number }>(arg: T): T {
  console.log(arg.length)  // ✅ Now OK
  return arg
}
```

## Generic Types

```ts
// Generic interface
interface GenericIdentityFn<T> {
  (arg: T): T
}

let myIdentity: GenericIdentityFn<number> = (arg) => arg

// Generic type alias
type Container<T> = { value: T }

// Generic class
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T

  constructor(zeroValue: T, add: (x: T, y: T) => T) {
    this.zeroValue = zeroValue
    this.add = add
  }
}

const myNum = new GenericNumber<number>(0, (x, y) => x + y)
```

## Generic Constraints

```ts
interface Lengthwise {
  length: number
}

function loggingIdentity3<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

// Multiple constraints
interface Printable {
  print(): void
}

function logAndPrint<T extends Lengthwise & Printable>(arg: T) {
  console.log(arg.length)
  arg.print()
}
```

## Using Type Parameters in Generic Constraints

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

getProperty({ a: 1, b: 2 }, 'a')  // ✅
getProperty({ a: 1, b: 2 }, 'c')  // ❌ Error
```

## Generic Parameter Defaults

```ts
interface PaginationOptions<T = any> {
  page: number
  limit: number
  data: T[]
}

const opts: PaginationOptions = { page: 1, limit: 10, data: [] }  // T = any
const opts2: PaginationOptions<string> = { page: 1, limit: 10, data: ['a'] }
```

## Variance Annotations (TypeScript 4.7+)

```ts
interface Animal { name: string }
interface Dog extends Animal { breed: string }

// Out variance (covariant) — producer of T
interface Producer<out T> {
  make(): T
}

let animalProducer: Producer<Animal> = { make: () => ({ name: '' }) }
let dogProducer: Producer<Dog> = { make: () => ({ name: '', breed: '' }) }
animalProducer = dogProducer  // ✅ OK — out variance

// In variance (contravariant) — consumer of T
interface Consumer<in T> {
  consume(arg: T): void
}

let animalConsumer: Consumer<Animal> = { consume: (a) => console.log(a.name) }
let dogConsumer: Consumer<Dog> = { consume: (d) => console.log(d.breed) }
dogConsumer = animalConsumer  // ✅ OK — in variance
```

**Without variance annotations**, TypeScript uses bivariant checking for function parameters in certain contexts for practical convenience.

## Best Practices for Generic Functions

1. **Push type parameters down** — use fewer generics, more concrete types
2. **Use constraints to limit types** — `extends` instead of `any`
3. **Return types should use type parameters** — otherwise inference is lost
4. **Avoid too many type parameters** — if you need 3+, reconsider the design

```ts
// ❌ Bad — T not used in return type, inference is lost
function firstElement1<T>(arr: T[]) {
  return arr[0]  // inferred as any
}

// ✅ Good — T used in return
function firstElement2<T>(arr: T[]): T | undefined {
  return arr[0]
}
```
