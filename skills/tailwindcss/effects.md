# Effects (Tailwind CSS)

## Box Shadow

```html
<div class="shadow-sm">       <!-- 0 1px 2px 0 rgb(0 0 0 / 0.05) -->
<div class="shadow">          <!-- 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) -->
<div class="shadow-md">       <!-- 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) -->
<div class="shadow-lg">       <!-- 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) -->
<div class="shadow-xl">       <!-- 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) -->
<div class="shadow-2xl">      <!-- 0 25px 50px -12px rgb(0 0 0 / 0.25) -->
<div class="shadow-inner">    <!-- inset 0 2px 4px 0 rgb(0 0 0 / 0.05) -->
<div class="shadow-none">     <!-- none -->

<!-- Colored shadows -->
<div class="shadow-lg shadow-blue-500/50">

<!-- Inset shadows (v4) -->
<div class="inset-shadow-sm">
<div class="inset-shadow">
<div class="inset-shadow-md">
```

## Opacity

```html
<div class="opacity-0">       <!-- opacity: 0 -->
<div class="opacity-5">       <!-- opacity: 0.05 -->
<div class="opacity-10">      <!-- opacity: 0.1 -->
<div class="opacity-20">      <!-- opacity: 0.2 -->
<div class="opacity-25">      <!-- opacity: 0.25 -->
<div class="opacity-30">      <!-- opacity: 0.3 -->
<div class="opacity-40">      <!-- opacity: 0.4 -->
<div class="opacity-50">      <!-- opacity: 0.5 -->
<div class="opacity-60">      <!-- opacity: 0.6 -->
<div class="opacity-70">      <!-- opacity: 0.7 -->
<div class="opacity-75">      <!-- opacity: 0.75 -->
<div class="opacity-80">      <!-- opacity: 0.8 -->
<div class="opacity-90">      <!-- opacity: 0.9 -->
<div class="opacity-95">      <!-- opacity: 0.95 -->
<div class="opacity-100">     <!-- opacity: 1 -->
```

## Mix Blend Mode

```html
<div class="mix-blend-normal">
<div class="mix-blend-multiply">
<div class="mix-blend-screen">
<div class="mix-blend-overlay">
<div class="mix-blend-darken">
<div class="mix-blend-lighten">
<div class="mix-blend-color-dodge">
<div class="mix-blend-color-burn">
<div class="mix-blend-hard-light">
<div class="mix-blend-soft-light">
<div class="mix-blend-difference">
<div class="mix-blend-exclusion">
<div class="mix-blend-hue">
<div class="mix-blend-saturation">
<div class="mix-blend-color">
<div class="mix-blend-luminosity">
<div class="mix-blend-plus-darker">
<div class="mix-blend-plus-lighter">
```

## Background Blend Mode

```html
<div class="bg-blend-normal">
<div class="bg-blend-multiply">
<div class="bg-blend-screen">
<div class="bg-blend-overlay">
<div class="bg-blend-darken">
<div class="bg-blend-lighten">
<div class="bg-blend-color-dodge">
<div class="bg-blend-color-burn">
<div class="bg-blend-hard-light">
<div class="bg-blend-soft-light">
<div class="bg-blend-difference">
<div class="bg-blend-exclusion">
<div class="bg-blend-hue">
<div class="bg-blend-saturation">
<div class="bg-blend-color">
<div class="bg-blend-luminosity">
```

## Drop Shadow (Filter)

```html
<div class="drop-shadow-sm">
<div class="drop-shadow">        <!-- drop-shadow: 0 1px 2px rgb(0 0 0 / 0.1) -->
<div class="drop-shadow-md">
<div class="drop-shadow-lg">
<div class="drop-shadow-xl">
<div class="drop-shadow-2xl">
<div class="drop-shadow-none">

<!-- Colored -->
<div class="drop-shadow-lg drop-shadow-blue-500/20">
```

## Filters

### Blur

```html
<div class="blur-none">
<div class="blur-sm">
<div class="blur">             <!-- blur: 8px -->
<div class="blur-md">
<div class="blur-lg">
<div class="blur-xl">
<div class="blur-2xl">
<div class="blur-3xl">
<div class="blur-[10px]">
```

### Brightness

```html
<div class="brightness-0">
<div class="brightness-50">
<div class="brightness-75">
<div class="brightness-90">
<div class="brightness-95">
<div class="brightness-100">
<div class="brightness-105">
<div class="brightness-110">
<div class="brightness-125">
<div class="brightness-150">
<div class="brightness-200">
```

### Contrast

```html
<div class="contrast-0">
<div class="contrast-50">
<div class="contrast-75">
<div class="contrast-100">
<div class="contrast-125">
<div class="contrast-150">
<div class="contrast-200">
```

### Grayscale

```html
<div class="grayscale-0">
<div class="grayscale">         <!-- grayscale: 100% -->
```

### Hue Rotate

```html
<div class="hue-rotate-0">
<div class="hue-rotate-15">
<div class="hue-rotate-30">
<div class="hue-rotate-60">
<div class="hue-rotate-90">
<div class="hue-rotate-180">
```

### Invert

```html
<div class="invert-0">
<div class="invert">            <!-- invert: 100% -->
```

### Saturate

```html
<div class="saturate-0">
<div class="saturate-50">
<div class="saturate-100">
<div class="saturate-150">
<div class="saturate-200">
```

### Sepia

```html
<div class="sepia-0">
<div class="sepia">             <!-- sepia: 100% -->
```

## Backdrop Filters

```html
<div class="backdrop-blur-none">
<div class="backdrop-blur-sm">
<div class="backdrop-blur">      <!-- backdrop-filter: blur(8px) -->
<div class="backdrop-blur-md">
<div class="backdrop-blur-lg">
<div class="backdrop-blur-xl">
<div class="backdrop-blur-2xl">
<div class="backdrop-blur-3xl">

<div class="backdrop-brightness-90">
<div class="backdrop-contrast-125">
<div class="backdrop-grayscale">
<div class="backdrop-hue-rotate-90">
<div class="backdrop-invert">
<div class="backdrop-opacity-50">
<div class="backdrop-saturate-150">
<div class="backdrop-sepia">
```

## Common Patterns

### Glassmorphism

```html
<div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg">
  Glass card content
</div>
```

### Image Overlay

```html
<div class="relative">
  <img src="..." class="brightness-50" />
  <div class="absolute inset-0 flex items-center justify-center">
    <h1 class="text-white text-4xl font-bold">Overlay Text</h1>
  </div>
</div>
```

### Skeleton Loading

```html
<div class="animate-pulse">
  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
  <div class="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
</div>
```

### Focused Image Effect

```html
<img class="hover:scale-105 hover:brightness-110 transition-all duration-300" src="..." />
```
