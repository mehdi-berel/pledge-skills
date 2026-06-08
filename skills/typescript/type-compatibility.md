# Type Compatibility (TypeScript)

## Structural Typing

TypeScript uses **structural typing**, not nominal typing. Types are compatible based on their shape, not their name or declaration origin.

```ts
interface Point2D {
  x: number
  y: number
}

interface Point3D {
  x: number
  y: number
  z: number
}

const p2d: Point2D = { x: 0, y: 0 }
const p3d: Point3D = { x: 0, y: 0, z: 0 }

const p: Point2D = p3d  // ✅ OK — Point3D has at least x and y
```

## The Golden Rule

**`x` is assignable to `y` if `x` has at least the same members as `y`.**

## Function Compatibility

### Parameter Bivariance (with strictFunctionTypes off)

```ts
let x = (a: number) => 0
let y = (b: number, s: string) => 0

y = x  // ✅ OK — fewer params is fine
x = y  // ❌ Error with strictFunctionTypes — more params not allowed
```

### Return type covariance

```ts
let x = () => ({ name: 'Alice' })
let y = () => ({ name: 'Alice', location: 'Seattle' })

x = y  // ✅ OK — return type has more properties
y = x  // ❌ Error — missing location
```

## Enum Compatibility

```ts
enum Status { Ready, Waiting }
enum Color { Red, Blue, Green }

let status = Status.Ready
status = Color.Green  // ❌ Error — enums are not compatible even with same structure
```

Numbers and enums are partially compatible:

```ts
let status: Status = 1  // ✅ OK
```

## Class Compatibility

Classes are compared structurally, except for `private` and `protected` members:

```ts
class Animal {
  feet: number
  constructor(feet: number) {
    this.feet = feet
  }
}

class Size {
  feet: number
  constructor(feet: number) {
    this.feet = feet
  }
}

let a: Animal = new Size(4)  // ✅ OK — same structure
```

### `private`/`protected` members

```ts
class Animal {
  private name: string
  constructor(name: string) {
    this.name = name
  }
}

class Rhino {
  private name: string
  constructor() {
    this.name = 'rhino'
  }
}

class Employee {
  private name: string
  constructor() {
    this.name = 'employee'
  }
}

let animal: Animal = new Rhino()   // ✅ OK — same class hierarchy or same private source
let animal2: Animal = new Employee() // ❌ Error — different private source
```

## Generics

Empty generics are structurally equivalent:

```ts
interface Empty<T> {}

let x: Empty<number> = {}
let y: Empty<string> = {}

x = y  // ✅ OK — structure is the same (empty)
```

With members, they differ:

```ts
interface NotEmpty<T> {
  data: T
}

let x: NotEmpty<number> = { data: 1 }
let y: NotEmpty<string> = { data: '' }

x = y  // ❌ Error — data types differ
```

## Soundness

TypeScript's type system is **intentionally unsound** in some areas for practical convenience:

### Array covariance

```ts
let dogs: Dog[] = [new Dog()]
let animals: Animal[] = dogs  // ✅ OK
animals.push(new Cat())        // Runtime error but compiles
```

### Nullability (without strictNullChecks)

```ts
let s: string = null  // Compiles with strictNullChecks: false
```

## Variance Annotations (TypeScript 4.7+)

Explicitly control variance:

```ts
interface Animal { name: string }
interface Dog extends Animal { breed: string }

interface Producer<out T> {   // Covariant — produces T
  make(): T
}

interface Consumer<in T> {    // Contravariant — consumes T
  consume(arg: T): void
}

interface ReadWrite<T> {      // Invariant — reads and writes
  value: T
}
```

| Annotation | Direction | Example |
|------------|-----------|---------|
| `out T` | Covariant | `T` only in return positions |
| `in T` | Contravariant | `T` only in parameter positions |
| none | Invariant | `T` in both positions |
