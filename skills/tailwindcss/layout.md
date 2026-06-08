# Layout (Tailwind CSS)

## Display

```html
<div class="block">       <!-- display: block -->
<div class="inline">      <!-- display: inline -->
<div class="inline-block"> <!-- display: inline-block -->
<div class="flex">        <!-- display: flex -->
<div class="inline-flex">  <!-- display: inline-flex -->
<div class="grid">        <!-- display: grid -->
<div class="inline-grid">  <!-- display: inline-grid -->
<div class="hidden">      <!-- display: none -->
<div class="contents">     <!-- display: contents -->
<div class="table">       <!-- display: table -->
<div class="table-row">    <!-- display: table-row -->
<div class="table-cell">   <!-- display: table-cell -->
```

## Position

```html
<div class="static">      <!-- position: static (default) -->
<div class="relative">     <!-- position: relative -->
<div class="absolute">     <!-- position: absolute -->
<div class="fixed">        <!-- position: fixed -->
<div class="sticky">       <!-- position: sticky -->
```

### Inset (top/right/bottom/left)

```html
<div class="inset-0">         <!-- inset: 0 (all sides) -->
<div class="inset-x-4">       <!-- left/right: 1rem -->
<div class="inset-y-4">       <!-- top/bottom: 1rem -->
<div class="top-0">           <!-- top: 0 -->
<div class="right-4">         <!-- right: 1rem -->
<div class="bottom-8">        <!-- bottom: 2rem -->
<div class="left-1/2">        <!-- left: 50% -->
<div class="-top-2">          <!-- top: -0.5rem -->
<div class="top-[100px]">     <!-- top: 100px (arbitrary) -->
```

### Logical Properties

```html
<div class="start-4">         <!-- inset-inline-start: 1rem -->
<div class="end-4">           <!-- inset-inline-end: 1rem -->
<div class="inset-inline-4">   <!-- inset-inline: 1rem -->
<div class="inset-block-4">    <!-- inset-block: 1rem -->
```

## Z-Index

```html
<div class="z-0">    <!-- z-index: 0 -->
<div class="z-10">   <!-- z-index: 10 -->
<div class="z-20">   <!-- z-index: 20 -->
<div class="z-30">   <!-- z-index: 30 -->
<div class="z-40">   <!-- z-index: 40 -->
<div class="z-50">   <!-- z-index: 50 -->
<div class="z-auto"> <!-- z-index: auto -->
<div class="z-[999]"> <!-- z-index: 999 (arbitrary) -->
```

## Overflow

```html
<div class="overflow-auto">      <!-- overflow: auto -->
<div class="overflow-hidden">    <!-- overflow: hidden -->
<div class="overflow-visible">   <!-- overflow: visible -->
<div class="overflow-scroll">    <!-- overflow: scroll -->
<div class="overflow-x-auto">    <!-- overflow-x: auto -->
<div class="overflow-y-hidden">  <!-- overflow-y: hidden -->
```

### Text Overflow

```html
<p class="truncate">           <!-- text-overflow: ellipsis; white-space: nowrap; overflow: hidden -->
<p class="text-ellipsis">       <!-- text-overflow: ellipsis -->
<p class="text-clip">           <!-- text-overflow: clip -->
<p class="text-wrap">           <!-- text-wrap: wrap -->
<p class="text-nowrap">        <!-- text-wrap: nowrap -->
<p class="text-balance">        <!-- text-wrap: balance -->
```

## Visibility

```html
<div class="visible">      <!-- visibility: visible -->
<div class="invisible">    <!-- visibility: hidden -->
<div class="collapse">     <!-- visibility: collapse (tables) -->
```

## Container

```html
<!-- Centered container with max-width -->
<div class="container mx-auto">  <!-- max-width at breakpoints, centered -->

<!-- Without centering -->
<div class="container">  <!-- max-width only -->
```

### Container Max Widths

| Class | Max Width |
|-------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

## Object Fit & Position

```html
<img class="object-cover" />     <!-- object-fit: cover -->
<img class="object-contain" />   <!-- object-fit: contain -->
<img class="object-fill" />      <!-- object-fit: fill -->
<img class="object-none" />      <!-- object-fit: none -->
<img class="object-scale-down" /> <!-- object-fit: scale-down -->

<img class="object-center" />    <!-- object-position: center -->
<img class="object-top" />       <!-- object-position: top -->
<img class="object-bottom" />    <!-- object-position: bottom -->
<img class="object-left" />      <!-- object-position: left -->
<img class="object-right" />     <!-- object-position: right -->
<img class="object-[top_25%]" /> <!-- object-position: top 25% -->
```

## Aspect Ratio

```html
<div class="aspect-auto">    <!-- aspect-ratio: auto -->
<div class="aspect-square">  <!-- aspect-ratio: 1 / 1 -->
<div class="aspect-video">   <!-- aspect-ratio: 16 / 9 -->
<div class="aspect-[4/3]">   <!-- aspect-ratio: 4 / 3 -->
<div class="aspect-[9/16]">  <!-- aspect-ratio: 9 / 16 -->
```

## Columns

```html
<div class="columns-2">      <!-- columns: 2 -->
<div class="columns-3">      <!-- columns: 3 -->
<div class="columns-auto">   <!-- columns: auto -->
<div class="columns-xs">     <!-- columns: 20rem -->
<div class="columns-sm">     <!-- columns: 24rem -->
<div class="columns-lg">     <!-- columns: 32rem -->
<div class="columns-[250px]"> <!-- columns: 250px -->

<!-- Column rules -->
<div class="column-rule-solid">     <!-- column-rule-style: solid -->
<div class="column-rule-blue-300">   <!-- column-rule-color: ... -->
```

## Break Inside/After/Before

```html
<div class="break-inside-auto">     <!-- break-inside: auto -->
<div class="break-inside-avoid">    <!-- break-inside: avoid -->
<div class="break-after-auto">      <!-- break-after: auto -->
<div class="break-after-column">    <!-- break-after: column -->
<div class="break-before-auto">     <!-- break-before: auto -->
```

## Box Decoration Break

```html
<span class="box-decoration-slice">  <!-- box-decoration-break: slice -->
<span class="box-decoration-clone">  <!-- box-decoration-break: clone -->
```

## Isolation

```html
<div class="isolate">        <!-- isolation: isolate (new stacking context) -->
<div class="isolation-auto">  <!-- isolation: auto -->
```

## Clear & Float

```html
<div class="float-start">    <!-- float: inline-start -->
<div class="float-end">      <!-- float: inline-end -->
<div class="float-left">     <!-- float: left -->
<div class="float-right">    <!-- float: right -->
<div class="float-none">     <!-- float: none -->
<div class="clear-start">    <!-- clear: inline-start -->
<div class="clear-end">      <!-- clear: inline-end -->
<div class="clear-left">     <!-- clear: left -->
<div class="clear-right">    <!-- clear: right -->
<div class="clear-both">     <!-- clear: both -->
<div class="clear-none">     <!-- clear: none -->
```
