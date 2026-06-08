# Debugging and Memory Optimization (Next.js 16)

## Development Setup

### IDE Plugin (TypeScript)

Next.js includes a custom TypeScript plugin for advanced type-checking and auto-completion. Enable it in VS Code:

1. Open the command palette (`Ctrl/⌘ + Shift + P`)
2. Search for **"TypeScript: Select TypeScript Version"**
3. Select **"Use Workspace Version"**

This enables Next.js-specific type hints and auto-completion.

### Module Path Aliases

Configure `paths` and `baseUrl` in `tsconfig.json` or `jsconfig.json` for cleaner imports:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/styles/*": ["styles/*"]
    }
  }
}
```

```tsx
// Before
import { Button } from '../../../components/button'

// After
import { Button } from '@/components/button'
```

**Paths are relative to `baseUrl`.** The `@/` prefix is a convention, not a requirement.

## Debugging

### VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "started server on .+:([\\d]+)",
        "uriFormat": "http://localhost:%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

### Browser DevTools — Client-Side

1. Run `next dev`
2. Open Chrome DevTools (Ctrl+Shift+J / ⌥+⌘+I)
3. Go to **Sources** tab
4. Press Ctrl+P / ⌘+P to search files
5. Set breakpoints on your source code

Source files appear under `webpack://_N_E/./`.

### Browser DevTools — Server-Side

Debug server code with the `--inspect` flag:

```bash
# Basic
npm run dev -- --inspect

# For Docker/remote access
npm run dev -- --inspect=0.0.0.0

# Break before any user code
NODE_OPTIONS=--inspect-brk next dev
```

Then:
1. Chrome: Visit `chrome://inspect` → click **inspect** on your app
2. Firefox: Visit `about:debugging` → find app → click **Inspect**
3. Go to **Sources** tab
4. Source files appear under `webpack://{app-name}/./`

### React Developer Tools

Install the browser extension to:
- Inspect React component tree
- Edit props and state live
- Identify performance problems
- Profile component renders

### Inspect Server Errors

When a server error occurs, Next.js displays a **Node.js icon** in the error overlay. Click it to copy the DevTools URL to your clipboard. Open it in a new tab to inspect the server process directly.

### JetBrains WebStorm

WebStorm has built-in debugger support. Create a **Node.js** run configuration pointing to `node_modules/next/dist/bin/next` with arguments `dev`.

## Memory Optimization

### Reduce Dependencies

Use the Bundle Analyzer to identify large dependencies:

```bash
npx next build --analyze
```

Remove unused packages and replace heavy ones with lighter alternatives.

### Webpack Memory Optimizations

```ts
// next.config.ts
const nextConfig = {
  experimental: {
    webpackMemoryOptimizations: true,
  },
}
```

Reduces max memory usage but may slightly increase compilation time.

### Debug Memory Usage During Build

```bash
npx next build --experimental-debug-memory-usage
```

Prints heap usage and GC stats throughout the build. Automatically takes heap snapshots when memory nears the limit.

### Record a Heap Profile

```bash
node --heap-prof node_modules/next/dist/bin/next build
```

Creates a `.heapprofile` file. Load it in Chrome DevTools → Memory tab → Load Profile to visualize.

### Analyze Heap Snapshots

```bash
NODE_OPTIONS=--inspect next build
```

Then connect Chrome DevTools to the inspector port. Send `SIGUSR2` to take a snapshot at any point:

```bash
kill -USR2 <pid>
```

Snapshot saved to project root. Analyze in Chrome DevTools Memory tab.

### Webpack Build Worker

Runs Webpack in a separate Node.js worker, reducing main process memory:

```ts
// next.config.ts
const nextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
}
```

Enabled by default in v14.1.0+ if no custom webpack config. May not be compatible with all custom webpack plugins.

### Other Memory Optimizations

```ts
// next.config.ts
const nextConfig = {
  // Disable webpack cache (saves disk, may slow rebuilds)
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false
    }
    return config
  },

  // Disable static analysis (faster builds, less memory)
  experimental: {
    disableStaticImages: true,
  },

  // Disable source maps in production
  productionBrowserSourceMaps: false,
}
```

### Windows Defender Warning

Windows Defender file scanning can drastically slow down `next dev` Fast Refresh. Add your project directory to Windows Defender exclusions.

## Common Debugging Scenarios

### Server Actions Not Working

1. Check the action is in a `'use server'` file or function
2. Verify the file path is correct (can't import from outside app/)
3. Check browser Network tab for the POST request
4. Look for CORS issues if calling from external origin
5. Ensure auth checks aren't silently failing

### Hydration Mismatch

```
Warning: Text content does not match server-rendered HTML
```

**Causes:**
- Using `Date.now()`, `Math.random()`, `new Date()` without `connection()`
- Different content on server vs client (e.g., locale differences)
- Browser-only APIs in Server Components

**Fix:**
```tsx
// ❌ Causes mismatch
export default function Page() {
  return <div>{new Date().toLocaleString()}</div>
}

// ✅ Use connection() for request-time data
import { connection } from 'next/server'
export default async function Page() {
  await connection()
  return <div>{new Date().toLocaleString()}</div>
}
```

### Caching Issues in Development

```bash
# Clear Next.js cache
rm -rf .next

# Or use the restart flag
next dev --experimental-https
```

### Turbopack Issues

```bash
# Fall back to webpack for debugging
next dev --webpack

# Or in next.config.ts
const nextConfig = {
  turbopack: false,
}
```
