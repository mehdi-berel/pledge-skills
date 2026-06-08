# Functions (TypeScript)

## Function Type Expressions

```ts
type GreetFunction = (name: string) => string

const greet: GreetFunction = (name) => `Hello, ${name}`
```

## Call Signatures

```ts
interface DescribableFunction {
  description: string
  (someArg: number): boolean  // call signature
}

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + ' returned ' + fn(6))
}
```

## Construct Signatures

```ts
interface SomeConstructor {
  new (s: string): SomeObject
}

function fn(ctor: SomeConstructor) {
  return new ctor('hello')
}
```

## Generic Functions

```ts
function identity<T>(arg: T): T {
  return arg
}

// Usage:
let output = identity<string>('myString')  // Explicit
let output2 = identity('myString')          // Inferred: T = string
```

### Inference

```ts
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn)
}

const lengths = map(['a', 'bb', 'ccc'], (s) => s.length)
// T = string, U = number
```

### Constraints

```ts
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

logLength({ length: 10, value: 3 })  // ✅
logLength(3)  // ❌ Error — number has no .length
```

### Multiple Type Parameters with Constraints

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

getProperty({ a: 1, b: 2 }, 'a')  // ✅
getProperty({ a: 1, b: 2 }, 'c')  // ❌ Error — 'c' is not a key
```

## Optional Parameters

```ts
function buildName(firstName: string, lastName?: string) {
  return lastName ? `${firstName} ${lastName}` : firstName
}

// Default parameters
function buildName2(firstName: string, lastName = 'Smith') {
  return `${firstName} ${lastName}`
}
```

## Function Overloads

```ts
// Overload signatures
function makeDate(timestamp: number): Date
function makeDate(m: number, d: number, y: number): Date

// Implementation signature (not callable directly)
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d)
  }
  return new Date(mOrTimestamp)
}

makeDate(12345678)           // ✅ One arg
makeDate(5, 5, 2005)         // ✅ Three args
makeDate(1, 2)               // ❌ Error — no overload for 2 args
```

### Writing Good Overloads

Prefer union types when possible:

```ts
// ❌ Prefer to avoid — simpler with union
defunction len(s: string): number
defunction len(arr: any[]): number
defunction len(x: any) { return x.length }

// ✅ Better — single signature with union
defunction len(x: string | any[]): number {
  return x.length
}
```

## `this` in Functions

```ts
interface User {
  id: number
  admin: boolean
}

declare const getDB: () => DB

// `this` parameter — first param, not counted in arity
function getAdmin(this: DB): User[] {
  return this.filterUsers((u) => u.admin)
}

const db = getDB()
const admins = getAdmin.call(db)  // Must be called with db as `this`
```

## Rest Parameters and Arguments

```ts
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x)
}

const a = [1, 2, 3] as const
const b = multiply(10, ...a)  // Spread is OK with tuple types
```

## Parameter Destructuring

```ts
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  return a + b + c
}

// With named destructuring
function sum2({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c)
}
```

## Assignability of Functions

### Return type `void`

```ts
type voidFunc = () => void

const f1: voidFunc = () => true      // ✅ Allowed (ignores return)
const f2: voidFunc = () => 'hello'   // ✅ Allowed

// But you can't USE the return value:
const v = f1()  // v is void
```

This is useful for callbacks where you don't care about the return value:

```ts
const src = [1, 2, 3]
const dst: number[] = []

src.forEach((el) => dst.push(el))  // push returns number, but forEach expects () => void
```
