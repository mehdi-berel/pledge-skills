# Declaration Files (TypeScript)

## `.d.ts` Files

TypeScript declaration files describe the types of JavaScript code. They contain **only types** — no runtime code.

```ts
// math.d.ts
declare function add(x: number, y: number): number
declare const PI: number

// math.js (runtime)
function add(x, y) { return x + y }
const PI = 3.14
```

## Ambient Declarations

```ts
// globals.d.ts

declare const API_URL: string  // Variable provided at runtime
declare function analytics(event: string): void

declare namespace MyLib {
  export function doSomething(): void
}

// Usage
analytics('page_view')
MyLib.doSomething()
```

## Declaring Modules

### For untyped npm packages

```ts
// some-untyped-lib.d.ts
declare module 'some-untyped-lib' {
  export function doSomething(): void
  export const version: string
}
```

### Wildcard module declarations

```ts
// For importing non-JS assets
declare module '*.png' {
  const value: string
  export default value
}

declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
```

### Module augmentation

```ts
// Extend existing module
declare module 'express' {
  export interface Request {
    user?: { id: string; name: string }
  }
}
```

## Writing Declaration Files for Libraries

```ts
// types/my-lib.d.ts

// Declare the module
export interface Config {
  timeout: number
  retries?: number
}

export class Client {
  constructor(config: Config)
  connect(): Promise<void>
  disconnect(): void
}

export function createClient(config: Config): Client
export const VERSION: string
```

### With default export

```ts
// types/my-lib.d.ts

export interface Options {
  debug?: boolean
}

export default function init(options: Options): void
```

## Generating Declaration Files

```json
{
  "compilerOptions": {
    "declaration": true,      // Generate .d.ts
    "declarationMap": true,  // Generate .d.ts.map (for go-to-definition)
    "emitDeclarationOnly": true  // Only emit .d.ts, not .js
  }
}
```

## Triple-Slash Directives

```ts
/// <reference types="node" />       // Include @types/node
/// <reference path="./custom.d.ts" /> // Include relative .d.ts
/// <reference lib="dom" />           // Include built-in lib

// In .js files with JSDoc checking
/// <reference types="./types.d.ts" />
```

## Publishing Type Declarations

### Option 1: Bundled with package

```json
{
  "name": "my-lib",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",    // Point to declaration file
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" },
      "require": { "types": "./dist/index.d.ts", "default": "./dist/index.js" }
    }
  }
}
```

### Option 2: DefinitelyTyped (@types)

For libraries without bundled types, publish to `@types/package-name`:

```bash
# Types are at:
# node_modules/@types/some-lib/index.d.ts
```

## Declaration File Patterns

| Pattern | Use Case |
|---------|----------|
| `types/index.d.ts` | Central types for a project |
| `src/**/*.d.ts` | Ambient declarations per module |
| `global.d.ts` | Global variables, window extensions |
| `vite-env.d.ts`, `next-env.d.ts` | Framework-specific env types |

## Best Practices

1. **Don't export `any`** — defeats the purpose
2. **Use `unknown` for flexible inputs** — force consumers to narrow
3. **Prefer interfaces for object shapes** — declaration merging friendly
4. **Document parameter types** — especially for callback signatures
5. **Use JSDoc for simple cases** — `@ts-check` in .js files
