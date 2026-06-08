# Sizing (Tailwind CSS)

## Width

```html
<div class="w-0">         <!-- width: 0px -->
<div class="w-px">        <!-- width: 1px -->
<div class="w-0.5">       <!-- width: 0.125rem -->
<div class="w-1">         <!-- width: 0.25rem -->
<div class="w-4">         <!-- width: 1rem -->
<div class="w-64">        <!-- width: 16rem (256px) -->
<div class="w-96">        <!-- width: 24rem (384px) -->
<div class="w-auto">      <!-- width: auto -->
<div class="w-full">      <!-- width: 100% -->
<div class="w-screen">    <!-- width: 100vw -->
<div class="w-dvw">       <!-- width: 100dvw -->
<div class="w-svw">       <!-- width: 100svw -->
<div class="w-lvw">       <!-- width: 100lvw -->
<div class="w-min">       <!-- width: min-content -->
<div class="w-max">       <!-- width: max-content -->
<div class="w-fit">       <!-- width: fit-content -->

<!-- Fractions -->
<div class="w-1/2">       <!-- width: 50% -->
<div class="w-1/3">       <!-- width: 33.333333% -->
<div class="w-2/3">       <!-- width: 66.666667% -->
<div class="w-1/4">       <!-- width: 25% -->
<div class="w-3/4">       <!-- width: 75% -->
<div class="w-1/5">       <!-- width: 20% -->
<div class="w-1/6">       <!-- width: 16.666667% -->
<div class="w-1/12">      <!-- width: 8.333333% -->

<!-- Arbitrary -->
<div class="w-[100px]">
<div class="w-[calc(100%-2rem)]">
<div class="w-[clamp(200px,50%,800px)]">
```

## Height

```html
<div class="h-0">
<div class="h-px">
<div class="h-4">
<div class="h-64">
<div class="h-auto">
<div class="h-full">      <!-- height: 100% -->
<div class="h-screen">    <!-- height: 100vh -->
<div class="h-dvh">       <!-- height: 100dvh -->
<div class="h-svh">       <!-- height: 100svh -->
<div class="h-lvh">       <!-- height: 100lvh -->
<div class="h-min">
<div class="h-max">
<div class="h-fit">

<!-- Fractions (less common for height) -->
<div class="h-1/2">
<div class="h-1/3">
<div class="h-2/3">
<div class="h-1/4">
<div class="h-3/4">
<div class="h-1/5">
<div class="h-1/6">
```

## Min Width

```html
<div class="min-w-0">       <!-- min-width: 0px -->
<div class="min-w-full">    <!-- min-width: 100% -->
<div class="min-w-min">     <!-- min-width: min-content -->
<div class="min-w-max">     <!-- min-width: max-content -->
<div class="min-w-fit">     <!-- min-width: fit-content -->
<div class="min-w-[200px]">
```

## Min Height

```html
<div class="min-h-0">       <!-- min-height: 0px -->
<div class="min-h-full">    <!-- min-height: 100% -->
<div class="min-h-screen">  <!-- min-height: 100vh -->
<div class="min-h-dvh">     <!-- min-height: 100dvh -->
<div class="min-h-svh">     <!-- min-height: 100svh -->
<div class="min-h-lvh">     <!-- min-height: 100lvh -->
<div class="min-h-[100px]">
```

## Max Width

