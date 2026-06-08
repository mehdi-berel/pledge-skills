# Grid (Tailwind CSS)

## Grid Template Columns

```html
<div class="grid-cols-1">        <!-- grid-template-columns: repeat(1, minmax(0, 1fr)) -->
<div class="grid-cols-2">        <!-- grid-template-columns: repeat(2, minmax(0, 1fr)) -->
<div class="grid-cols-3">        <!-- 3 columns -->
<div class="grid-cols-4">        <!-- 4 columns -->
<div class="grid-cols-5">        <!-- 5 columns -->
<div class="grid-cols-6">        <!-- 6 columns -->
<div class="grid-cols-7">        <!-- 7 columns -->
<div class="grid-cols-8">        <!-- 8 columns -->
<div class="grid-cols-9">        <!-- 9 columns -->
<div class="grid-cols-10">       <!-- 10 columns -->
<div class="grid-cols-11">       <!-- 11 columns -->
<div class="grid-cols-12">       <!-- 12 columns -->
<div class="grid-cols-none">     <!-- grid-template-columns: none -->
<div class="grid-cols-subgrid">  <!-- grid-template-columns: subgrid -->

<!-- Arbitrary -->
<div class="grid-cols-[200px_1fr]">     <!-- 200px + remaining space -->
<div class="grid-cols-[repeat(3,1fr)]"> <!-- same as grid-cols-3 -->
<div class="grid-cols-[auto_1fr_auto]"> <!-- auto-size + flex + auto-size -->
```

## Grid Template Rows

```html
<div class="grid-rows-1">
<div class="grid-rows-2">
<div class="grid-rows-3">
<div class="grid-rows-4">
<div class="grid-rows-5">
<div class="grid-rows-6">
<div class="grid-rows-none">     <!-- grid-template-rows: none -->
<div class="grid-rows-subgrid">  <!-- grid-template-rows: subgrid -->
<div class="grid-rows-[200px_1fr]">
```

## Grid Column (Span / Start / End)

```html
<!-- Span -->
<div class="col-span-1">   <!-- grid-column: span 1 / span 1 -->
<div class="col-span-2">   <!-- grid-column: span 2 / span 2 -->
<div class="col-span-full"> <!-- grid-column: 1 / -1 (full width) -->
<div class="col-span-auto"> <!-- grid-column: auto -->
<div class="col-span-[7]">  <!-- grid-column: span 7 -->

<!-- Start/End -->
<div class="col-start-1">  <!-- grid-column-start: 1 -->
<div class="col-start-2">
<div class="col-start-auto">
<div class="col-end-3">    <!-- grid-column-end: 3 -->
<div class="col-end-auto">
<div class="col-start-[line2]">  <!-- named grid line -->
```

## Grid Row (Span / Start / End)

```html
<div class="row-span-1">
<div class="row-span-2">
<div class="row-span-full">   <!-- grid-row: 1 / -1 -->
<div class="row-span-auto">
<div class="row-span-[3]">

<div class="row-start-1">
<div class="row-start-auto">
<div class="row-end-3">
<div class="row-end-auto">
```

## Grid Auto Flow

```html
<div class="grid-flow-row">        <!-- grid-auto-flow: row (default) -->
<div class="grid-flow-col">        <!-- grid-auto-flow: column -->
<div class="grid-flow-dense">      <!-- grid-auto-flow: dense -->
<div class="grid-flow-row-dense">  <!-- grid-auto-flow: row dense -->
<div class="grid-flow-col-dense">  <!-- grid-auto-flow: column dense -->
```

## Grid Auto Columns

```html
<div class="auto-cols-auto">     <!-- grid-auto-columns: auto -->
<div class="auto-cols-min">      <!-- grid-auto-columns: min-content -->
<div class="auto-cols-max">      <!-- grid-auto-columns: max-content -->
<div class="auto-cols-fr">       <!-- grid-auto-columns: minmax(0, 1fr) -->
```

## Grid Auto Rows

```html
<div class="auto-rows-auto">     <!-- grid-auto-rows: auto -->
<div class="auto-rows-min">      <!-- grid-auto-rows: min-content -->
<div class="auto-rows-max">      <!-- grid-auto-rows: max-content -->
<div class="auto-rows-fr">       <!-- grid-auto-rows: minmax(0, 1fr) -->
```

## Common Patterns

### Auto-Fit Responsive Grid

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <div>Item</div>
  <div>Item</div>
  <!-- ... -->
</div>
```

### Sidebar + Main Content

```html
<div class="grid grid-cols-[250px_1fr] gap-4">
  <aside>Sidebar</aside>
  <main>Main content</main>
</div>
```

### Masonry / Bento Grid

```html
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-2 row-span-2">Large</div>
  <div>Small</div>
  <div>Small</div>
  <div class="col-span-3">Wide</div>
</div>
```

### Header + Sidebar + Content + Footer

```html
<div class="grid grid-cols-[200px_1fr] grid-rows-[auto_1fr_auto] min-h-screen">
  <header class="col-span-2">Header</header>
  <aside>Sidebar</aside>
  <main>Content</main>
  <footer class="col-span-2">Footer</footer>
</div>
```

### Named Grid Lines

```css
@layer components {
  .layout {
    grid-template-columns: [sidebar-start] 250px [sidebar-end main-start] 1fr [main-end];
  }
}
```

```html
<div class="layout grid gap-4">
  <aside class="col-[sidebar-start_/_sidebar-end]">Sidebar</aside>
  <main class="col-[main-start_/_main-end]">Content</main>
</div>
```

## Gap (Grid)

```html
<div class="grid grid-cols-3 gap-4">
  <!-- gap: 1rem between all items -->
</div>

<div class="grid grid-cols-3 gap-x-4 gap-y-2">
  <!-- horizontal: 1rem, vertical: 0.5rem -->
</div>
```

## Place Items / Content / Self

```html
<!-- Place items (shortcut for align + justify items) -->
<div class="place-items-start">    <!-- place-items: start -->
<div class="place-items-end">      <!-- place-items: end -->
<div class="place-items-center">   <!-- place-items: center -->
<div class="place-items-stretch">  <!-- place-items: stretch -->

<!-- Place content -->
<div class="place-content-center">    <!-- place-content: center -->
<div class="place-content-between">     <!-- place-content: space-between -->
<div class="place-content-around">      <!-- place-content: space-around -->
<div class="place-content-evenly">     <!-- place-content: space-evenly -->
<div class="place-content-stretch">    <!-- place-content: stretch -->

<!-- Place self (individual item) -->
<div class="place-self-auto">     <!-- place-self: auto -->
<div class="place-self-start">    <!-- place-self: start -->
<div class="place-self-end">      <!-- place-self: end -->
<div class="place-self-center">   <!-- place-self: center -->
<div class="place-self-stretch">  <!-- place-self: stretch -->
```

## Subgrid

```html
<div class="grid grid-cols-3">
  <div class="grid grid-cols-subgrid col-span-3">
    <!-- Inherits 3 columns from parent -->
    <div>Col 1</div>
    <div>Col 2</div>
    <div>Col 3</div>
  </div>
</div>
```
