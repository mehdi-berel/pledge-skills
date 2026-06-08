# Customization (Tailwind CSS)

## CSS-First Configuration (v4)

Tailwind v4 uses CSS-native configuration via `@theme`:

```css
/* main.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary: #0ea5e9;
  --color-secondary: #6366f1;
  --color-surface: #f8fafc;

  /* Fonts */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-serif: "Merriweather", Georgia, serif;
  --font-mono: "Fira Code", monospace;

  /* Spacing */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;

  /* Breakpoints */
  --breakpoint-xs: 30rem;
  --breakpoint-3xl: 120rem;

  /* Animations */
  --animate-fade-in: fade-in 0.5s ease-out;
  --animate-slide-up: slide-up 0.5s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

## Theme Variable Prefixes

| Prefix | Controls | Example |
|--------|----------|---------|
| `--color-*` | Background, text, border colors | `--color-primary: #0ea5e9` |
| `--font-*` | Font families | `--font-sans: Inter, sans-serif` |
| `--text-*` | Font sizes | `--text-xl: 1.25rem` |
| `--font-weight-*` | Font weights | `--font-weight-bold: 700` |
| `--tracking-*` | Letter spacing | `--tracking-wide: 0.025em` |
| `--leading-*` | Line heights | `--leading-snug: 1.375` |
| `--spacing-*` | Padding, margin, gap | `--spacing-18: 4.5rem` |
| `--breakpoint-*` | Responsive breakpoints | `--breakpoint-3xl: 120rem` |
| `--container-*` | Container max-widths | `--container-8xl: 90rem` |
| `--radius-*` | Border radius | `--radius-4xl: 2rem` |
| `--shadow-*` | Box shadows | `--shadow-glow: 0 0 20px` |
| `--inset-shadow-*` | Inset shadows | `--inset-shadow-sm: inset 0 1px 1px` |
| `--drop-shadow-*` | Drop shadows | `--drop-shadow-glow: 0 0 10px` |
| `--blur-*` | Backdrop blur | `--blur-4xl: 72px` |
| `--ease-*` | Timing functions | `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `--animate-*` | Keyframe animations | `--animate-bounce: bounce 1s infinite` |
| `--perspective-*` | 3D perspective | `--perspective-dramatic: 100px` |
| `--aspect-*` | Aspect ratios | `--aspect-cinemascope: 21 / 9` |

## Custom Variants

```css
@custom-variant dark (&:where(.dark, .dark *));
@custom-variant hocus (&:hover, &:focus);
@custom-variant optional (&:optional);

/* Usage */
<div class="dark:bg-black hocus:underline optional:opacity-50">
```

## @layer Directives

```css
/* Base styles */
@layer base {
  html {
    @apply scroll-smooth;
  }
  body {
    @apply antialiased text-gray-900 bg-white;
  }
  h1 {
    @apply text-3xl font-bold;
  }
}

/* Component styles */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors;
  }
  .btn-primary {
    @apply btn bg-blue-500 text-white hover:bg-blue-600;
  }
}

/* Utility styles */
@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
}
```

## @utility (v4)

Define custom utilities that work with modifiers:

```css
@utility tab-4 {
  tab-size: 4;
}

@utility text-shadow-sm {
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.1);
}
```

```html
<div class="tab-4">
<div class="text-shadow-sm hover:text-shadow-lg">
```

## CSS Import Resolving

Tailwind v4 resolves imports and extracts Tailwind-specific syntax:

```css
/* Can import component libraries with @import */
@import "./components/buttons.css";
@import "tailwindcss";

/* Conditional imports */
@layer theme, base, components, utilities;
```

## Prefix Option

```css
@import "tailwindcss" prefix(tw);
```

```html
<div class="tw-bg-red-500 tw-p-4">
  All utilities prefixed with "tw-"
</div>
```

## Important Option

```css
@import "tailwindcss" important;
```

All utilities generate with `!important`.

## Source Detection

Tailwind v4 automatically detects utility class usage:

```css
/* Specify source files */
@source "../templates/**/*.html";
@source "../scripts/**/*.js";
```

## Plugins (v4)

```css
@import "tailwindcss";
@import "@tailwindcss/typography";
@import "@tailwindcss/forms";
@import "@tailwindcss/aspect-ratio";
@import "@tailwindcss/container-queries";
```

### Official Plugins

| Plugin | Purpose |
|--------|---------|
| `@tailwindcss/typography` | Styled prose content |
| `@tailwindcss/forms` | Form element resets |
| `@tailwindcss/aspect-ratio` | Aspect ratio utilities |
| `@tailwindcss/container-queries` | Container query utilities |
| `@tailwindcss/line-clamp` | Line clamping (now built-in) |

## Dark Mode

### Media Query Strategy (Default)

```css
@import "tailwindcss";
/* Uses prefers-color-scheme automatically */
```

```html
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-white">Auto dark mode</p>
</div>
```

### Class Strategy

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

```html
<html class="dark">
  <div class="bg-white dark:bg-gray-900">
    <p class="text-gray-900 dark:text-white">Class-based dark mode</p>
  </div>
</html>
```

### Toggle Dark Mode

```tsx
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return <button onClick={() => setIsDark(!isDark)}>Toggle</button>
}
```

## Theme Color Reference

```html
<meta name="theme-color" content="#0ea5e9" />
```

## Print Styles

```html
<div class="print:hidden">     <!-- Hidden when printing -->
<div class="hidden print:block"> <!-- Only visible when printing -->

<!-- Print-specific styles -->
@layer base {
  @media print {
    .no-print { display: none; }
  }
}
```

## Common Customization Patterns

### Design System Colors

```css
@theme {
  --color-brand-50: #f0f9ff;
  --color-brand-100: #e0f2fe;
  --color-brand-200: #bae6fd;
  --color-brand-300: #7dd3fc;
  --color-brand-400: #38bdf8;
  --color-brand-500: #0ea5e9;
  --color-brand-600: #0284c7;
  --color-brand-700: #0369a1;
  --color-brand-800: #075985;
  --color-brand-900: #0c4a6e;
  --color-brand-950: #082f49;
}
```

### Fluid Type Scale

```css
@theme {
  --text-fluid-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --text-fluid-base: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  --text-fluid-lg: clamp(1.125rem, 1rem + 0.75vw, 1.5rem);
  --text-fluid-xl: clamp(1.25rem, 1.1rem + 1vw, 2rem);
  --text-fluid-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 3rem);
}
```

### Custom Easing Functions

```css
@theme {
  --ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035);
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

```html
<div class="transition-all duration-500 ease-spring">
```

## Upgrading from v3 to v4

| v3 (JS config) | v4 (CSS config) |
|----------------|-----------------|
| `tailwind.config.js` | `@theme` in CSS |
| `theme.extend` | Add variables to `@theme` |
| `plugins: [require('...')]` | `@import "@tailwindcss/plugin"` |
| `corePlugins: { container: false }` | `@theme { --container-*: initial; }` |
| `prefix: 'tw-'` | `@import "tailwindcss" prefix(tw)` |
| `important: true` | `@import "tailwindcss" important` |

## Best Practices

1. **Use `@theme` for values** you reuse across components
2. **Use `@layer components`** for repeated UI patterns
3. **Use `@utility`** for one-off utilities that need modifier support
4. **Keep `@apply` minimal** — prefer composing utilities in HTML
5. **Use `@source`** to help Tailwind find templates in non-standard locations
