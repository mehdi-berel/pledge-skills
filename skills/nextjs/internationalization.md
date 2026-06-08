# Internationalization (i18n) in Next.js 16

## Routing Overview

Next.js supports two i18n routing strategies:
1. **Sub-path**: `/fr/products`, `/en/products`
2. **Domain**: `my-site.fr/products`, `my-site.com/products`

## Recommended Approach with App Router

Use `proxy.ts` to detect locale and redirect:

```ts
// proxy.ts
import { NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en-US', 'nl-NL', 'nl']
const defaultLocale = 'en-US'

function getLocale(request: Request): string {
  const negotiator = new Negotiator({ headers: { 'accept-language': request.headers.get('accept-language') || '' } })
  const languages = negotiator.languages()
  return match(languages, locales, defaultLocale)
}

export default function proxy(request: Request) {
  const { pathname } = (request as any).nextUrl

  // Check if pathname already has locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) return NextResponse.next()

  // Redirect to locale-prefixed path
  const locale = getLocale(request)
  const url = new URL(request.url)
  url.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(url)
}
```

## Project Structure

Nest all pages under `app/[lang]`:

```
app/
  [lang]/
    layout.tsx
    page.tsx
    about/
      page.tsx
    blog/
      [slug]/
        page.tsx
```

```tsx
// app/[lang]/layout.tsx
import { notFound } from 'next/navigation'

const locales = ['en-US', 'nl-NL', 'nl']

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!locales.includes(lang)) {
    notFound()
  }

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  )
}
```

## Localization (Dictionaries)

Create translation dictionaries as JSON files:

```json
// dictionaries/en.json
{
  "products": {
    "cart": "Add to Cart"
  },
  "nav": {
    "home": "Home",
    "about": "About"
  }
}
```

```ts
// lib/dictionary.ts
import 'server-only'

const dictionaries = {
  'en-US': () => import('./dictionaries/en.json').then((m) => m.default),
  'nl-NL': () => import('./dictionaries/nl.json').then((m) => m.default),
  'nl': () => import('./dictionaries/nl.json').then((m) => m.default),
}

export type Locale = keyof typeof dictionaries

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]()
```

Use in pages:

```tsx
// app/[lang]/page.tsx
import { getDictionary, hasLocale } from '@/lib/dictionary'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  return <button>{dict.products.cart}</button>
}
```

## Static Rendering for i18n

Generate static routes for all locales:

```tsx
// app/[lang]/layout.tsx
export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'nl-NL' }, { lang: 'nl' }]
}
```

## Locale Switcher

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname()
  const locales = ['en-US', 'nl-NL']

  // Remove current locale from pathname
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${currentLocale}`), '') || '/'

  return (
    <div>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${pathWithoutLocale}`}
          className={locale === currentLocale ? 'font-bold' : ''}
        >
          {locale}
        </Link>
      ))}
    </div>
  )
}
```

## Domain-Based Routing

For domain-based routing, detect the host in `proxy.ts`:

```ts
// proxy.ts
export default function proxy(request: Request) {
  const host = request.headers.get('host') || ''
  const locale = host.startsWith('my-site.fr') ? 'fr' : 'en'

  // Rewrite to locale-prefixed internal path
  const url = new URL(request.url)
  url.pathname = `/${locale}${url.pathname}`
  return NextResponse.rewrite(url)
}
```

## RTL (Right-to-Left) Languages

Set `dir="rtl"` for RTL locales:

```tsx
// app/[lang]/layout.tsx
const rtlLocales = ['ar', 'he', 'fa']

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params
  const dir = rtlLocales.includes(lang) ? 'rtl' : 'ltr'

  return (
    <html lang={lang} dir={dir}>
      <body>{children}</body>
    </html>
  )
}
```

## Date/Number Formatting

Use `Intl` APIs for locale-aware formatting:

```tsx
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const date = new Date()

  return (
    <div>
      <time dateTime={date.toISOString()}>
        {new Intl.DateTimeFormat(lang).format(date)}
      </time>
      <span>
        {new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' }).format(1234.56)}
      </span>
    </div>
  )
}
```
