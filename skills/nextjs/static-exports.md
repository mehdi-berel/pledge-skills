# Static Exports and Deployment (Next.js 16)

## Static Export

Generate a fully static site with `output: 'export'`:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  // Optional: Change the output directory (default is 'out')
  distDir: 'dist',
}

export default nextConfig
```

Then run `next build`. The `out` (or `dist`) folder contains static HTML files.

**Supported features:**
- Server Components (rendered to static HTML at build time)
- Client Components
- Image Optimization (with `unoptimized: true` or configure loader)
- Route Handlers (that return static responses)
- Browser APIs

**Unsupported features:**
- Server Actions (no server to run them)
- `after()` (no server to run callbacks)
- Dynamic routes without `generateStaticParams`
- `cookies()`, `headers()`, `draftMode()` (no request context)
- `revalidateTag`, `updateTag`, `refresh` (no server cache)
- Database queries at request time

## Image Optimization with Static Export

```ts
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
}
```

Or use a custom loader with a CDN:

```ts
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './my-loader.ts',
  },
}
```

## Self-Hosting with Docker

Use `output: 'standalone'` for Docker:

```ts
const nextConfig: NextConfig = {
  output: 'standalone',
}
```

This generates:
- `.next/standalone/server.js` — minimal server
- `.next/standalone/.next/static` — static assets

**Dockerfile example:**

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "server.js"]
```

## Multi-Server Deployments

For multiple Next.js instances, configure:

1. **Server Functions encryption key**: All instances must share the same key for Server Functions to work:
   ```bash
   NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=your-secret-key
   ```

2. **Shared cache**: Use a custom cache handler for multi-instance ISR:
   ```ts
   const nextConfig: NextConfig = {
     cacheHandler: require.resolve('./cache-handler.js'),
   }
   ```

3. **Deployment identifier**: Ensure all instances use the same deployment ID:
   ```bash
   NEXT_DEPLOYMENT_ID=unique-id
   ```

## Production Checklist

Before deploying:

- [ ] **Set up environment variables** for production (`NEXT_PUBLIC_*` for client, regular for server)
- [ ] **Enable Cache Components** (`cacheComponents: true`) for caching
- [ ] **Configure image remotePatterns** for external images
- [ ] **Set up proxy.ts** for redirects, rewrites, CSP
- [ ] **Add error.tsx boundaries** at critical routes
- [ ] **Add not-found.tsx** for 404 handling
- [ ] **Verify auth checks** in all Server Actions and DAL
- [ ] **Set up CSP** with nonces or SRI
- [ ] **Configure caching headers** via proxy.ts or `next.config.ts`
- [ ] **Test with `next build`** (catches issues `next dev` doesn't)
- [ ] **Run Lighthouse** for performance and accessibility
- [ ] **Set up analytics** (Vercel Analytics, Speed Insights)
- [ ] **Configure OpenTelemetry** for observability (optional)
- [ ] **Set up error monitoring** (Sentry, etc.)

## Deploying to Platforms

**Vercel:** Zero-config deployment. All features work out of the box.

**AWS/GCP/Azure:** Use `output: 'standalone'` with Docker or serverless functions.

**Static hosting (Netlify, Cloudflare Pages):** Use `output: 'export'`.

**Node.js server:** Run `next build` then `next start`.
