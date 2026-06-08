# Responsive Design (Tailwind CSS)

## Breakpoints

Tailwind uses a **mobile-first** approach. Utilities without prefix apply everywhere. Prefixed utilities override at their breakpoint and up.

| Name | Prefix | Min Width |
|------|--------|-----------|
| Small | `sm:` | 640px |
| Medium | `md:` | 768px |
| Large | `lg:` | 1024px |
| Extra Large | `xl:` | 1280px |
| 2X Large | `2xl:` | 1536px |

```html
<!-- Mobile-first: default is mobile, override at breakpoints -->
<div class="text-sm md:text-base lg:text-lg">
  Small on mobile, base at md, large at lg
</div>

<div class="w-full md:w-1/2 lg:w-1/3">
  Full width on mobile, half at md, third at lg
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  Responsive grid
</div>
```

## Targeting Breakpoint Ranges

```html
<!-- Only apply at md (768px-1023px) -->
<div class="md-only:hidden">
  <!-- Custom variant needed for exact breakpoint targeting -->
</div>
```

**Note:** Tailwind does not include `max-*` prefixes by default. Use the `max-*` variant:

```html
<!-- Only apply below md breakpoint -->
<div class="max-md:hidden">     <!-- @media (max-width: 767px) -->

<!-- Apply between sm and lg -->
<div class="max-lg:min-md:hidden">  <!-- @media (min-width: 768px) and (max-width: 1023px) -->
```

## Targeting Single Breakpoint

```html
<!-- Custom @variant approach in v4 -->
@variant min-md {
  .sidebar {
    @apply w-64;
  }
}
```

Or use responsive prefixes strategically:

```html
<div class="hidden md:block lg:hidden">
  <!-- Only visible at md breakpoint (768px-1023px) -->
</div>
```

## Container Queries

Container queries style based on a **container's** width, not the viewport:

```html
<!-- Define container -->
<div class="@container">
  <div class="@md:grid-cols-2 @lg:grid-cols-3">
    <!-- Responds to THIS container's width, not viewport -->
  </div>
</div>
```

### Named Containers

```html
<div class="@container/sidebar">
  <div class="@md/sidebar:p-4">
    <!-- Named container queries -->
  </div>
</div>
```

### Container Query Sizes

| Class | Container Min Width |
|-------|---------------------|
| `@sm` | 640px |
| `@md` | 768px |
| `@lg` | 1024px |
| `@xl` | 1280px |
| `@2xl` | 1536px |
| `@3xl` | 1920px |
| `@4xl` | 2560px |
| `@5xl` | 3200px |
| `@6xl` | 3840px |
| `@7xl` | 4480px |

### Size Containers

```html
<div class="@container-size">
  <div class="@[size]/sidebar:p-4">
    <!-- Responds to container's block AND inline size -->
  </div>
</div>
```

## Custom Breakpoints

```css
/* CSS-first configuration (v4) */
@theme {
  --breakpoint-xs: 30rem;
  --breakpoint-3xl: 120rem;
}
```

```html
<div class="xs:text-sm 3xl:text-4xl">
  Custom breakpoints
</div>
```

## Responsive Patterns

### Hide/Show Elements

```html
<!-- Show only on mobile -->
<div class="lg:hidden">Mobile menu</div>

<!-- Show only on desktop -->
<div class="hidden lg:block">Desktop sidebar</div>

<!-- Different navigation -->
<nav class="hidden md:flex">Desktop nav</nav>
<nav class="md:hidden">Mobile nav</nav>
```

### Responsive Typography

```html
<h1 class="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
  Responsive heading
</h1>
```

### Responsive Padding

```html
<div class="px-4 py-6 md:px-8 md:py-12 lg:px-12 lg:py-16">
  Content with responsive padding
</div>

<!-- Simplified with fluid spacing -->
<div class="px-[clamp(1rem,5vw,3rem)] py-[clamp(1.5rem,8vw,4rem)]">
</div>
```

### Responsive Sidebar Layout

```html
<div class="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
  <aside class="hidden md:block">Sidebar</aside>
  <main>Main content</main>
</div>
```

### Card Grid

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <div class="...">Card 1</div>
  <div class="...">Card 2</div>
  <!-- ... -->
</div>
```

### Responsive Table

```html
<div class="overflow-x-auto">
  <table class="w-full text-sm md:text-base">
    <thead class="hidden md:table-header-group">
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <tr class="grid grid-cols-1 md:table-row gap-2 mb-4 md:mb-0">
        <td class="font-bold md:font-normal">John</td>
        <td>john@example.com</td>
        <td>Admin</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Stacked to Horizontal Form

```html
<form class="space-y-4 md:space-y-0 md:flex md:gap-4">
  <input class="w-full md:w-1/3" placeholder="Name" />
  <input class="w-full md:w-1/3" placeholder="Email" />
  <button class="w-full md:w-auto">Submit</button>
</form>
```

### Image Gallery

```html
<div class="columns-1 sm:columns-2 lg:columns-3 gap-4">
  <img class="mb-4 break-inside-avoid rounded-lg" src="..." />
  <img class="mb-4 break-inside-avoid rounded-lg" src="..." />
  <!-- ... -->
</div>
```

## Responsive Arbitrary Values

```html
<div class="w-[calc(100%-2rem)] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]">
  Responsive calculations
</div>

<div class="h-[50vh] md:h-[60vh] lg:h-[70vh]">
  Responsive viewport height
</div>
```

## Common Mistakes

### ❌ Don't: Mobile-last approach

```html
<!-- Wrong: desktop-first, undoing at mobile -->
<div class="grid-cols-4 sm:grid-cols-2 grid-cols-1">
```

### ✅ Do: Mobile-first

```html
<!-- Correct: mobile default, enhance at breakpoints -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
```

### ❌ Don't: Over-specific breakpoints

```html
<!-- Hard to maintain -->
<div class="sm: md: lg: xl: 2xl: ...">
```

### ✅ Do: Fewer, meaningful breakpoints

```html
<!-- Usually md and lg are enough -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Fluid Typography

```html
<h1 class="text-[clamp(1.5rem,5vw,3rem)] font-bold">
  Fluid heading that scales smoothly
</h1>
```

## Fluid Spacing

```html
<div class="p-[clamp(1rem,3vw,3rem)]">
  Fluid padding
</div>
```
