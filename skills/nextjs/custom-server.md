# Custom Server (Next.js 16)

## When to Use

**Avoid custom servers.** Next.js includes its own server with `next start`. Use a custom server only when the integrated router can't meet your requirements.

**Trade-offs:**
- Removes Automatic Static Optimization
- Loses some performance optimizations
- `output: 'standalone'` does NOT trace custom server files

## Basic Custom Server

```ts
// server.ts
import { createServer } from 'http'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
```

```json
// package.json
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

## Custom Routing Patterns

```ts
// server.ts
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
      app.render(req, res, '/a', query)
    } else if (pathname === '/b') {
      app.render(req, res, '/b', query)
    } else {
      handle(req, res)
    }
  }).listen(3000)
})
```

## Options

```ts
const app = next({
  dev: false,           // false for production
  dir: '.',             // Location of Next.js project
  quiet: false,         // Suppress console output
  hostname: 'localhost', // Server hostname
  port: 3000,           // Server port
  httpServer: server,   // External HTTP server to use
  turbopack: true,      // Use Turbopack in dev
  webpack: false,       // Use webpack instead of Turbopack
})
```

## With Express

```ts
// server.ts
import express from 'express'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})
```

## With Existing Backend

If you have an existing backend, you don't need a custom server. Use Next.js as the frontend and proxy API requests:

```ts
// next.config.ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ]
  },
}
```

This preserves all Next.js optimizations while using an external backend.

## Important Notes

- `server.js` does NOT run through the Next.js Compiler or bundling
- Use Node.js-compatible syntax
- Custom server disables some deployment platform optimizations
- Prefer `proxy.ts` + `next.config.ts` rewrites over custom server
