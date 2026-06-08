# CSS and Styling (Next.js 16)

## Tailwind CSS (v4, Default in New Projects)

```bash
pnpm add -D tailwindcss @tailwindcss/postcss
```

```mjs
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

```css
/* app/globals.css */
@import 'tailwindcss';
```

```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

Now use Tailwind utility classes anywhere:

```tsx
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
```

Good to know: For broader browser support on very old browsers, see [Tailwind CSS v3 setup](https://nextjs.org/docs/app/guides/tailwind-v3-css).

## CSS Modules

Locally scoped CSS with unique class names:

```css
/* blog.module.css */
.blog { padding: 24px; }
.title { font-size: 2rem; }
```

```tsx
import styles from './blog.module.css'
export default function Page() {
  return <main className={styles.blog}></main>
}
```

## Global CSS

Import in root layout for truly global styles (e.g., Tailwind base, CSS reset):

```tsx
import './global.css'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Important:** Global styles can be imported into any layout, page, or component. However, since Next.js uses React's built-in stylesheet support with Suspense, global stylesheets are NOT removed as you navigate between routes. This can cause conflicts. We recommend:
- Global CSS for truly global styles (CSS reset, Tailwind base)
- Tailwind CSS for component styling
- CSS Modules for custom scoped CSS when needed

## External Stylesheets

Import stylesheets from `node_modules` directly in any component:

```tsx
import 'bootstrap/dist/css/bootstrap.css'
```

## Ordering and Merging

CSS is applied in this order:
1. Global CSS (imported in root layout)
2. CSS Modules (scoped to component)
3. Inline styles (`style` prop)

When multiple CSS files import each other, Next.js handles deduplication automatically.

## Sass

Next.js has built-in Sass support. Install the package:

```bash
pnpm add -D sass
```

### SCSS Syntax (recommended)

Use `.scss` or `.module.scss` extensions:

```scss
// app/blog.module.scss
.blog {
  padding: 24px;

  .title {
    font-size: 2rem;
    color: var(--primary-color);
  }

  &:hover {
    background: #f5f5f5;
  }
}
```

```tsx
import styles from './blog.module.scss'

export default function BlogPage() {
  return (
    <article className={styles.blog}>
      <h1 className={styles.title}>My Blog</h1>
    </article>
  )
}
```

### Sass Variables

```scss
// app/variables.scss
$primary-color: #0070f3;
$spacing-unit: 8px;

:export {
  primaryColor: $primary-color;
}
```

```tsx
import variables from './variables.scss'

console.log(variables.primaryColor) // '#0070f3'
```

### Customizing Sass Options

```ts
// next.config.ts
const nextConfig = {
  sassOptions: {
    includePaths: [require('path').join(__dirname, 'styles')],
    prependData: `@use "variables" as *;`,
  },
}
```

**Note:** `.sass` (Indented Syntax) is also supported but SCSS is recommended as it's a CSS superset.
