# Typography (Tailwind CSS)

## Font Family

```html
<p class="font-sans">     <!-- font-family: var(--font-sans) -->
<p class="font-serif">    <!-- font-family: var(--font-serif) -->
<p class="font-mono">     <!-- font-family: var(--font-mono) -->
```

### Custom Fonts

```css
@theme {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-serif: "Merriweather", Georgia, serif;
  --font-mono: "Fira Code", monospace;
}
```

```html
<p class="font-sans">The quick brown fox</p>
```

## Font Size

| Class | Size | Line Height |
|-------|------|-------------|
| `text-xs` | 0.75rem (12px) | 1rem (default) |
| `text-sm` | 0.875rem (14px) | 1.25rem |
| `text-base` | 1rem (16px) | 1.5rem |
| `text-lg` | 1.125rem (18px) | 1.75rem |
| `text-xl` | 1.25rem (20px) | 1.75rem |
| `text-2xl` | 1.5rem (24px) | 2rem |
| `text-3xl` | 1.875rem (30px) | 2.25rem |
| `text-4xl` | 2.25rem (36px) | 2.5rem |
| `text-5xl` | 3rem (48px) | 1 |
| `text-6xl` | 3.75rem (60px) | 1 |
| `text-7xl` | 4.5rem (72px) | 1 |
| `text-8xl` | 6rem (96px) | 1 |
| `text-9xl` | 8rem (128px) | 1 |

```html
<p class="text-sm">Small text</p>
<p class="text-base">Base text</p>
<p class="text-lg">Large text</p>
<p class="text-4xl font-bold">Display heading</p>

<!-- With custom line-height -->
<p class="text-2xl/8">Text with 2rem line-height</p>
<p class="text-2xl/[1.2]">Text with 1.2 line-height</p>
```

## Font Weight

```html
<p class="font-thin">       <!-- font-weight: 100 -->
<p class="font-extralight"> <!-- font-weight: 200 -->
<p class="font-light">      <!-- font-weight: 300 -->
<p class="font-normal">     <!-- font-weight: 400 -->
<p class="font-medium">     <!-- font-weight: 500 -->
<p class="font-semibold">   <!-- font-weight: 600 -->
<p class="font-bold">       <!-- font-weight: 700 -->
<p class="font-extrabold">  <!-- font-weight: 800 -->
<p class="font-black">      <!-- font-weight: 900 -->
```

## Line Height

```html
<p class="leading-3">      <!-- line-height: 0.75rem (12px) -->
<p class="leading-4">      <!-- line-height: 1rem -->
<p class="leading-5">      <!-- line-height: 1.25rem -->
<p class="leading-6">      <!-- line-height: 1.5rem -->
<p class="leading-7">      <!-- line-height: 1.75rem -->
<p class="leading-8">      <!-- line-height: 2rem -->
<p class="leading-9">      <!-- line-height: 2.25rem -->
<p class="leading-10">     <!-- line-height: 2.5rem -->
<p class="leading-none">    <!-- line-height: 1 -->
<p class="leading-tight">   <!-- line-height: 1.25 -->
<p class="leading-snug">    <!-- line-height: 1.375 -->
<p class="leading-normal">  <!-- line-height: 1.5 -->
<p class="leading-relaxed"> <!-- line-height: 1.625 -->
<p class="leading-loose">   <!-- line-height: 2 -->
```

## Letter Spacing

```html
<p class="tracking-tighter"> <!-- letter-spacing: -0.05em -->
<p class="tracking-tight">   <!-- letter-spacing: -0.025em -->
<p class="tracking-normal">  <!-- letter-spacing: 0em -->
<p class="tracking-wide">  <!-- letter-spacing: 0.025em -->
<p class="tracking-wider"> <!-- letter-spacing: 0.05em -->
<p class="tracking-widest"> <!-- letter-spacing: 0.1em -->
```

## Text Color

