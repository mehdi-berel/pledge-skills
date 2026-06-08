# CSS-in-JS in Next.js 16

## Important Warning

CSS-in-JS with newer React features (Server Components, Streaming) requires library support for React 18+ concurrent rendering. Some libraries are still working on App Router support.

**Supported in Client Components:**
- ant-design, chakra-ui, @fluentui/react-components
- kuma-ui, @mui/material, @mui/joy
- pandacss, styled-jsx, styled-components
- stylex, tamagui, tss-react, vanilla-extract

**Not yet supported:** emotion (work in progress)

## styled-components Setup

Enable in `next.config.ts`:

```ts
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
}
```

Create a style registry component:

```tsx
// app/lib/registry.tsx
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

Wrap root layout:

```tsx
// app/layout.tsx
import StyledComponentsRegistry from './lib/registry'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

## styled-jsx

Built-in with Next.js. Works in both Pages and App Router:

```tsx
export default function HelloWorld() {
  return (
    <div>
      <h1>Hello World</h1>
      <style jsx>{`
        h1 {
          color: red;
        }
      `}</style>
    </div>
  )
}
```

For global styles:

```tsx
<style jsx global>{`
  body {
    margin: 0;
  }
`}</style>
```

## CSS Modules vs CSS-in-JS

| Feature | CSS Modules | CSS-in-JS |
|---------|-------------|-----------|
| Server Components | ✅ Native | ⚠️ Client Components only |
| Bundle size | Smaller (extracted at build) | Larger (JS runtime) |
| Dynamic styles | Limited | Powerful |
| Dev experience | Good | Excellent (props-based) |
| Colocation | Separate `.module.css` file | Inline in component |

**Recommendation for Next.js 16:**
- Use **Tailwind CSS v4** for most styling
- Use **CSS Modules** for complex component styles
- Use **CSS-in-JS** only when dynamic/props-based styles are critical
- Keep CSS-in-JS usage in Client Components

## Tailwind + CSS-in-JS Hybrid

Use Tailwind for layout/styling, CSS-in-JS for dynamic animations:

```tsx
'use client'
import styled from 'styled-components'

const AnimatedCard = styled.div<{ $isActive: boolean }>`
  transition: transform 0.3s ease;
  transform: ${props => props.$isActive ? 'scale(1.05)' : 'scale(1)'};
`

export default function Card({ isActive }: { isActive: boolean }) {
  return (
    <AnimatedCard
      $isActive={isActive}
      className="rounded-lg bg-white p-6 shadow-md"
    >
      Content
    </AnimatedCard>
  )
}
```
