# Interactivity (Tailwind CSS)

## Cursor

```html
<div class="cursor-auto">
<div class="cursor-default">
<div class="cursor-pointer">     <!-- pointer (clickable) -->
<div class="cursor-wait">        <!-- loading -->
<div class="cursor-text">        <!-- text selection -->
<div class="cursor-move">        <!-- draggable -->
<div class="cursor-help">        <!-- help/info -->
<div class="cursor-not-allowed"> <!-- disabled -->
<div class="cursor-none">
<div class="cursor-context-menu">
<div class="cursor-progress">
<div class="cursor-cell">
<div class="cursor-crosshair">
<div class="cursor-vertical-text">
<div class="cursor-alias">
<div class="cursor-copy">
<div class="cursor-no-drop">
<div class="cursor-grab">
<div class="cursor-grabbing">
<div class="cursor-all-scroll">
<div class="cursor-col-resize">
<div class="cursor-row-resize">
<div class="cursor-n-resize">
<div class="cursor-e-resize">
<div class="cursor-s-resize">
<div class="cursor-w-resize">
<div class="cursor-ns-resize">
<div class="cursor-ew-resize">
<div class="cursor-ne-resize">
<div class="cursor-nw-resize">
<div class="cursor-se-resize">
<div class="cursor-sw-resize">
<div class="cursor-ew-resize">
<div class="cursor-ns-resize">
<div class="cursor-nesw-resize">
<div class="cursor-nwse-resize">
<div class="cursor-zoom-in">
<div class="cursor-zoom-out">
```

## Pointer Events

```html
<div class="pointer-events-none">  <!-- pointer-events: none -->
<div class="pointer-events-auto">  <!-- pointer-events: auto (default) -->
```

**Pattern:** Disable interaction on overlay, enable on children:

```html
<div class="pointer-events-none">  <!-- Overlay -->
  <button class="pointer-events-auto">Clickable through overlay</button>
</div>
```

## User Select

```html
<div class="select-none">       <!-- user-select: none -->
<div class="select-text">       <!-- user-select: text -->
<div class="select-all">        <!-- user-select: all (click selects all) -->
<div class="select-auto">       <!-- user-select: auto (default) -->
```

## Resize

```html
<div class="resize-none">       <!-- resize: none -->
<div class="resize-y">        <!-- resize: vertical -->
<div class="resize-x">        <!-- resize: horizontal -->
<div class="resize">          <!-- resize: both -->
```

## Scroll Behavior

```html
<div class="scroll-auto">       <!-- scroll-behavior: auto (default) -->
<div class="scroll-smooth">     <!-- scroll-behavior: smooth -->
```

## Scroll Margin

```html
<div class="scroll-m-4">        <!-- scroll-margin: 1rem -->
<div class="scroll-mt-4">     <!-- scroll-margin-top: 1rem -->
<div class="scroll-mx-4">     <!-- scroll-margin-left/right -->
```

## Scroll Padding

```html
<div class="scroll-p-4">        <!-- scroll-padding: 1rem -->
<div class="scroll-pt-4">     <!-- scroll-padding-top: 1rem -->
<div class="scroll-px-4">     <!-- scroll-padding-left/right -->
```

## Scroll Snap

```html
<!-- Container -->
<div class="snap-none">         <!-- scroll-snap-type: none -->
<div class="snap-x">          <!-- scroll-snap-type: x mandatory -->
<div class="snap-y">          <!-- scroll-snap-type: y mandatory -->
<div class="snap-both">       <!-- scroll-snap-type: both mandatory -->
<div class="snap-mandatory">   <!-- scroll-snap-type: ... mandatory (default with snap-x/y) -->
<div class="snap-proximity">   <!-- scroll-snap-type: ... proximity -->

<!-- Children -->
<div class="snap-start">       <!-- scroll-snap-align: start -->
<div class="snap-end">         <!-- scroll-snap-align: end -->
<div class="snap-center">      <!-- scroll-snap-align: center -->
<div class="snap-align-none">   <!-- scroll-snap-align: none -->

<!-- Stop position -->
<div class="snap-normal">      <!-- scroll-snap-stop: normal -->
<div class="snap-always">      <!-- scroll-snap-stop: always (can't skip) -->
```

### Scroll Snap Example

```html
<div class="flex overflow-x-auto snap-x snap-mandatory gap-4">
  <div class="snap-center shrink-0 w-[80vw]">Slide 1</div>
  <div class="snap-center shrink-0 w-[80vw]">Slide 2</div>
  <div class="snap-center shrink-0 w-[80vw]">Slide 3</div>
</div>
```

## Touch Action

```html
<div class="touch-auto">        <!-- touch-action: auto (default) -->
<div class="touch-none">        <!-- touch-action: none -->
<div class="touch-pan-x">       <!-- touch-action: pan-x -->
<div class="touch-pan-left">    <!-- touch-action: pan-left -->
<div class="touch-pan-right">   <!-- touch-action: pan-right -->
<div class="touch-pan-y">       <!-- touch-action: pan-y -->
<div class="touch-pan-up">      <!-- touch-action: pan-up -->
<div class="touch-pan-down">    <!-- touch-action: pan-down -->
<div class="touch-pinch-zoom">  <!-- touch-action: pinch-zoom -->
<div class="touch-manipulation"> <!-- touch-action: manipulation -->
```

## Will Change

```html
<div class="will-change-auto">
<div class="will-change-scroll">    <!-- will-change: scroll-position -->
<div class="will-change-contents">  <!-- will-change: contents -->
<div class="will-change-transform"> <!-- will-change: transform -->
```

## Accent Color

```html
<input type="checkbox" class="accent-red-500">
<input type="radio" class="accent-blue-500">
<input type="range" class="accent-green-500">
<progress class="accent-purple-500"></progress>
```

## Appearance

```html
<input class="appearance-none">   <!-- appearance: none (remove default styling) -->
```

### Custom Checkbox with Appearance None

```html
<label class="flex items-center gap-2 cursor-pointer">
  <input type="checkbox" class="appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-blue-500 transition-colors" />
  <span>Option</span>
</label>
```

## Caret Color

```html
<input class="caret-red-500">     <!-- caret-color: red -->
<input class="caret-blue-500">
<input class="caret-transparent">
```

## Common Patterns

### Custom Scrollbar

```html
<div class="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
  <!-- Content -->
</div>
```

**Note:** Custom scrollbars require `tailwind-scrollbar` plugin or custom CSS.

### Drag Handle

```html
<div class="cursor-grab active:cursor-grabbing" draggable="true">
  ⋮⋮ Drag me
</div>
```

### Disable Text Selection on UI

```html
<div class="select-none">
  <button>Button</button>
  <span>Non-selectable label</span>
</div>
```

### Smooth Scroll to Anchor

```html
<html class="scroll-smooth">
  <a href="#section">Jump to section</a>
  <section id="section">...</section>
</html>
```

### Horizontal Scroll with Snap

```html
<div class="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4">
  <article class="snap-start shrink-0 w-80">Card 1</article>
  <article class="snap-start shrink-0 w-80">Card 2</article>
  <article class="snap-start shrink-0 w-80">Card 3</article>
</div>
```
