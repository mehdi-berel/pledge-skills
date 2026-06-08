# TSConfig Reference (TypeScript)

## Root Fields

```json
{
  "compilerOptions": { /* ... */ },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"],
  "extends": "./base.json",     // Inherit from another tsconfig
  "files": ["file1.ts"],        // Explicit file list (no glob)
  "references": [{ "path": "../shared" }]  // Project references
}
```

## Essential Compiler Options

### Target & Module

| Option | Recommended | Description |
|--------|-------------|-------------|
| `target` | `"ES2022"` | JS language features to emit |
| `module` | `"ESNext"` | Module system (CommonJS, ESNext, NodeNext) |
| `moduleResolution` | `"bundler"` | How modules are resolved (classic, node, bundler) |
| `lib` | `["ES2022", "DOM"]` | Built-in API declarations |
| `jsx` | `"react-jsx"` | JSX transform mode |

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx"
  }
}
```

### Strictness Flags

Enable **all** strict checks with `strict: true`:

```json
{
  "compilerOptions": {
    "strict": true
    // Equivalent to enabling ALL of the below:
    // "noImplicitAny": true,
    // "strictNullChecks": true,
    // "strictFunctionTypes": true,
    // "strictBindCallApply": true,
    // "strictPropertyInitialization": true,
    // "noImplicitThis": true,
    // "alwaysStrict": true,
    // "useUnknownInCatchVariables": true,
  }
}
```

### Individual Strict Flags

| Flag | What It Does |
|------|--------------|
| `noImplicitAny` | Error when TypeScript can't infer a type and falls back to `any` |
| `strictNullChecks` | `null` and `undefined` are separate types; must handle them |
| `strictFunctionTypes` | Function parameters are checked contravariantly |
| `strictPropertyInitialization` | Class properties must be initialized in constructor |
| `noImplicitThis` | Error when `this` is implicitly `any` |
| `useUnknownInCatchVariables` | Catch clause variables are `unknown`, not `any` |

### Output & Source Maps

```json
{
  "compilerOptions": {
    "outDir": "./dist",            // Output directory
    "rootDir": "./src",            // Root of source tree (preserves structure)
    "sourceMap": true,             // Generate .js.map files
    "declaration": true,           // Generate .d.ts files
    "declarationMap": true,        // Generate .d.ts.map files
    "removeComments": true,        // Strip comments from output
    "noEmit": true,                // Type-check only (used with bundlers)
    "emitDeclarationOnly": true,   // Only emit .d.ts files
  }
}
```

### Interop

```json
{
  "compilerOptions": {
    "esModuleInterop": true,              // Enable __importStar/__importDefault helpers
    "allowSyntheticDefaultImports": true, // Allow `import x from 'y'` even if no default
    "forceConsistentCasingInFileNames": true,  // Error on case-mismatched imports
    "isolatedModules": true,              // Each file must be independently transpilable
    "skipLibCheck": true,                 // Skip type checking of declaration files (faster)
    "resolveJsonModule": true,            // Allow importing .json files
    "allowJs": true,                      // Allow JavaScript files to be compiled
    "checkJs": true,                      // Type-check JavaScript files
  }
}
```

### Decorators

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,         // Legacy — adds design-time type metadata
    "lib": ["ES2022", "DOM", "ESNext.Decorators"]
  }
}
```

## Module Resolution Options

```json
{
  "compilerOptions": {
    "baseUrl": ".",                      // Base directory for non-relative imports
    "paths": {
      "@/*": ["./src/*"],               // Path mapping
      "@shared/*": ["../shared/src/*"]
    },
    "rootDirs": ["./src", "./generated"], // Treat as one root
    "typeRoots": ["./node_modules/@types", "./types"],
    "types": ["node", "jest"],            // Only include specific @types packages
  }
}
```

## Watch & Build

```json
{
  "compilerOptions": {
    "watch": true,
    "preserveWatchOutput": true,   // Don't clear screen on recompile
  }
}
```

## Project References (Monorepos)

```json
// tsconfig.json (root)
{
  "files": [],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/app" }
  ]
}

// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "composite": true,          // Required for referenced projects
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

Build with `tsc --build` (or `tsc -b`) to use project references.

## Recommended TSConfig for Modern Projects

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Checking Your Config

```bash
npx tsc --showConfig           # Display effective config
npx tsc --noEmit               # Type-check without emitting
npx tsc --build --verbose      # Build with project references, verbose
```
