# Decorators (TypeScript)

TypeScript supports two decorator systems:
1. **Legacy decorators** (`experimentalDecorators`) — TypeScript's original implementation
2. **TC39 Stage 3 decorators** (TypeScript 5.0+) — upcoming JavaScript standard

## TC39 Stage 3 Decorators (Recommended)

Enabled automatically — no flag needed in modern TypeScript.

```ts
function logged<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  return function (this: This, ...args: Args): Return {
    console.log(`Calling ${String(context.name)} with ${args}`)
    return target.call(this, ...args)
  }
}

class Person {
  @logged
  greet(name: string) {
    return `Hello, ${name}`
  }
}
```

### Decorator Types (Stage 3)

| Decorator | Context Type | Applies To |
|-----------|-------------|------------|
| Method | `ClassMethodDecoratorContext` | Methods |
| Getter/Setter | `ClassGetterDecoratorContext` / `ClassSetterDecoratorContext` | Accessors |
| Field | `ClassFieldDecoratorContext` | Properties |
| Auto-accessor | `ClassAccessorDecoratorContext` | `accessor` fields |
| Class | `ClassDecoratorContext` | Classes |

### Auto-Accessors

```ts
class Person {
  accessor name: string = ''
}

// Equivalent to:
class Person {
  #name: string = ''

  get name() { return this.#name }
  set name(value: string) { this.#name = value }
}
```

## Legacy Decorators

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true  // Adds design:type, design:paramtypes, design:returntype
  }
}
```

### Class Decorator

```ts
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
}
```

### Method Decorator

```ts
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value
  }
}

class Greeter {
  @enumerable(false)
  greet() {
    return 'Hello'
  }
}
```

### Property Decorator

```ts
function readonly(target: any, propertyKey: string) {
  // No descriptor for property — must use Object.defineProperty in constructor
}

class Greeter {
  @readonly
  name: string
}
```

### Parameter Decorator

```ts
function required(target: any, propertyKey: string, parameterIndex: number) {
  // Used with metadata reflection
}

class Greeter {
  greet(@required name: string) {
    return `Hello, ${name}`
  }
}
```

## Metadata Reflection (Legacy)

```bash
npm install reflect-metadata
```

```ts
import 'reflect-metadata'

const formatMetadataKey = Symbol('format')

function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString)
}

function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey)
}

class Greeter {
  @format('Hello, %s')
  greeting: string
}
```

**`emitDecoratorMetadata: true`** automatically adds:
- `design:type` — property type
- `design:paramtypes` — constructor parameter types
- `design:returntype` — method return type

## Framework Patterns

### Dependency Injection

```ts
// Legacy decorator pattern (used by NestJS, TypeDI, etc.)
function Injectable(): ClassDecorator {
  return (target) => {
    // Register in container
  }
}

function Inject(token: string): ParameterDecorator {
  return (target, key, index) => {
    // Mark parameter for injection
  }
}

@Injectable()
class UserService {
  constructor(@Inject('DB') private db: Database) {}
}
```

## Migration from Legacy to Stage 3

| Legacy | Stage 3 |
|--------|---------|
| `@decorator` on method | Same, but signature changes |
| No context object | `context` object with metadata |
| `PropertyDescriptor` | Return replacement function directly |
| `emitDecoratorMetadata` | Manual metadata via `context.addInitializer` or external stores |

**TypeScript 5.0+ defaults to Stage 3**. Use `--experimentalDecorators` to force legacy mode.
