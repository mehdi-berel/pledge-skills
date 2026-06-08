# Image and Font Optimization (Next.js 16)

## Image Optimization

Always use `next/image` over raw `<img>`. Benefits:
- Size optimization: Auto WebP/AVIF for each device
- Visual stability: Prevents layout shift automatically
- Faster loads: Native lazy loading with optional blur-up placeholders
- Asset flexibility: On-demand resizing for remote images

### Local Images

**Static import** (recommended): auto width, height, blur placeholder:

```tsx
import Image from 'next/image'
import ProfileImage from './profile.png'

export default function Page() {
  return (
    <Image
      src={ProfileImage}
      alt="Picture"
      placeholder="blur"
      priority // Above the fold — load immediately
    />
  )
}
```

**Dynamic import** (Server Component, filename not known at build time):

```tsx
async function PostImage({ imageFilename }: { imageFilename: string }) {
  const { default: image } = await import(
    `../content/blog/images/${imageFilename}`
  )
  return <Image src={image} alt="" />
}
```

The path must include a static prefix. All files matching the prefix are bundled, so be as specific as possible.

### Remote Images

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://example.com/photo.jpg"
      alt="Photo"
      width={500}
      height={300}
      // Must provide width/height manually for remote images
    />
  )
}
```

Configure `images.remotePatterns` in `next.config.ts`:

```ts
const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/photos/**',
        search: '',
      },
    ],
  },
}
```

### Key Image Properties

| Prop | Purpose |
|------|---------|
| `fill` | Makes image fill parent element (parent must be `position: relative`) |
| `priority` | Preloads image. Use for above-the-fold (LCP) images |
| `placeholder="blur"` | Shows blur-up placeholder while loading |
| `sizes` | Defines responsive image sizes for `srcset` |
| `quality` | 1-100. Default is from `images.qualities` config |
| `loading` | `"lazy"` (default) or `"eager"` |
| `unoptimized` | `true` to skip optimization (useful for authenticated images) |
| `overrideSrc` | Override the src for SEO while keeping the optimized image |
| `decoding` | `"async"` (default), `"sync"`, `"auto"` |
| `style` | CSS styles applied to the image |
| `onLoadingComplete` | Callback when image finishes loading |
| `onLoad` | Native onLoad event |
| `onError` | Native onError event |
| `blurDataURL` | Base64 blur placeholder for remote images |

### getImageProps

Use `getImageProps` to get the raw `<img>` props without rendering `<Image>`. Useful for wrapping with custom elements or using with `<canvas>`:

```tsx
import { getImageProps } from 'next/image'

function ImageWithCaption() {
  const { props } = getImageProps({
    src: 'https://example.com/image.jpg',
    alt: 'Mountain view',
    width: 1200,
    height: 800,
  })

  return (
    <figure>
      <img {...props} />
      <figcaption>A scenic mountain view</figcaption>
    </figure>
  )
}
```

**Note:** `getImageProps` doesn't support the `placeholder` prop (placeholder won't be removed).

### Image Configuration (next.config.ts)

```ts
const nextConfig = {
  images: {
    // Remote image sources (required for external images)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/photos/**',
        search: '',        // Restrict query strings (e.g., '?v=2')
      },
      // Wildcard subdomain
      {
        protocol: 'https',
        hostname: '**.cdn.example.com',
      },
    ],

    // Local image paths to optimize (restricts to specific paths)
    localPatterns: [
      {
        pathname: '/assets/images/**',
        search: '',
      },
    ],

    // Custom image loader (e.g., Cloudinary, Imgix)
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',

    // Change the image optimization API path
    path: '/_next/image',

    // Device width breakpoints for srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image widths for images with sizes prop (< full screen)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Allowed quality values (required in Next.js 16+)
    qualities: [25, 50, 75, 100],

    // Output formats
    formats: ['image/webp', 'image/avif'],
  },
}
```

#### Custom Image Loader

```ts
// lib/image-loader.ts
'use client'

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  return `https://res.cloudinary.com/demo/image/upload/w_${width},q_${quality || 75}/${src}`
}
```

### Known Browser Bugs

- **Safari 15–16.3:** Displays gray border while loading lazy images.
  - Fix: `img[loading="lazy"] { clip-path: inset(0.6px) }`
  - Or use `loading="eager"` for above-the-fold images
- **Firefox 67+:** Displays white background while loading.
  - Fix: Enable AVIF formats or use `placeholder="blur"`
- **Safari < 15.4:** Lazy loading falls back to eager loading
- **Safari < 12:** Blur placeholder falls back to empty
- **Safari < 15:** `width: auto` / `height: auto` can cause layout shift

## Font Optimization

Use `next/font/google` or `next/font/local` for self-hosted fonts with zero layout shift:

### Google Fonts

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

**Prefer variable fonts** for best performance (single file, all weights). For non-variable fonts, specify weight:

```tsx
import { Roboto } from 'next/font/google'
const roboto = Roboto({ weight: '400', subsets: ['latin'] })
```

### Local Fonts

```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: [
    { path: './fonts/Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Bold.woff2', weight: '700', style: 'normal' },
  ],
})
```

Fonts are scoped to the component they're used in. To apply globally, add to the Root Layout.

### Font Options Reference

| Option | Description |
|--------|-------------|
| `src` | Path to font file(s). String for single file, array `{path, weight, style}` for multiple |
| `weight` | Font weight. String (single), string range (`'100 900'` for variable), or array |
| `style` | Font style: `'normal'`, `'italic'`, or array `['normal', 'italic']` |
| `subsets` | Array of subsets to preload: `['latin', 'latin-ext']` |
| `axes` | Extra variable font axes (e.g., `['slnt']` for Inter) |
| `display` | Font display strategy: `'auto'`, `'block'`, `'swap'` (default), `'fallback'`, `'optional'` |
| `preload` | `true` (default) — injects preload link in `<head>` |
| `fallback` | Array of fallback fonts: `['system-ui', 'arial']` |
| `adjustFontFallback` | Auto fallback to reduce CLS. `true` for Google fonts (default), `'Arial'` / `'Times New Roman'` / `false` for local |
| `variable` | CSS variable name: `'--font-inter'`. Use with `className={inter.variable}` |
| `declarations` | Array of extra `@font-face` declarations |

### Multiple Fonts

```tsx
// app/fonts.ts
import { Inter, Roboto_Mono } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'], display: 'swap' })
export const roboto_mono = Roboto_Mono({ subsets: ['latin'], display: 'swap' })
```

```tsx
// app/layout.tsx
import { inter } from './fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// app/page.tsx
import { roboto_mono } from './fonts'

export default function Page() {
  return <code className={roboto_mono.className}>const x = 1</code>
}
```

### Multiple Fonts with CSS Variables

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

```css
/* globals.css */
body {
  font-family: var(--font-inter), system-ui, sans-serif;
}
code, pre {
  font-family: var(--font-roboto-mono), monospace;
}
```

### Tailwind CSS Integration

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```
