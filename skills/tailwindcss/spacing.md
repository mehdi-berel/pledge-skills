# Spacing (Tailwind CSS)

## Spacing Scale

| Class | Rem | Pixels |
|-------|-----|--------|
| `0` | 0px | 0px |
| `px` | 1px | 1px |
| `0.5` | 0.125rem | 2px |
| `1` | 0.25rem | 4px |
| `2` | 0.5rem | 8px |
| `3` | 0.75rem | 12px |
| `4` | 1rem | 16px |
| `5` | 1.25rem | 20px |
| `6` | 1.5rem | 24px |
| `8` | 2rem | 32px |
| `10` | 2.5rem | 40px |
| `12` | 3rem | 48px |
| `16` | 4rem | 64px |
| `20` | 5rem | 80px |
| `24` | 6rem | 96px |
| `32` | 8rem | 128px |
| `40` | 10rem | 160px |
| `48` | 12rem | 192px |
| `56` | 14rem | 224px |
| `64` | 16rem | 256px |
| `80` | 20rem | 320px |
| `96` | 24rem | 384px |

## Padding

```html
<div class="p-4">         <!-- padding: 1rem (all sides) -->
<div class="px-4">        <!-- padding-left + padding-right: 1rem -->
<div class="py-4">        <!-- padding-top + padding-bottom: 1rem -->
<div class="pt-4">        <!-- padding-top: 1rem -->
<div class="pr-4">        <!-- padding-right: 1rem -->
<div class="pb-4">        <!-- padding-bottom: 1rem -->
<div class="pl-4">        <!-- padding-left: 1rem -->

<!-- Logical properties -->
<div class="ps-4">        <!-- padding-inline-start: 1rem -->
<div class="pe-4">        <!-- padding-inline-end: 1rem -->
<div class="pi-4">        <!-- padding-inline: 1rem -->
<div class="pb-4">        <!-- padding-block: 1rem (already shown) -->
```

## Margin

```html
<div class="m-4">         <!-- margin: 1rem -->
<div class="mx-4">        <!-- margin-left + margin-right: 1rem -->
<div class="my-4">        <!-- margin-top + margin-bottom: 1rem -->
<div class="mt-4">        <!-- margin-top: 1rem -->
<div class="mr-4">        <!-- margin-right: 1rem -->
<div class="mb-4">        <!-- margin-bottom: 1rem -->
<div class="ml-4">        <!-- margin-left: 1rem -->

<!-- Negative margin -->
<div class="-m-4">        <!-- margin: -1rem -->
<div class="-mt-4">       <!-- margin-top: -1rem -->

<!-- Auto margin -->
<div class="m-auto">      <!-- margin: auto -->
<div class="mx-auto">     <!-- margin-left/right: auto (center block) -->
<div class="my-auto">     <!-- margin-top/bottom: auto (center vertically in flex) -->

<!-- Logical -->
<div class="ms-4">        <!-- margin-inline-start: 1rem -->
<div class="me-4">        <!-- margin-inline-end: 1rem -->
<div class="mi-4">        <!-- margin-inline: 1rem -->
```

## Space Between

For adding margin between siblings (like `gap` but for vertical/horizontal lists):

```html
<!-- Vertical spacing -->
<div class="space-y-4">
  <div>Item 1</div>  <!-- no top margin -->
  <div>Item 2</div>  <!-- margin-top: 1rem -->
  <div>Item 3</div>  <!-- margin-top: 1rem -->
</div>

<!-- Horizontal spacing -->
<div class="space-x-4">
  <span>Tag 1</span>
  <span>Tag 2</span>
  <span>Tag 3</span>
</div>

<!-- Reverse (for row-reverse / col-reverse) -->
<div class="flex flex-row-reverse space-x-reverse space-x-4">
  <span>Item</span>
  <span>Item</span>
</div>

<!-- Negative space -->
<div class="-space-y-4">
  <!-- Overlapping stacked cards -->
</div>
```

**Note:** `space-*` uses `:where` selector and does not work with hidden/first-child pseudo-classes well. Prefer `gap` in flex/grid containers when possible.

## Gap

```html
<!-- See also grid.md and flexbox.md -->
<div class="gap-4">       <!-- gap: 1rem -->
<div class="gap-x-4">     <!-- column-gap: 1rem -->
<div class="gap-y-4">     <!-- row-gap: 1rem -->
```

## Size (Width & Height Combined)

```html
<div class="size-4">      <!-- width: 1rem; height: 1rem -->
<div class="size-full">   <!-- width: 100%; height: 100% -->
<div class="size-auto">   <!-- width: auto; height: auto -->
<div class="size-min">    <!-- width: min-content; height: min-content -->
<div class="size-max">    <!-- width: max-content; height: max-content -->
<div class="size-fit">    <!-- width: fit-content; height: fit-content -->
<div class="size-[100px]"> <!-- width: 100px; height: 100px -->
```

## Logical Sizing

```html
<div class="block-size-4">     <!-- block-size: 1rem (height in LTR) -->
<div class="inline-size-4">   <!-- inline-size: 1rem (width in LTR) -->
```

## Common Patterns

### Stack Layout

```html
<div class="flex flex-col gap-4">
  <div>Header</div>
  <div>Content</div>
  <div>Footer</div>
</div>

<!-- Or with space-y (non-flex) -->
<div class="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Card Padding Pattern

```html
<div class="p-4 sm:p-6 lg:p-8">
  <!-- Increases padding at larger breakpoints -->
</div>
```

### Responsive Spacing

```html
<div class="m-2 md:m-4 lg:m-8">
  <!-- margin increases with breakpoint -->
</div>
```

### Prose Spacing (Typography)

```html
<article class="prose prose-slate max-w-none">
  <!-- @tailwindcss/typography plugin -->
</article>
```
