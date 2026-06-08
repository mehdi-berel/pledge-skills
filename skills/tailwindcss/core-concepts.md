# Core Concepts (Tailwind CSS)

## Utility-First Workflow

Build components by composing utility classes directly in HTML/JSX:

```html
<!-- Card component -->
<div class="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
  <img class="w-full h-48 object-cover" src="/img.jpg" alt="Card image" />
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2 text-gray-900 dark:text-white">Card Title</div>
    <p class="text-gray-700 dark:text-gray-300 text-base">
      Some quick example text to build on the card title.
    </p>
  </div>
  <div class="px-6 pt-4 pb-2">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      #tag
    </span>
  </div>
</div>
```

## Handling Hover, Focus, and States

Prefix utilities with state variants:

```html
<button class="bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 active:bg-blue-800 disabled:opacity-50">
  Click me
</button>
```

### Common State Prefixes

| Prefix | CSS |
|--------|-----|
| `hover:` | `:hover` |
| `focus:` | `:focus` |
| `focus-visible:` | `:focus-visible` |
| `focus-within:` | `:focus-within` |
| `active:` | `:active` |
| `disabled:` | `:disabled` |
| `checked:` | `:checked` |
| `visited:` | `:visited` |
| `first:` | `:first-child` |
| `last:` | `:last-child` |
| `odd:` | `:nth-child(odd)` |
| `even:` | `:nth-child(even)` |
| `only:` | `:only-child` |
| `required:` | `:required` |
| `invalid:` | `:invalid` |
| `read-only:` | `:read-only` |
| `placeholder:` | `::placeholder` |
| `before:` | `::before` |
| `after:` | `::after` |
| `selection:` | `::selection` |

### Group & Peer States

```html
<!-- Group hover — child responds to parent hover -->
<div class="group relative">
  <div class="group-hover:bg-blue-100">I change when parent is hovered</div>
  <div class="group-hover:opacity-100 opacity-0">Show on parent hover</div>
</div>

<!-- Peer — element responds to sibling state -->
<input type="checkbox" class="peer" />
<label class="peer-checked:bg-blue-500 peer-checked:text-white">
  Toggle me
</label>

<!-- Peer with arbitrary selector -->
<input class="peer/draft" type="radio" name="status" />
<span class="peer-checked/draft:bg-gray-200">Draft</span>
```

## Arbitrary Values

Use square brackets for one-off custom values:

```html
<!-- Arbitrary values -->
<div class="w-[100px] h-[calc(100vh-4rem)] top-[117px]">

<!-- Arbitrary colors -->
<div class="bg-[#0ea5e9] text-[rgb(255,255,255)]">

<!-- Arbitrary properties -->
<div class="[mask-type:luminance] [paint-order:markers]">

<!-- With modifiers -->
<div class="md:w-[50vw] hover:bg-[#0ea5e9]/80">

<!-- CSS variable fallback -->
<div class="h-[var(--sidebar-height)]">
```

## Important Modifier

```html
<!-- ! prefix for !important -->
<div class="!p-4">  /* padding: 1rem !important */

<!-- In config -->
@theme {
  --color-primary: #0ea5e9 !important;
}
```

## Styling Based on Parent (Has)

```html
<!-- Target parent based on child state -->
<form class="has-[:invalid]:border-red-500">
  <input type="email" required />
</form>

<!-- With arbitrary selectors -->
<div class="has-[> svg]:pl-8">
  <svg>...</svg>  <!-- parent gets padding-left when it has direct svg child -->
</div>
```

## Style Conflicts (Layering)

Tailwind uses **Cascade Layers** to manage conflicts:

```html
<!-- The LAST class wins (source order) -->
<div class="text-red-500 text-blue-500">  <!-- Blue text -->

<!-- Use @layer components for component styles -->
```

## When to Extract Components

### 1. `@apply` in CSS (v4)

```css
@layer components {
  .btn {
    @apply px-4 py-2 rounded font-semibold transition-colors;
  }
  .btn-primary {
    @apply btn bg-blue-500 text-white hover:bg-blue-600;
  }
}
```

### 2. React/Vue/Svelte Components

```tsx
// React component
function Button({ children, variant = 'primary' }: ButtonProps) {
  const base = 'px-4 py-2 rounded font-semibold transition-colors'
  const styles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  }
  return <button className={`${base} ${styles[variant]}`}>{children}</button>
}
```

### 3. Loops for repetition

```tsx
// Use loops instead of duplicating classes
const items = ['apple', 'banana', 'cherry']

<ul className="space-y-2">
  {items.map((item) => (
    <li key={item} className="px-4 py-2 bg-gray-100 rounded">
      {item}
    </li>
  ))}
</ul>
```

## Complex Selectors

```html
<!-- Child combinator -->
<div class="*:rounded">  <!-- all direct children get rounded -->

<!-- Descendant -->
<div class="[&_p]:text-gray-700">  <!-- all <p> descendants -->

<!-- Sibling -->
<div class="[&+div]:mt-4">  <!-- next adjacent div sibling -->

<!-- Complex -->
<ul class="[&_li:first-child]:font-bold [&_li:last-child]:text-gray-500">
```

## CSS-First Configuration (v4)

Tailwind v4 configures everything through CSS:

```css
/* main.css */
@import "tailwindcss";

/* Custom theme */
@theme {
  /* Colors */
  --color-primary: #0ea5e9;
  --color-secondary: #6366f1;

  /* Fonts */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "Fira Code", monospace;

  /* Spacing */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;

  /* Breakpoints */
  --breakpoint-3xl: 120rem;
}

/* Custom base styles */
@layer base {
  h1 { @apply text-3xl font-bold; }
  a { @apply text-blue-600 hover:underline; }
}

/* Custom components */
@layer components {
  .card {
    @apply rounded-lg bg-white shadow-md p-6;
  }
}

/* Custom utilities */
@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
}
```

## Theme Variables Reference

| Variable Prefix | What It Controls |
|-----------------|------------------|
| `--color-*` | Background, text, border colors |
| `--font-*` | Font families |
| `--text-*` | Font sizes |
| `--font-weight-*` | Font weights |
| `--tracking-*` | Letter spacing |
| `--leading-*` | Line heights |
| `--spacing-*` | Padding, margin, gap, space |
| `--breakpoint-*` | Responsive breakpoints |
| `--container-*` | Container max-widths |
| `--radius-*` | Border radius |
| `--shadow-*` | Box shadows |
| `--inset-shadow-*` | Inset shadows |
| `--drop-shadow-*` | Drop shadows |
| `--blur-*` | Backdrop-filter blur |
| `--ease-*` | Transition timing functions |
| `--animate-*` | Keyframe animations |
| `--perspective-*` | Transform perspective |
| `--aspect-*` | Aspect ratios |
