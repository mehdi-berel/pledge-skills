# Narrowing (TypeScript)

Narrowing is how TypeScript refines broad types to more specific ones based on runtime checks.

## `typeof` Type Guards

```ts
function padLeft(padding: string | number, input: string) {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + input  // padding is number here
  }
  return padding + input  // padding is string here
}
```

**Limitations:** `typeof` only works on `string`, `number`, `bigint`, `boolean`, `symbol`, `undefined`, `object`, `function`.

## Truthiness Narrowing

```ts
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === 'object') {
    for (const s of strs) {  // strs is string[] here
      console.log(s)
    }
  } else if (typeof strs === 'string') {
    console.log(strs)  // strs is string here
  }
}

// ⚠️ Pitfall: empty string '' is falsy
function printLength(str: string | null) {
  if (str) {           // ❌ '' won't pass — use str !== null
    console.log(str.length)
  }
}
```

## Equality Narrowing

```ts
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // Both are string (the only overlap)
    x.toUpperCase()
    y.toUpperCase()
  }
}
```

## `in` Operator Narrowing

```ts
type Fish = { swim: () => void }
type Bird = { fly: () => void }

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    return animal.swim()  // Fish
  }
  return animal.fly()     // Bird
}
```

## `instanceof` Narrowing

```ts
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString())  // Date
  } else {
    console.log(x.toUpperCase())    // string
  }
}
```

## Assignments

```ts
let x = Math.random() < 0.5 ? 10 : 'hello'  // string | number

x = 1  // x is now number
x = 'goodbye'  // x is now string
```

## Control Flow Analysis

```ts
function padLeft(padding: string | number, input: string) {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + input  // number
  }
  // TypeScript knows padding must be string here
  return padding + input
}
```

## Type Predicates (User-Defined Type Guards)

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}

function feed(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim()   // Fish (narrowed)
  } else {
    pet.fly()    // Bird
  }
}
```

## Assertion Functions

```ts
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== 'string') {
    throw new Error(`Expected string, got ${typeof val}`)
  }
}

function assertNonNull<T>(val: T): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    throw new Error('Value is null or undefined')
  }
}
```

## Discriminated Unions

```ts
interface Circle {
  kind: 'circle'
  radius: number
}

interface Square {
  kind: 'square'
  sideLength: number
}

type Shape = Circle | Square

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.sideLength ** 2
    default:
      // Exhaustiveness check
      const _exhaustiveCheck: never = shape
      return _exhaustiveCheck
  }
}
```

**Pattern:** Each member has a `kind` property with a unique string literal.

## Exhaustiveness Checking with `never`

```ts
function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2
    case 'square': return shape.sideLength ** 2
    default:
      const _exhaustiveCheck: never = shape
      // ❌ If you add a Triangle but forget a case, this errors:
      // Type 'Triangle' is not assignable to type 'never'
      return _exhaustiveCheck
  }
}
```

**Best practice:** Always add a default case with `never` for discriminated unions to catch missing cases at compile time.
