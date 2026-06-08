# Backgrounds (Tailwind CSS)

## Background Color

```html
<div class="bg-white">
<div class="bg-black">
<div class="bg-red-500">
<div class="bg-blue-600/50">    <!-- with opacity -->
<div class="bg-transparent">
<div class="bg-current">        <!-- currentColor -->
<div class="bg-inherit">
<div class="bg-[#0ea5e9]">     <!-- arbitrary -->
```

## Background Image

```html
<div class="bg-none">         <!-- background-image: none -->
<div class="bg-[url(...)]">    <!-- arbitrary URL -->
<div class="bg-[linear-gradient(...)]">  <!-- arbitrary gradient -->
```

## Background Gradients

```html
<!-- Direction -->
<div class="bg-gradient-to-t">     <!-- to top -->
<div class="bg-gradient-to-tr">   <!-- to top-right -->
<div class="bg-gradient-to-r">     <!-- to right -->
<div class="bg-gradient-to-br">    <!-- to bottom-right -->
<div class="bg-gradient-to-b">    <!-- to bottom -->
<div class="bg-gradient-to-bl">    <!-- to bottom-left -->
<div class="bg-gradient-to-l">    <!-- to left -->
<div class="bg-gradient-to-tl">    <!-- to top-left -->

<!-- Color stops -->
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
<div class="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
<div class="bg-gradient-to-r from-blue-500 from-10% via-purple-500 via-30% to-pink-500 to-90%">

<!-- Percentage positions -->
<div class="bg-gradient-to-r from-indigo-500 from-0% via-purple-500 via-50% to-pink-500 to-100%">
```

### Radial & Conic Gradients

```html
<!-- Radial gradient (arbitrary) -->
<div class="bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 to-purple-600">

<!-- Conic gradient (arbitrary) -->
<div class="bg-[conic-gradient(from_90deg,_var(--tw-gradient-stops))] from-red-400 via-yellow-400 to-blue-400">
```

## Background Size

```html
<div class="bg-auto">         <!-- background-size: auto -->
<div class="bg-cover">        <!-- background-size: cover -->
<div class="bg-contain">      <!-- background-size: contain -->
<div class="bg-[length:200px_100px]">  <!-- background-size: 200px 100px -->
```

## Background Position

```html
<div class="bg-bottom">
<div class="bg-center">
<div class="bg-left">
<div class="bg-left-bottom">
<div class="bg-left-top">
<div class="bg-right">
<div class="bg-right-bottom">
<div class="bg-right-top">
<div class="bg-top">
<div class="bg-[position:top_right]">
```

## Background Repeat

```html
<div class="bg-repeat">        <!-- background-repeat: repeat -->
<div class="bg-no-repeat">     <!-- background-repeat: no-repeat -->
<div class="bg-repeat-x">     <!-- background-repeat: repeat-x -->
<div class="bg-repeat-y">     <!-- background-repeat: repeat-y -->
<div class="bg-repeat-round">  <!-- background-repeat: round -->
<div class="bg-repeat-space">   <!-- background-repeat: space -->
```

## Background Attachment

```html
<div class="bg-fixed">         <!-- background-attachment: fixed -->
<div class="bg-local">         <!-- background-attachment: local -->
<div class="bg-scroll">        <!-- background-attachment: scroll (default) -->
```

## Background Clip

```html
<div class="bg-clip-border">   <!-- background-clip: border-box (default) -->
<div class="bg-clip-padding">  <!-- background-clip: padding-box -->
<div class="bg-clip-content">  <!-- background-clip: content-box -->
<div class="bg-clip-text">     <!-- background-clip: text — for text gradients -->
```

### Text Gradient Effect

```html
<h1 class="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
  Gradient Text
</h1>
```

## Background Origin

```html
<div class="bg-origin-border">   <!-- background-origin: border-box -->
<div class="bg-origin-padding">  <!-- background-origin: padding-box (default) -->
<div class="bg-origin-content">  <!-- background-origin: content-box -->
```

## Background Color Opacity

```html
<div class="bg-red-500/10">    <!-- 10% opacity -->
<div class="bg-red-500/25">    <!-- 25% opacity -->
<div class="bg-red-500/50">    <!-- 50% opacity -->
<div class="bg-red-500/75">    <!-- 75% opacity -->
```

## Common Patterns

### Hero Section with Overlay

```html
<div class="relative">
  <div class="absolute inset-0 bg-cover bg-center" style="background-image: url(...)"></div>
  <div class="absolute inset-0 bg-black/50"></div>
  <div class="relative z-10 text-white p-8">
    <h1 class="text-4xl font-bold">Hero Title</h1>
  </div>
</div>
```

### Glassmorphism Card

```html
<div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
  Glass card content
</div>
```

### Gradient Border

```html
<div class="p-[2px] rounded-lg bg-gradient-to-r from-pink-500 to-violet-500">
  <div class="bg-white dark:bg-gray-900 rounded-lg p-4">
    Content with gradient border
  </div>
</div>
```

### Mesh Gradient Background

```html
<div class="min-h-dvh bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
</div>
```

### Pattern Overlay

```html
<div class="relative">
  <div class="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
  <div class="relative">Content</div>
</div>
```