```html
<p class="text-white">
<p class="text-black">
<p class="text-gray-600">
<p class="text-blue-500">
<p class="text-current">     <!-- currentColor -->
<p class="text-transparent">

<!-- With opacity -->
<p class="text-blue-500/80">
```

## Text Alignment

```html
<p class="text-left">      <!-- text-align: left -->
<p class="text-center">    <!-- text-align: center -->
<p class="text-right">     <!-- text-align: right -->
<p class="text-justify">   <!-- text-align: justify -->
<p class="text-start">     <!-- text-align: start -->
<p class="text-end">      <!-- text-align: end -->
```

## Text Transform

```html
<p class="uppercase">      <!-- text-transform: uppercase -->
<p class="lowercase">      <!-- text-transform: lowercase -->
<p class="capitalize">     <!-- text-transform: capitalize -->
<p class="normal-case">   <!-- text-transform: none -->
```

## Text Decoration

```html
<p class="underline">          <!-- text-decoration-line: underline -->
<p class="overline">           <!-- text-decoration-line: overline -->
<p class="line-through">        <!-- text-decoration-line: line-through -->
<p class="no-underline">        <!-- text-decoration-line: none -->

<!-- Decoration color -->
<p class="underline decoration-red-500">

<!-- Decoration style -->
<p class="underline decoration-solid">
<p class="underline decoration-double">
<p class="underline decoration-dotted">
<p class="underline decoration-dashed">
<p class="underline decoration-wavy">

<!-- Decoration thickness -->
<p class="underline decoration-1">
<p class="underline decoration-2">
<p class="underline decoration-4">
<p class="underline decoration-[3px]">

<!-- Offset -->
<p class="underline underline-offset-2">
<p class="underline underline-offset-4">
<p class="underline underline-offset-[5px]">
```

## Text Overflow

```html
<p class="truncate">            <!-- ellipsis, nowrap, overflow hidden -->
<p class="text-ellipsis">       <!-- text-overflow: ellipsis -->
<p class="text-clip">           <!-- text-overflow: clip -->
```

## Text Wrap

```html
<p class="text-wrap">           <!-- text-wrap: wrap -->
<p class="text-nowrap">         <!-- text-wrap: nowrap -->
<p class="text-balance">        <!-- text-wrap: balance -->
<p class="text-pretty">         <!-- text-wrap: pretty -->
```

## Word Break

```html
<p class="break-normal">     <!-- overflow-wrap: normal, word-break: normal -->
<p class="break-words">      <!-- overflow-wrap: break-word -->
<p class="break-all">        <!-- word-break: break-all -->
<p class="keep-all">         <!-- word-break: keep-all -->
```

## Hyphens

```html
<p class="hyphens-none">     <!-- hyphens: manual -->
<p class="hyphens-manual">   <!-- hyphens: manual -->
<p class="hyphens-auto">     <!-- hyphens: auto (requires lang attribute) -->
```

## White Space

```html
<p class="whitespace-normal">   <!-- white-space: normal -->
<p class="whitespace-nowrap">   <!-- white-space: nowrap -->
<p class="whitespace-pre">      <!-- white-space: pre -->
<p class="whitespace-pre-line">  <!-- white-space: pre-line -->
<p class="whitespace-pre-wrap">  <!-- white-space: pre-wrap -->
<p class="whitespace-break-spaces"> <!-- white-space: break-spaces -->
```

## Text Indent

```html
<p class="indent-0">
<p class="indent-4">       <!-- text-indent: 1rem -->
<p class="indent-8">       <!-- text-indent: 2rem -->
<p class="indent-[3rem]">
```

## Vertical Align

```html
<span class="align-baseline">    <!-- vertical-align: baseline -->
<span class="align-top">         <!-- vertical-align: top -->
<span class="align-middle">      <!-- vertical-align: middle -->
<span class="align-bottom">      <!-- vertical-align: bottom -->
<span class="align-text-top">    <!-- vertical-align: text-top -->
<span class="align-text-bottom"> <!-- vertical-align: text-bottom -->
<span class="align-sub">         <!-- vertical-align: sub -->
<span class="align-super">       <!-- vertical-align: super -->
```