```html
<div class="max-w-0">       <!-- max-width: 0px -->
<div class="max-w-none">    <!-- max-width: none -->
<div class="max-w-xs">      <!-- max-width: 20rem (320px) -->
<div class="max-w-sm">      <!-- max-width: 24rem (384px) -->
<div class="max-w-md">      <!-- max-width: 28rem (448px) -->
<div class="max-w-lg">      <!-- max-width: 32rem (512px) -->
<div class="max-w-xl">      <!-- max-width: 36rem (576px) -->
<div class="max-w-2xl">     <!-- max-width: 42rem (672px) -->
<div class="max-w-3xl">     <!-- max-width: 48rem (768px) -->
<div class="max-w-4xl">     <!-- max-width: 56rem (896px) -->
<div class="max-w-5xl">     <!-- max-width: 64rem (1024px) -->
<div class="max-w-6xl">     <!-- max-width: 72rem (1152px) -->
<div class="max-w-7xl">     <!-- max-width: 80rem (1280px) -->
<div class="max-w-full">    <!-- max-width: 100% -->
<div class="max-w-screen-sm">   <!-- max-width: 640px -->
<div class="max-w-screen-md">   <!-- max-width: 768px -->
<div class="max-w-screen-lg">   <!-- max-width: 1024px -->
<div class="max-w-screen-xl">   <!-- max-width: 1280px -->
<div class="max-w-screen-2xl">  <!-- max-width: 1536px -->
<div class="max-w-prose">       <!-- max-width: 65ch (optimal reading) -->
<div class="max-w-[200px]">
```

## Max Height

```html
<div class="max-h-0">
<div class="max-h-px">
<div class="max-h-none">
<div class="max-h-full">    <!-- max-height: 100% -->
<div class="max-h-screen">  <!-- max-height: 100vh -->
<div class="max-h-dvh">     <!-- max-height: 100dvh -->
<div class="max-h-[200px]">
```

## Logical Sizing

```html
<!-- Block size (logical height) -->
<div class="bs-4">          <!-- block-size: 1rem -->
<div class="bs-full">       <!-- block-size: 100% -->
<div class="min-bs-0">      <!-- min-block-size: 0px -->
<div class="max-bs-full">   <!-- max-block-size: 100% -->

<!-- Inline size (logical width) -->
<div class="is-4">          <!-- inline-size: 1rem -->
<div class="is-full">       <!-- inline-size: 100% -->
<div class="min-is-0">      <!-- min-inline-size: 0px -->
<div class="max-is-full">   <!-- max-inline-size: 100% -->
```

## Aspect Ratio

```html
<div class="aspect-auto">    <!-- aspect-ratio: auto -->
<div class="aspect-square">  <!-- aspect-ratio: 1 / 1 -->
<div class="aspect-video">   <!-- aspect-ratio: 16 / 9 -->
<div class="aspect-[3/2]">   <!-- aspect-ratio: 3 / 2 -->
<div class="aspect-[9/16]">  <!-- aspect-ratio: 9 / 16 -->
```

## Container Queries

```html
<!-- Define container -->
<div class="@container">     <!-- container-type: inline-size -->
<div class="@container/main"> <!-- container-type: inline-size, name: main -->
<div class="@container-size"> <!-- container-type: size -->

<!-- Query based on container width -->
<div class="@md:w-1/2">      <!-- @container (min-width: 28rem) -->
<div class="@lg:w-1/3">      <!-- @container (min-width: 32rem) -->

<!-- Named container queries -->
<div class="@container/main @md/main:p-4">
```

## Box Sizing

```html
<div class="box-border">     <!-- box-sizing: border-box (default) -->
<div class="box-content">    <!-- box-sizing: content-box -->
```

## Common Patterns

### Full Viewport Height

```html
<!-- Use dvh for mobile (accounts for dynamic toolbars) -->
<div class="min-h-dvh flex items-center justify-center">
  <div>Centered content</div>
</div>
```

### Responsive Container

```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Content maxes out at 1280px, centered, with responsive padding -->
</div>
```

### Proportional Image

```html
<div class="aspect-video w-full">
  <img src="..." class="w-full h-full object-cover" />
</div>
```

### Sticky Sidebar with Scroll

```html
<div class="flex min-h-dvh">
  <aside class="w-64 sticky top-0 h-dvh overflow-y-auto">
    Sidebar
  </aside>
  <main class="flex-1">
    Long content...
  </main>
</div>
```
