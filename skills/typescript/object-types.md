# Object Types (TypeScript)

## Property Modifiers

### Optional Properties

```ts
interface Shape {
  color: string
  width?: number  // Optional
}

function draw(shape: Shape) {
  const width = shape.width ?? 100  // Default if not provided
}
```

### `readonly` Properties

```ts
interface Point {
  readonly x: number
  readonly y: number
}

const p: Point = { x: 10, y: 20 }
p.x = 5  // ❌ Error

// Arrays and objects can still be mutated internally
const arr: ReadonlyArray<number> = [1, 2, 3]
arr.push(4)  // ❌ Error
arr[0] = 5   // ❌ Error
```

## Index Signatures

```ts
// When property names are not known ahead of time
interface StringDictionary {
  [key: string]: string
}

const dict: StringDictionary = {
  en: 'Hello',
  es: 'Hola',
}

// Mixed — known properties + index signature
interface Mixed {
  name: string
  [key: string]: string | number  // Must include all possible types
}
```

## Excess Property Checks

```ts
interface SquareConfig {
  color?: string
  width?: number
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return { color: config.color ?? 'red', area: (config.width ?? 10) ** 2 }
}

// ❌ Error — 'colour' is not in SquareConfig
createSquare({ colour: 'red', width: 100 })

// ✅ Workarounds:
createSquare({ width: 100, colour: 'red' } as SquareConfig)

const myConfig = { width: 100, colour: 'red' }
createSquare(myConfig)  // OK — excess check only on object literals
```

## Extending Types

```ts
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

// With type aliases (use intersection)
type Animal = { name: string }
type Bear = Animal & { honey: boolean }
```

### Interface Extension vs Intersection

```ts
interface Colorful { color: string }
interface Circle { radius: number }

// Interface extension (must be single interface or class)
interface ColorfulCircle extends Colorful, Circle {}

// Intersection (can combine any types)
type ColorfulCircle2 = Colorful & Circle

// Key difference with conflicts:
interface A { x: number }
interface B { x: string }
interface C extends A, B {}  // ❌ Error — conflicting x

type D = A & B  // ✅ OK — x is `never` (unsatisfiable)
```

## Generic Object Types

### `Array<T>` and `ReadonlyArray<T>`

```ts
let arr: Array<string> = ['a', 'b']
let readonlyArr: ReadonlyArray<string> = ['a', 'b']
```

### Tuple Types

```ts
// Fixed-length arrays with specific types
let tuple: [string, number] = ['hello', 42]

// Optional elements
let optionalTuple: [string, number?] = ['hello']

// Rest elements
let restTuple: [string, ...number[]] = ['hello', 1, 2, 3]

// readonly tuple
let readonlyTuple: readonly [string, number] = ['hello', 42]
readonlyTuple[0] = 'world'  // ❌ Error
```

## Structural Typing

TypeScript uses structural typing, not nominal typing:

```ts
interface Point { x: number; y: number }
interface Vector { x: number; y: number }

const p: Point = { x: 1, y: 2 }
const v: Vector = p  // ✅ OK — same structure
```

This is different from Java/C# where types with different names are incompatible.
