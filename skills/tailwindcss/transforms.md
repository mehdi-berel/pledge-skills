# Transforms (Tailwind CSS)

## Transform Origin

```html
<div class="origin-center">     <!-- transform-origin: center (default) -->
<div class="origin-top">
<div class="origin-top-right">
<div class="origin-right">
<div class="origin-bottom-right">
<div class="origin-bottom">
<div class="origin-bottom-left">
<div class="origin-left">
<div class="origin-top-left">
<div class="origin-[33%_75%]">
```

## Scale

```html
<div class="scale-0">        <!-- scale: 0 -->
<div class="scale-50">       <!-- scale: 0.5 -->
<div class="scale-75">       <!-- scale: 0.75 -->
<div class="scale-90">       <!-- scale: 0.9 -->
<div class="scale-95">       <!-- scale: 0.95 -->
<div class="scale-100">      <!-- scale: 1 (default) -->
<div class="scale-105">      <!-- scale: 1.05 -->
<div class="scale-110">      <!-- scale: 1.1 -->
<div class="scale-125">      <!-- scale: 1.25 -->
<div class="scale-150">      <!-- scale: 1.5 -->

<!-- Individual axes -->
<div class="scale-x-50">     <!-- scaleX: 0.5 -->
<div class="scale-y-50">     <!-- scaleY: 0.5 -->
<div class="scale-x-[-1]">  <!-- scaleX: -1 (mirror horizontally) -->
```

## Rotate

```html
<div class="rotate-0">
<div class="rotate-1">       <!-- rotate: 1deg -->
<div class="rotate-2">
<div class="rotate-3">
<div class="rotate-6">
<div class="rotate-12">
<div class="rotate-45">
<div class="rotate-90">
<div class="rotate-180">

<!-- Negative -->
<div class="-rotate-45">
<div class="-rotate-90">

<!-- Arbitrary -->
<div class="rotate-[17deg]">
<div class="rotate-[0.5turn]">
```

## Translate

```html
<!-- X axis -->
<div class="translate-x-0">
<div class="translate-x-1">     <!-- translateX: 0.25rem -->
<div class="translate-x-4">
<div class="translate-x-1/2">   <!-- translateX: 50% -->
<div class="translate-x-full">  <!-- translateX: 100% -->
<div class="-translate-x-1/2">  <!-- translateX: -50% -->

<!-- Y axis -->
<div class="translate-y-0">
<div class="translate-y-4">
<div class="translate-y-1/2">
<div class="translate-y-full">
<div class="-translate-y-1/2">

<!-- Percentages -->
<div class="translate-x-1/3">
<div class="translate-x-2/3">
<div class="translate-x-1/4">
<div class="translate-x-3/4">

<!-- Arbitrary -->
<div class="translate-x-[100px]">
<div class="translate-y-[calc(100%+1rem)]">
```

## Skew

```html
<div class="skew-x-0">
<div class="skew-x-1">       <!-- skewX: 1deg -->
<div class="skew-x-2">
<div class="skew-x-3">
<div class="skew-x-6">
<div class="skew-x-12">
<div class="-skew-x-12">

<div class="skew-y-0">
<div class="skew-y-1">
<div class="skew-y-3">
<div class="skew-y-6">
<div class="skew-y-12">
```

## Perspective

```html
<div class="perspective-none">    <!-- perspective: none (default) -->
<div class="perspective-dramatic"> <!-- perspective: 100px -->
<div class="perspective-near">    <!-- perspective: 300px -->
<div class="perspective-normal">   <!-- perspective: 500px -->
<div class="perspective-midrange"> <!-- perspective: 800px -->
<div class="perspective-distant">  <!-- perspective: 1200px -->
<div class="perspective-[2000px]">
```

## Perspective Origin

```html
<div class="perspective-origin-center">
<div class="perspective-origin-top">
<div class="perspective-origin-top-right">
<div class="perspective-origin-right">
<div class="perspective-origin-bottom-right">
<div class="perspective-origin-bottom">
<div class="perspective-origin-bottom-left">
<div class="perspective-origin-left">
<div class="perspective-origin-top-left">
```

## Common Patterns

### Center Absolute Element

```html
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  Perfectly centered
</div>
```

### Hover Scale Card

```html
<div class="hover:scale-105 transition-transform duration-300">
  Card content
</div>
```

### Badge with Negative Translate

```html
<span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
  3
</span>
```

### Slideshow Slide

```html
<div class="translate-x-0 transition-transform duration-500">
  Slide 1
</div>
<div class="translate-x-full">
  Slide 2
</div>
```

### 3D Card Flip

```html
<div class="group perspective-normal">
  <div class="relative transition-transform duration-700 preserve-3d group-hover:rotate-y-180">
    <div class="backface-hidden">Front</div>
    <div class="absolute inset-0 rotate-y-180 backface-hidden">Back</div>
  </div>
</div>
```

### Tooltip Arrow

```html
<div class="relative">
  Tooltip content
  <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-800 rotate-45"></div>
</div>
```

### Image Gallery Zoom

```html
<div class="overflow-hidden rounded-lg">
  <img class="hover:scale-110 transition-transform duration-500" src="..." />
</div>
```
