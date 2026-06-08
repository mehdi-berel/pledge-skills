# Migrating from JavaScript (TypeScript)

## Gradual Migration Strategy

### Step 1: Allow JS in TSConfig

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,   // Start without type-checking JS
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Step 2: Rename Files Incrementally

```bash
# Rename one file at a time
mv src/utils.js src/utils.ts
mv src/components/App.jsx src/components/App.tsx
```

### Step 3: Add Type Annotations to New `.ts` Files

Start with the simplest files first:
1. Pure utility functions (no DOM, no framework)
2. Data models / API types
3. Business logic
4. React/View components (last — most complex)

### Step 4: Enable `checkJs`

Once all critical files are `.ts`:

```json
{
  "compilerOptions": {
    "checkJs": true  // Type-check remaining .js files with JSDoc
  }
}
```

### Step 5: Enable Strict Mode

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Fix errors incrementally. You can enable strict flags one at a time:

```json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictFunctionTypes": true
  }
}
```

## JSDoc for TypeScript-Lite in JS

```js
// @ts-check  // Enables TypeScript checking in this file

/**
 * @param {string} name
 * @param {number} [age]
 * @returns {string}
 */
function greet(name, age) {
  return `Hello ${name}, age ${age ?? 'unknown'}`
}

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {boolean} [isAdmin]
 */

/** @type {User} */
const user = { id: '1', name: 'Alice' }
```

## Converting Patterns

### CommonJS to ES Modules

```js
// Before (CommonJS)
const express = require('express')
module.exports = { handler }

// After (ESM)
import express from 'express'
export { handler }
export default app
```

### Prototypes to Classes

```js
// Before
function Animal(name) {
  this.name = name
}
Animal.prototype.move = function() {
  console.log(`${this.name} moved`)
}

// After
class Animal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  move() {
    console.log(`${this.name} moved`)
  }
}
```

### Adding Types to Untyped Libraries

```ts
// types/untyped-lib.d.ts
declare module 'legacy-lib' {
  export function oldFunction(param: string): void
  export const config: { timeout: number }
}
```

## Suppressing Errors During Migration

### Use `@ts-ignore` sparingly

```ts
// @ts-ignore — I know this is wrong, will fix later
const bad = someUntypedLibrary.weirdApi()
```

### Prefer `@ts-expect-error`

```ts
// @ts-expect-error — This is expected to error, tracked in issue #123
const result = brokenFunction()
```

`@ts-expect-error` will error if the next line does NOT produce a type error — useful for ensuring issues are actually fixed.

## Adding Types to Existing JS Projects

### 1. Install TypeScript

```bash
npm install -D typescript @types/node
npx tsc --init
```

### 2. Create Entry Type Files

```ts
// src/types/index.ts
export interface User {
  id: string
  name: string
  email: string
}

export type Status = 'active' | 'inactive' | 'pending'
```

### 3. Type Third-Party Libraries

```bash
npm install -D @types/express @types/lodash @types/react
```

### 4. Generate Types from Runtime

```bash
npx tsx scripts/generate-types.ts
```

## Common Migration Issues

| Issue | Solution |
|-------|----------|
| `Cannot find module` | Add `.d.ts` declaration or install `@types/...` |
| `Could not find a declaration file` | `npm install -D @types/package` or write `.d.ts` |
| `Element implicitly has 'any'` | Add index signature or type annotation |
| `Object is possibly 'null'` | Add null check or use `!` (non-null assertion) |
| `No overload matches` | Check function signatures, add type guards |

## Migration Checklist

- [ ] Install TypeScript and create `tsconfig.json`
- [ ] Enable `allowJs: true`
- [ ] Rename one file to `.ts`/`.tsx`
- [ ] Add type annotations for that file's exports
- [ ] Repeat for all files
- [ ] Enable `checkJs: true`
- [ ] Add JSDoc to remaining `.js` files or convert them
- [ ] Enable `strict: true`
- [ ] Fix all strict errors
- [ ] Set `noEmit: true` if using a bundler (Vite, Next.js, etc.)
- [ ] Run tests to verify runtime behavior unchanged
