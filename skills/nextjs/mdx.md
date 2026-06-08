# MDX (Markdown + JSX) in Next.js

## Setup

Install dependencies:

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

Configure `next.config.ts`:

```ts
import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  // Add markdown plugins here
})

export default withMDX(nextConfig)
```

## mdx-components.tsx

Required at project root. Defines global MDX components:

```tsx
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'

const components: MDXComponents = {
  // Override default HTML elements with custom components
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold text-gray-900">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold mt-8">{children}</h2>
  ),
  img: (props) => (
    <Image
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      {...(props as ImageProps)}
    />
  ),
  a: ({ href, children }) => (
    <Link href={href || ''} className="text-blue-600 hover:underline">
      {children}
    </Link>
  ),
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
```

## Using MDX Pages

### File-based routing

Create `.mdx` files directly in `app/`:

```
app/
  blog/
    my-post/
      page.mdx
```

```mdx
import { MyComponent } from '@/components/MyComponent'

# Welcome to my MDX page

This is **bold** and _italic_ text.

- One
- Two
- Three

<MyComponent />
```

### Importing MDX files

```tsx
// app/blog/page.tsx
import Welcome from '@/content/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

### Dynamic imports

```tsx
// app/blog/[slug]/page.tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/${slug}.mdx`)
  return <Post />
}

export function generateStaticParams() {
  return [{ slug: 'welcome' }, { slug: 'about' }]
}
```

## Local Component Overrides

Override global components per-page:

```tsx
import Welcome from '@/content/welcome.mdx'

function CustomH1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-blue-500 text-5xl">{children}</h1>
}

export default function Page() {
  return <Welcome components={{ h1: CustomH1 }} />
}
```

## Shared Layout for MDX

```tsx
// app/mdx-layout.tsx
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose prose-lg max-w-2xl mx-auto">
      {children}
    </article>
  )
}
```

## Frontmatter (Metadata in MDX)

Use exports for metadata (frontmatter not built-in):

```mdx
export const metadata = {
  title: 'My Blog Post',
  author: 'John Doe',
  date: '2024-01-15',
}

# My Blog Post

Content here...
```

Read metadata when importing:

```tsx
import Post, { metadata } from '@/content/post.mdx'

export default function Page() {
  console.log(metadata.author) // 'John Doe'
  return <Post />
}
```

For YAML frontmatter support, use `remark-mdx-frontmatter`:

```bash
npm install remark-mdx-frontmatter
```

```ts
// next.config.ts
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkMdxFrontmatter],
  },
})
```

## remark/rehype Plugins

Add markdown transformation plugins:

```ts
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypePrism from 'rehype-prism-plus'

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkToc],
    rehypePlugins: [rehypePrism],
  },
})
```

Popular plugins:
- `remark-gfm` — GitHub Flavored Markdown (tables, strikethrough, task lists)
- `remark-toc` — Table of contents
- `rehype-prism-plus` — Syntax highlighting
- `rehype-slug` — Heading anchors

## Tailwind Typography

Style MDX content with `@tailwindcss/typography`:

```bash
npm install @tailwindcss/typography
```

```tsx
// mdx-components.tsx or layout
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      {children}
    </div>
  )
}
```

## MDX with Server Components

MDX pages are Server Components by default (zero client JS unless you import Client Components):

```mdx
'use client'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

## Handling .md Files

For plain markdown files (not MDX):

```ts
// next.config.ts
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}
```

`.md` files are treated as MDX but without JSX support.
