# Borders (Tailwind CSS)

## Border Radius

```html
<div class="rounded-none">    <!-- border-radius: 0 -->
<div class="rounded-sm">      <!-- border-radius: 0.125rem -->
<div class="rounded">         <!-- border-radius: 0.25rem -->
<div class="rounded-md">      <!-- border-radius: 0.375rem -->
<div class="rounded-lg">      <!-- border-radius: 0.5rem -->
<div class="rounded-xl">      <!-- border-radius: 0.75rem -->
<div class="rounded-2xl">     <!-- border-radius: 1rem -->
<div class="rounded-3xl">     <!-- border-radius: 1.5rem -->
<div class="rounded-full">    <!-- border-radius: 9999px -->

<!-- Individual corners -->
<div class="rounded-t-lg">    <!-- top -->
<div class="rounded-r-lg">    <!-- right -->
<div class="rounded-b-lg">    <!-- bottom -->
<div class="rounded-l-lg">    <!-- left -->
<div class="rounded-tl-lg">   <!-- top-left -->
<div class="rounded-tr-lg">   <!-- top-right -->
<div class="rounded-br-lg">   <!-- bottom-right -->
<div class="rounded-bl-lg">   <!-- bottom-left -->

<!-- Logical corners -->
<div class="rounded-s-lg">    <!-- start -->
<div class="rounded-e-lg">    <!-- end -->
<div class="rounded-ts-lg">   <!-- top-start -->
<div class="rounded-te-lg">   <!-- top-end -->
<div class="rounded-bs-lg">   <!-- bottom-start -->
<div class="rounded-be-lg">   <!-- bottom-end -->

<!-- Arbitrary -->
<div class="rounded-[2rem]">
<div class="rounded-t-[1rem]">
```

## Border Width

```html
<div class="border-0">        <!-- border-width: 0px -->
<div class="border-2">        <!-- border-width: 2px -->
<div class="border-4">        <!-- border-width: 4px -->
<div class="border-8">        <!-- border-width: 8px -->
<div class="border">          <!-- border-width: 1px (default) -->

<!-- Individual sides -->
<div class="border-t-2">      <!-- border-top-width -->
<div class="border-r-2">      <!-- border-right-width -->
<div class="border-b-2">      <!-- border-bottom-width -->
<div class="border-l-2">      <!-- border-left-width -->

<!-- Logical sides -->
<div class="border-s-2">      <!-- border-inline-start -->
<div class="border-e-2">      <!-- border-inline-end -->
<div class="border-x-2">      <!-- border-left + border-right -->
<div class="border-y-2">      <!-- border-top + border-bottom -->
```

## Border Color

```html
<div class="border-red-500">
<div class="border-blue-500/50">   <!-- with opacity -->
<div class="border-current">
<div class="border-transparent">
<div class="border-inherit">
<div class="border-[#0ea5e9]">      <!-- arbitrary -->
```

## Border Style

```html
<div class="border-solid">    <!-- border-style: solid -->
<div class="border-dashed">   <!-- border-style: dashed -->
<div class="border-dotted">   <!-- border-style: dotted -->
<div class="border-double">   <!-- border-style: double -->
<div class="border-hidden">   <!-- border-style: hidden -->
<div class="border-none">     <!-- border-style: none -->
```

## Outline

```html
<div class="outline-none">    <!-- outline: 2px solid transparent; outline-offset: 2px -->
<div class="outline">         <!-- outline-style: solid -->
<div class="outline-dashed">  <!-- outline-style: dashed -->
<div class="outline-dotted">  <!-- outline-style: dotted -->
<div class="outline-double">  <!-- outline-style: double -->
<div class="outline-hidden">  <!-- outline-style: none -->

<!-- Outline width -->
<div class="outline-0">
<div class="outline-1">
<div class="outline-2">
<div class="outline-4">
<div class="outline-8">

<!-- Outline color -->
<div class="outline-red-500">
<div class="outline-[#0ea5e9]">

<!-- Outline offset -->
<div class="outline-offset-0">
<div class="outline-offset-2">
<div class="outline-offset-4">
<div class="outline-offset-8">
<div class="outline-offset-[3px]">
```

## Ring (Focus Ring)

```html
<!-- Ring width -->
<div class="ring-0">
<div class="ring-1">
<div class="ring-2">          <!-- box-shadow: 0 0 0 2px ... -->
<div class="ring-4">
<div class="ring-8">
<div class="ring">            <!-- ring-width: 3px (default) -->

<!-- Ring color -->
<div class="ring-red-500">
<div class="ring-blue-500/50">
<div class="ring-inset">      <!-- ring inset -->

<!-- Ring offset -->
<div class="ring-offset-0">
<div class="ring-offset-2">
<div class="ring-offset-4">
<div class="ring-offset-8">

<!-- Ring offset color -->
<div class="ring-offset-white">
<div class="ring-offset-transparent">
```

### Focus Ring Pattern

```html
<input class="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" />

<!-- Or using the native ring -->
<input class="focus:ring-2 focus:ring-blue-500" />
```

## Divide (Border Between Siblings)

```html
<!-- Horizontal divide -->
<div class="divide-y divide-gray-200">
  <div>Item 1</div>
  <div>Item 2</div>  <!-- gets border-top -->
  <div>Item 3</div>  <!-- gets border-top -->
</div>

<!-- Vertical divide -->
<div class="divide-x divide-gray-200">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- With opacity -->
<div class="divide-y divide-gray-200/50">

<!-- Reversed for flex-row-reverse -->
<div class="flex flex-row-reverse divide-x-reverse divide-x divide-gray-200">
```

## Box Decoration Break

```html
<span class="box-decoration-slice">   <!-- box-decoration-break: slice (default) -->
<span class="box-decoration-clone">   <!-- box-decoration-break: clone -->
```

## Common Patterns

### Card with Border

```html
<div class="border border-gray-200 rounded-lg p-4">
  Card content
</div>
```

### Button with Ring on Focus

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded-md
  hover:bg-blue-600
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  active:bg-blue-700
  disabled:opacity-50 disabled:cursor-not-allowed">
  Click me
</button>
```

### Avatar Ring

```html
<img class="w-10 h-10 rounded-full ring-2 ring-white" src="..." />
```

### Status Indicator

```html
<span class="relative flex h-3 w-3">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
</span>
```