## Font Style

```html
<p class="italic">           <!-- font-style: italic -->
<p class="not-italic">       <!-- font-style: normal -->
```

## Font Smoothing

```html
<p class="antialiased">       <!-- -webkit-font-smoothing: antialiased -->
<p class="subpixel-antialiased"> <!-- -webkit-font-smoothing: auto -->
```

## Font Variant Numeric

```html
<p class="normal-nums">              <!-- font-variant-numeric: normal -->
<p class="ordinal">                 <!-- font-variant-numeric: ordinal (1st, 2nd) -->
<p class="slashed-zero">            <!-- font-variant-numeric: slashed-zero -->
<p class="lining-nums">             <!-- font-variant-numeric: lining-nums -->
<p class="oldstyle-nums">            <!-- font-variant-numeric: oldstyle-nums -->
<p class="proportional-nums">        <!-- font-variant-numeric: proportional-nums -->
<p class="tabular-nums">             <!-- font-variant-numeric: tabular-nums (monospaced numbers) -->
<p class="diagonal-fractions">         <!-- font-variant-numeric: diagonal-fractions (1/2) -->
<p class="stacked-fractions">         <!-- font-variant-numeric: stacked-fractions -->
```

## List Style

```html
<ul class="list-none">       <!-- list-style-type: none -->
<ul class="list-disc">       <!-- list-style-type: disc -->
<ul class="list-decimal">    <!-- list-style-type: decimal -->
<ul class="list-inside">     <!-- list-style-position: inside -->
<ul class="list-outside">    <!-- list-style-position: outside -->

<!-- Custom marker -->
<ul class="list-none [&_li]:marker:text-red-500">
  <li>Item with custom marker color</li>
</ul>
```

## List Style Image

```html
<ul class="list-image-[url(checkmark.png)]">
  <li>Item with checkmark</li>
</ul>
```

## Typography Plugin

```bash
npm install @tailwindcss/typography
```

```css
@import "tailwindcss";
@import "@tailwindcss/typography";
```

```html
<article class="prose prose-slate max-w-none">
  <!-- Automatically styles headings, lists, code blocks, etc. -->
  <h1>Title</h1>
  <p>Body text with <code>inline code</code>.</p>
  <ul>
    <li>List item</li>
  </ul>
</article>

<!-- Modifier classes -->
<article class="prose prose-lg prose-invert">
  <!-- Larger size, dark mode styles -->
</article>
```

| Modifier | Effect |
|----------|--------|
| `prose-sm` | Smaller typography |
| `prose-base` | Base size (default) |
| `prose-lg` | Larger typography |
| `prose-xl` | Extra large |
| `prose-2xl` | 2x large |
| `prose-invert` | Dark mode colors |
| `prose-slate` | Slate color scheme |
| `prose-gray` | Gray color scheme |
| `prose-zinc` | Zinc color scheme |
| `prose-neutral` | Neutral color scheme |
| `prose-stone` | Stone color scheme |

## Common Patterns

### Heading Hierarchy

```html
<h1 class="text-4xl font-bold tracking-tight text-gray-900">Page Title</h1>
<h2 class="text-2xl font-semibold text-gray-800">Section</h2>
<h3 class="text-lg font-medium text-gray-700">Subsection</h3>
```

### Body Text

```html
<p class="text-base leading-relaxed text-gray-600">
  Comfortable reading with relaxed line-height.
</p>
```

### Code Block

```html
<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
  <code class="font-mono text-sm">const x = 1</code>
</pre>
```

### Link Styling

```html
<a href="#" class="text-blue-600 hover:text-blue-800 underline decoration-blue-600/30 hover:decoration-blue-800 underline-offset-2">
  Styled link
</a>
```
