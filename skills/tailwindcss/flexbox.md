# Flexbox (Tailwind CSS)

## Flex Direction

```html
<div class="flex-row">         <!-- flex-direction: row (default) -->
<div class="flex-row-reverse">  <!-- flex-direction: row-reverse -->
<div class="flex-col">          <!-- flex-direction: column -->
<div class="flex-col-reverse">  <!-- flex-direction: column-reverse -->
```

## Flex Wrap

```html
<div class="flex-wrap">         <!-- flex-wrap: wrap -->
<div class="flex-wrap-reverse">  <!-- flex-wrap: wrap-reverse -->
<div class="flex-nowrap">       <!-- flex-wrap: nowrap (default) -->
```

## Justify Content

```html
<div class="justify-start">     <!-- justify-content: flex-start (default) -->
<div class="justify-end">       <!-- justify-content: flex-end -->
<div class="justify-center">    <!-- justify-content: center -->
<div class="justify-between">   <!-- justify-content: space-between -->
<div class="justify-around">    <!-- justify-content: space-around -->
<div class="justify-evenly">    <!-- justify-content: space-evenly -->
<div class="justify-stretch">   <!-- justify-content: stretch -->
<div class="justify-normal">    <!-- justify-content: normal -->
```

## Align Content (Multi-line)

```html
<div class="content-start">     <!-- align-content: flex-start -->
<div class="content-end">       <!-- align-content: flex-end -->
<div class="content-center">    <!-- align-content: center -->
<div class="content-between">   <!-- align-content: space-between -->
<div class="content-around">    <!-- align-content: space-around -->
<div class="content-evenly">    <!-- align-content: space-evenly -->
<div class="content-stretch">   <!-- align-content: stretch (default) -->
<div class="content-baseline">  <!-- align-content: baseline -->
```

## Align Items (Single Line)

```html
<div class="items-start">       <!-- align-items: flex-start -->
<div class="items-end">         <!-- align-items: flex-end -->
<div class="items-center">      <!-- align-items: center -->
<div class="items-baseline">    <!-- align-items: baseline -->
<div class="items-stretch">     <!-- align-items: stretch (default) -->
```

## Align Self (Individual Item)

```html
<div class="self-auto">         <!-- align-self: auto (default) -->
<div class="self-start">        <!-- align-self: flex-start -->
<div class="self-end">          <!-- align-self: flex-end -->
<div class="self-center">       <!-- align-self: center -->
<div class="self-stretch">      <!-- align-self: stretch -->
<div class="self-baseline">     <!-- align-self: baseline -->
```

## Flex (Grow, Shrink, Basis)

```html
<div class="flex-1">            <!-- flex: 1 1 0% -->
<div class="flex-auto">         <!-- flex: 1 1 auto -->
<div class="flex-initial">      <!-- flex: 0 1 auto (default) -->
<div class="flex-none">         <!-- flex: none -->

<!-- Grow only -->
<div class="grow">              <!-- flex-grow: 1 -->
<div class="grow-0">            <!-- flex-grow: 0 -->

<!-- Shrink only -->
<div class="shrink">            <!-- flex-shrink: 1 (default) -->
<div class="shrink-0">          <!-- flex-shrink: 0 -->

<!-- Basis -->
<div class="basis-0">           <!-- flex-basis: 0px -->
<div class="basis-1/2">         <!-- flex-basis: 50% -->
<div class="basis-full">        <!-- flex-basis: 100% -->
<div class="basis-auto">        <!-- flex-basis: auto -->
<div class="basis-[200px]">    <!-- flex-basis: 200px -->
```

## Order

```html
<div class="order-1">           <!-- order: 1 -->
<div class="order-2">           <!-- order: 2 -->
<div class="order-first">       <!-- order: -9999 -->
<div class="order-last">        <!-- order: 9999 -->
<div class="order-none">        <!-- order: 0 (default) -->
<div class="order-[5]">         <!-- order: 5 -->
```

## Gap

```html
<div class="gap-4">             <!-- gap: 1rem -->
<div class="gap-x-4">           <!-- column-gap: 1rem -->
<div class="gap-y-2">           <!-- row-gap: 0.5rem -->
```

See `spacing.md` for full gap scale.

## Common Patterns

### Center Everything

```html
<div class="flex items-center justify-center min-h-screen">
  <div>Centered content</div>
</div>
```

### Sidebar Layout

```html
<div class="flex">
  <aside class="w-64 shrink-0">Sidebar</aside>
  <main class="flex-1">Main content</main>
</div>
```

### Card Grid with Equal Height

```html
<div class="flex gap-4">
  <div class="flex-1 flex flex-col">
    <div class="flex-1">Content that grows</div>
    <button>Action</button>
  </div>
  <div class="flex-1 flex flex-col">
    <div class="flex-1">Different amount of content</div>
    <button>Action</button>
  </div>
</div>
```

### Horizontal Scroll

```html
<div class="flex gap-4 overflow-x-auto snap-x snap-mandatory">
  <div class="snap-center shrink-0 w-80">Card 1</div>
  <div class="snap-center shrink-0 w-80">Card 2</div>
  <div class="snap-center shrink-0 w-80">Card 3</div>
</div>
```

### Sticky Footer

```html
<div class="flex flex-col min-h-screen">
  <header>Header</header>
  <main class="flex-1">Content</main>
  <footer>Footer</footer>
</div>
```

### Navigation with Push Right

```html
<nav class="flex items-center gap-4">
  <a href="/">Logo</a>
  <div class="flex-1"></div>  <!-- Spacer -->
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
```
