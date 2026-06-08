# Classes (TypeScript)

## Class Members

### Fields

```ts
class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

// With default values
class Point2 {
  x = 0
  y = 0
}

const pt = new Point2()
console.log(pt.x)  // 0
```

### `readonly`

```ts
class Greeter {
  readonly name: string = 'world'

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName
    }
  }

  err() {
    this.name = 'not ok'  // ❌ Error
  }
}
```

### Constructors

```ts
class Point {
  // Parameter properties — declare and assign in one line
  constructor(
    public x: number,
    public y: number,
    private label?: string,
  ) {}
}

const p = new Point(10, 20, 'A')
```

### Getters / Setters

```ts
class Thing {
  private _size = 0

  get size(): number {
    return this._size
  }

  set size(value: string | number | boolean) {
    const num = Number(value)
    if (!Number.isFinite(num)) {
      this._size = 0
      return
    }
    this._size = num
  }
}
```

## Class Heritage

### `implements`

```ts
interface Pingable {
  ping(): void
}

class Sonar implements Pingable {
  ping() {
    console.log('ping!')
  }
}
```

### `extends`

```ts
class Animal {
  name = 'animal'
  move() {
    console.log('Moving along!')
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log('woof!')
    }
  }
}
```

**Overriding methods:**

```ts
class Base {
  greet() {
    console.log('Hello!')
  }
}

class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet()
    } else {
      console.log(`Hello, ${name}`)
    }
  }
}
```

## Member Visibility

```ts
class MyClass {
  public name: string       // Default — accessible everywhere
  private secret: string    // Only within this class
  protected family: string  // Within this class and subclasses

  constructor() {
    this.name = 'public'
    this.secret = 'private'
    this.family = 'protected'
  }
}
```

**JavaScript private fields** (`#field`) — runtime private, not just TypeScript:

```ts
class Safe {
  #reallyPrivate = 0

  getValue() {
    return this.#reallyPrivate  // ✅
  }
}

const s = new Safe()
s.#reallyPrivate  // ❌ SyntaxError at runtime
```

## Static Members

```ts
class MyClass {
  static x = 0
  static printX() {
    console.log(MyClass.x)
  }
}

MyClass.printX()  // 0
```

### Static Blocks

```ts
class Foo {
  static #count = 0

  static {
    try {
      // initialization logic
      Foo.#count = JSON.parse(localStorage.getItem('count') ?? '0')
    } catch {
      Foo.#count = 0
    }
  }
}
```

## Generic Classes

```ts
class Box<T> {
  contents: T

  constructor(value: T) {
    this.contents = value
  }
}

const b = new Box('hello!')  // Box<string>
```

**Static members cannot reference class type parameters:**

```ts
class Box<T> {
  static defaultValue: T  // ❌ Error — statics share one type
}
```

## `this` Types

```ts
class Box {
  contents: string = ''

  set(value: string): this {
    this.contents = value
    return this
  }
}

class ClearableBox extends Box {
  clear() {
    this.contents = ''
  }
}

const a = new ClearableBox()
const b = a.set('hello')  // b is ClearableBox, not Box
```

### `this`-based Type Guards

```ts
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep
  }
  isDirectory(): this is Directory {
    return this instanceof Directory
  }
}
```

## Abstract Classes

```ts
abstract class Animal {
  abstract makeSound(): void

  move(): void {
    console.log('roaming the earth...')
  }
}

class Dog extends Animal {
  makeSound() {
    console.log('woof!')
  }
}

// new Animal()  // ❌ Error — cannot instantiate abstract class
```

## Relationships Between Classes

```ts
class Point1 {
  x = 0
  y = 0
}

class Point2 {
  x = 0
  y = 0
}

// Structural typing — identical structure means compatibility
const p: Point1 = new Point2()  // ✅ OK
```
