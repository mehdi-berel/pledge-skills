# Transitions & Animation (Tailwind CSS)

## Transition Property

```html
<div class="transition-none">          <!-- transition-property: none -->
<div class="transition-all">           <!-- transition-property: all -->
<div class="transition">               <!-- transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter -->
<div class="transition-colors">        <!-- transition-property: color, background-color, border-color, text-decoration-color, fill, stroke -->
<div class="transition-opacity">        <!-- transition-property: opacity -->
<div class="transition-shadow">         <!-- transition-property: box-shadow -->
<div class="transition-transform">     <!-- transition-property: transform -->
```

## Transition Duration

```html
<div class="duration-0">       <!-- 0ms -->
<div class="duration-75">      <!-- 75ms -->
<div class="duration-100">     <!-- 100ms -->
<div class="duration-150">     <!-- 150ms -->
<div class="duration-200">     <!-- 200ms -->
<div class="duration-300">     <!-- 300ms -->
<div class="duration-500">     <!-- 500ms -->
<div class="duration-700">     <!-- 700ms -->
<div class="duration-1000">    <!-- 1000ms -->
<div class="duration-[2000ms]">
```

## Transition Timing Function

```html
<div class="ease-linear">     <!-- linear -->
<div class="ease-in">         <!-- cubic-bezier(0.4, 0, 1, 1) -->
<div class="ease-out">        <!-- cubic-bezier(0, 0, 0.2, 1) -->
<div class="ease-in-out">     <!-- cubic-bezier(0.4, 0, 0.2, 1) -->
<div class="ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]">
```

## Transition Delay

```html
<div class="delay-0">
<div class="delay-75">
<div class="delay-100">
<div class="delay-150">
<div class="delay-200">
<div class="delay-300">
<div class="delay-500">
<div class="delay-700">
<div class="delay-1000">
<div class="delay-[2000ms]">
```

## Animation

```html
<div class="animate-none">
<div class="animate-spin">        <!-- rotate 360deg -->
<div class="animate-ping">        <!-- scale and fade -->
<div class="animate-pulse">       <!-- opacity pulse -->
<div class="animate-bounce">      <!-- bounce -->
<div class="animate-in">          <!-- fade + zoom in (v4) -->
<div class="animate-out">         <!-- fade + zoom out (v4) -->
```

### Usage Examples

```html
<!-- Loading spinner -->
<svg class="animate-spin h-5 w-5 text-blue-500" xmlns="..." fill="none" viewBox="0 0 24 24">
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
</svg>

<!-- Notification dot -->
<span class="relative flex h-3 w-3">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
</span>

<!-- Skeleton loading -->
<div class="animate-pulse space-y-2">
  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

## Custom Animations (v4)

Define animations in CSS:

```css
@theme {
  --animate-fade-in: fade-in 0.5s ease-out;
  --animate-slide-up: slide-up 0.5s ease-out;
  --animate-shake: shake 0.5s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

```html
<div class="animate-fade-in">
<div class="animate-slide-up">
<div class="animate-shake">
```

## View Transitions (v4 + React)

```tsx
import { ViewTransition } from 'react'

function Gallery({ photos }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {photos.map((photo) => (
        <ViewTransition key={photo.id} name={`photo-${photo.id}`}>
          <img src={photo.src} className="rounded-lg" />
        </ViewTransition>
      ))}
    </div>
  )
}
```

## Common Patterns

### Smooth Hover Card

```html
<div class="bg-white rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
  Card content
</div>
```

### Staggered Animation

```html
<ul>
  <li class="opacity-0 animate-[fade-in_0.5s_ease-out_forwards]">Item 1</li>
  <li class="opacity-0 animate-[fade-in_0.5s_ease-out_0.1s_forwards]">Item 2</li>
  <li class="opacity-0 animate-[fade-in_0.5s_ease-out_0.2s_forwards]">Item 3</li>
</ul>
```

### Button Press

```html
<button class="bg-blue-500 text-white px-4 py-2 rounded
  active:scale-95 active:bg-blue-600
  transition-all duration-150 ease-out">
  Press me
</button>
```

### Page Transition

```html
<div class="animate-in fade-in zoom-in-95 duration-300">
  <!-- Page content slides in -->
</div>
```

### Toast Notification

```html
<div class="fixed bottom-4 right-4
  animate-in slide-in-from-bottom-4 fade-in duration-300
  data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-right-full">
  Toast message
</div>
```
