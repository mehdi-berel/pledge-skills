# Colors (Tailwind CSS)

## Default Color Palette

Tailwind v4 includes a comprehensive palette by default:

| Color | Shades |
|-------|--------|
| `slate` | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| `gray` | Same scale |
| `zinc` | Same scale |
| `neutral` | Same scale |
| `stone` | Same scale |
| `red` | Same scale |
| `orange` | Same scale |
| `amber` | Same scale |
| `yellow` | Same scale |
| `lime` | Same scale |
| `green` | Same scale |
| `emerald` | Same scale |
| `teal` | Same scale |
| `cyan` | Same scale |
| `sky` | Same scale |
| `blue` | Same scale |
| `indigo` | Same scale |
| `violet` | Same scale |
| `purple` | Same scale |
| `fuchsia` | Same scale |
| `pink` | Same scale |
| `rose` | Same scale |

## Using Colors

### Background Color

```html
<div class="bg-white">
<div class="bg-black">
<div class="bg-red-500">
<div class="bg-blue-600">
<div class="bg-slate-900">
<div class="bg-transparent">
<div class="bg-current">      <!-- currentColor -->
<div class="bg-inherit">

<!-- Arbitrary values -->
<div class="bg-[#0ea5e9]">
<div class="bg-[rgb(255,0,0)]">
<div class="bg-[hsl(200,100%,50%)]">
<div class="bg-[var(--my-color)]">
```

### Text Color

```html
<p class="text-white">
<p class="text-black">
<p class="text-red-500">
<p class="text-gray-600">
<p class="text-inherit">
<p class="text-current">      <!-- inherits currentColor -->
<p class="text-transparent">

<!-- With opacity -->
<p class="text-red-500/50">   <!-- 50% opacity -->
<p class="text-red-500/[0.75]"> <!-- 75% opacity -->
```

### Border Color

```html
<div class="border-red-500">
<div class="border-x-blue-300">   <!-- left + right -->
<div class="border-y-green-400">  <!-- top + bottom -->
<div class="border-t-purple-500"> <!-- top only -->
```

### Ring Color

```html
<div class="ring-2 ring-blue-500 ring-offset-2 ring-offset-white">
```

## Opacity Modifier

Append `/` with opacity value (0-100 or decimal):

```html
<div class="bg-red-500/50">       <!-- 50% opacity -->
<div class="bg-red-500/[0.75]">   <!-- 75% opacity -->
<div class="text-blue-600/80">
<div class="border-green-400/30">
<div class="shadow-xl shadow-black/20">
```

## Dark Mode

```html
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">
    Dark mode support
  </h1>
</div>

<!-- Dark mode with specific element state -->
<div class="dark:hover:bg-gray-800">
```

### Dark Mode Strategy (v4)

```css
/* main.css — default uses media query (prefers-color-scheme) */
@import "tailwindcss";

/* Or use class-based strategy */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

## Referencing Colors in CSS

```css
@theme {
  --color-primary: #0ea5e9;
}

.my-component {
  background-color: var(--color-primary);
  color: oklch(from var(--color-primary) 20% c h);  /* derived color */
}
```

## Customizing Colors

```css
/* main.css */
@import "tailwindcss";

@theme {
  /* Override existing color */
  --color-primary: #0ea5e9;

  /* Add new color */
  --color-brand: #6366f1;
  --color-brand-light: #818cf8;
  --color-brand-dark: #4f46e5;

  /* Using CSS variables */
  --color-surface: var(--surface-color, #ffffff);
}
```

```html
<!-- Usage -->
<div class="bg-brand text-brand-light">
  Branded content
</div>
```

## Color Transparency

```html
<!-- Using / modifier (recommended) -->
<div class="bg-black/50">       <!-- rgba(0,0,0,0.5) -->

<!-- Using opacity utilities -->
<div class="bg-black opacity-50">

<!-- Mixing with white/black -->
<div class="bg-white/10">       <!-- subtle white overlay -->
<div class="bg-black/80">       <!-- dark overlay -->
```

## Gradient Colors

```html
<!-- Background gradients — see backgrounds.md -->
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
<div class="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
```

## Common Color Patterns

### Semantic Colors

```html
<!-- Status indicators -->
<span class="bg-green-100 text-green-800">Success</span>
<span class="bg-red-100 text-red-800">Error</span>
<span class="bg-yellow-100 text-yellow-800">Warning</span>
<span class="bg-blue-100 text-blue-800">Info</span>

<!-- Badge variants -->
<span class="bg-gray-100 text-gray-800">Default</span>
<span class="bg-primary text-white">Primary</span>
```

### Surface Hierarchy

```html
<div class="bg-white">           <!-- Primary surface -->
<div class="bg-gray-50">         <!-- Secondary surface -->
<div class="bg-gray-100">        <!-- Tertiary surface -->
<div class="bg-gray-200">        <!-- Border color -->
```

### Text Hierarchy

```html
<h1 class="text-gray-900">       <!-- Primary text -->
<p class="text-gray-700">        <!-- Secondary text -->
<span class="text-gray-500">    <!-- Tertiary text -->
<span class="text-gray-400">     <!-- Disabled text -->
```

### Focus Rings

```html
<input class="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500" />

<!-- Error state -->
<input class="border-red-300 focus:ring-red-500 focus:border-red-500" />
```
