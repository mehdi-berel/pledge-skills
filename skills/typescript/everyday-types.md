# Everyday Types (TypeScript)

## Primitives

```ts
let str: string = 'hello'
let num: number = 42
let bool: boolean = true
let big: bigint = 100n
let sym: symbol = Symbol('key')
```

**Note:** TypeScript uses lowercase primitives (`string`, `number`, `boolean`).
`String`, `Number`, `Boolean` (capitalized) refer to wrapper objects — avoid them.

## Arrays

```ts
// Two equivalent syntaxes:
let nums: number[] = [1, 2, 3]
let nums2: Array<number> = [1, 2, 3]

// Readonly array
let readonlyNums: ReadonlyArray<number> = [1, 2, 3]
readonlyNums.push(4)  // ❌ Error

// Tuple
let point: [number, number] = [10, 20]
let labeled: [name: string, age: number] = ['Alice', 30]  // labeled tuple
```

## `any`

```ts
let notSure: any = 4
notSure = 'maybe a string'
notSure = false
notSure.whatever()  // No type checking — use sparingly
```

**Best practice:** Avoid `any`. Use `unknown` when you truly don't know the type.

## `unknown`

```ts
let notSure: unknown = 4
notSure.toFixed()  // ❌ Error — must narrow first

if (typeof notSure === 'number') {
  notSure.toFixed()  // ✅ OK — narrowed to number
}
```

## Object Types

```ts
// Inline
function printCoord(pt: { x: number; y: number }) {
  console.log(pt.x, pt.y)
}

// Optional properties
function greet(person: { name: string; age?: number }) {
  console.log(person.name)
  console.log(person.age?.toFixed())  // safe with ?.
}
```

## Union Types

```ts
type ID = number | string

function printId(id: ID) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase())
  } else {
    console.log(id.toFixed())
  }
}
```

## Type Aliases

```ts
type Point = { x: number; y: number }
type ID = number | string
type Callback = (data: string) => void

// Can be used before declaration in same scope (unlike interfaces in some cases)
type Tree<T> = {
  value: T
  children: Tree<T>[]
}
```

## Interfaces

```ts
interface Person {
  name: string
  age: number
}

// Extending interfaces
interface Employee extends Person {
  employeeId: number
}

// Declaration merging — interfaces with same name merge
interface Window {
  myLib: any
}
```

### Type Aliases vs Interfaces

| Feature | `type` | `interface` |
|---------|--------|-------------|
| Can describe objects | ✅ | ✅ |
| Can describe unions | ✅ | ❌ |
| Can describe tuples | ✅ | ❌ |
| Can be extended via `extends` | ❌ (use `&`) | ✅ |
| Declaration merging | ❌ | ✅ |
| Generally preferred for | Complex types, unions | Public API shapes |

## Type Assertions

```ts
const myCanvas = document.getElementById('main') as HTMLCanvasElement

// Alternative syntax (not available in JSX):
const myCanvas2 = <HTMLCanvasElement>document.getElementById('main')

// Non-null assertion (!)
const input = document.querySelector('input')!  // Asserts not null
```

**Warning:** `as` does NOT perform runtime conversion. It only tells TypeScript to trust you.

## Literal Types

```ts
let literal: 'hello' = 'hello'
literal = 'world'  // ❌ Error

let literalNum: 42 = 42

// Combine with unions
type Direction = 'north' | 'south' | 'east' | 'west'
type HttpStatus = 200 | 404 | 500

// Literal inference with `as const`
const config = {
  host: 'localhost',
  port: 3000,
} as const  // { readonly host: "localhost"; readonly port: 3000 }
```

## `null` and `undefined`

```ts
// With strictNullChecks: true
let maybe: string | null = null
maybe = 'hello'

// Optional chaining
function getLength(s: string | null | undefined) {
  return s?.length ?? 0
}

// Nullish coalescing (??)
const value = userInput ?? 'default'  // Only null/undefined, not 0 or ''
```

## Enums

```ts
// Numeric enum (auto-incrementing)
enum Direction {
  Up = 1,
  Down,    // 2
  Left,    // 3
  Right,   // 4
}

// String enum
enum DirectionStr {
  Up = 'UP',
  Down = 'DOWN',
}

// Const enum — inlined at compile time (no object generated)
const enum Permission {
  Read = 1,
  Write = 2,
}

// Modern alternative: union of string literals (preferred)
type DirectionModern = 'Up' | 'Down' | 'Left' | 'Right'
```

**Recommendation:** Prefer string literal unions over enums. They're more type-safe, tree-shakeable, and don't generate runtime code.

## Less Common Primitives

```ts
// `object` (non-primitive — excludes null)
let obj: object = { a: 1 }
obj = null  // ❌ Error

// `never` — represents values that never occur
function throwError(msg: string): never {
  throw new Error(msg)
}

// `void` — function returns nothing (or undefined)
function log(msg: string): void {
  console.log(msg)
}
```
