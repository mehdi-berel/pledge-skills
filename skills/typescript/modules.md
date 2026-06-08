# Modules (TypeScript)

## ES Module Syntax

```ts
// math.ts
export function add(x: number, y: number): number {
  return x + y
}

export const PI = 3.14

export default class Calculator {
  // ...
}

// main.ts
import { add, PI } from './math.js'
import Calculator from './math.js'
import * as math from './math.js'
```

**Note:** With `"moduleResolution": "bundler"` or `"node16"`/`"nodenext"`, use `.js` extensions in imports even for `.ts` files.

## Additional Import Syntax

```ts
// Rename
import { add as sum } from './math.js'

// Side-effect import
import './side-effects.js'

// Import + export (re-export)
export { add, PI } from './math.js'
export * as math from './math.js'
export { default } from './math.js'

// Type-only import
import type { Point } from './types.js'
import { type Point } from './types.js'  // TypeScript 5.0+ inline type imports

// Dynamic import
async function load() {
  const { add } = await import('./math.js')
}
```

## CommonJS Syntax

```ts
// math.ts (compile target: commonjs)
function add(x: number, y: number) {
  return x + y
}
exports.add = add

// main.ts
import { add } from './math.js'

// Or CommonJS require
import fs = require('fs')
const fs2 = require('fs')
```

## CommonJS and ES Modules Interop

```ts
// For packages that only export CommonJS
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const pkg = require('some-commonjs-package')
```

## TypeScript's Module Resolution

| Strategy | Behavior |
|----------|----------|
| `classic` | Relative to importing file |
| `node` | Node.js-style (folders, `node_modules`) |
| `node16`/`nodenext` | Full Node.js ESM support, requires `.js` extensions |
| `bundler` | Bundler-style, modern, no need for `.js` extensions |

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

## TypeScript Namespaces (Internal Modules)

```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean
  }

  export const lettersRegexp = /^[A-Za-z]+$/

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s)
    }
  }
}

// Usage
const validator = new Validation.LettersOnlyValidator()
```

**Recommendation:** Prefer ES modules (`import`/`export`) over namespaces for new code.

## Ambient Modules

```ts
// types.d.ts
declare module 'some-untyped-lib' {
  export function doSomething(): void
}
```

## Module Augmentation

```ts
// Extend existing module declarations
import { Observable } from 'rxjs'

declare module 'rxjs' {
  interface Observable<T> {
    toPromise(): Promise<T>
  }
}
```
