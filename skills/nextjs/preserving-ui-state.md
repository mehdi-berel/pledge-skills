# Preserving UI State with Activity (Next.js 16)

## Overview

With Cache Components enabled, Next.js preserves page-level state across navigations using React's `<Activity>` component. Instead of unmounting pages, they are hidden with `display: none`.

**Preserved state includes:**
- React component state
- DOM state (form inputs, scroll position)
- Expanded `<details>` elements
- Video/audio playback progress
- Canvas/WebGL content

**Limit:** Up to 3 routes are preserved. Beyond that, the oldest route is evicted and re-renders fresh.

## How It Works

When navigating from `/dashboard` to `/settings`:
1. `/dashboard` stays mounted but hidden (`display: none`)
2. `/settings` renders and becomes visible
3. Navigate back → `/dashboard` is shown instantly with all state intact

This eliminates the need for workarounds like:
- Hoisting state to shared layouts
- External stores (Zustand, Redux) for cross-page state
- Complex URL state management

## Activity Component

Use `<Activity>` directly in your own components for tabs, panels, or any UI where you want to hide without unmounting:

```tsx
'use client'
import { Activity } from 'react'
import { useState } from 'react'

export default function Tabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div>
      <button onClick={() => setActiveTab('home')}>Home</button>
      <button onClick={() => setActiveTab('settings')}>Settings</button>

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <HomePanel />
      </Activity>

      <Activity mode={activeTab === 'settings' ? 'visible' : 'hidden'}>
        <SettingsPanel />
      </Activity>
    </div>
  )
}
```

## Prerendering Hidden Content

Activity supports prerendering hidden content in the background:

```tsx
<Activity mode="hidden" prerender>
  <HeavyChart />
</Activity>
```

This renders the component even while hidden, so it's ready when shown.

## Effect Cleanup

When content is hidden, effects are cleaned up. When shown again, effects re-run:

```tsx
'use client'
import { useEffect } from 'react'

export default function VideoPlayer() {
  useEffect(() => {
    const player = initPlayer()
    return () => player.destroy() // Called when hidden
  }, [])

  return <video src="/video.mp4" />
}
```

## Distinguishing First Mount from Re-show

Use a ref to track if this is the first time the component is shown:

```tsx
'use client'
import { useRef, useEffect } from 'react'

export default function Dashboard() {
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      console.log('First mount')
    } else {
      console.log('Re-shown from Activity')
    }
  })

  return <div>Dashboard content</div>
}
```

## Global Styles During Hidden State

When a page is hidden, it's still in the DOM. Be careful with global styles:

```css
/* This affects ALL routes, including hidden ones */
body {
  overflow: hidden;
}

/* Use :scope or page-specific selectors instead */
[data-route="dashboard"] body {
  overflow: hidden;
}
```

## Forms and Input State

Form state is automatically preserved when navigating away and back:

```tsx
// app/contact/page.tsx
export default function ContactPage() {
  return (
    <form action={submitContact}>
      <input name="name" placeholder="Your name" />
      <input name="email" placeholder="Your email" />
      <textarea name="message" placeholder="Message" />
      <button type="submit">Send</button>
    </form>
  )
}
```

User fills in the form → navigates to About → comes back → form data is still there.

## Authentication State

Auth state (login status, user data) should live outside Activity since it needs to persist across all routes. Use:
- Context providers in root layout (outside Activity boundaries)
- External stores (Zustand, Jotai)
- Server-side session verification in each page

## Testing with Activity

When testing, use visibility-aware selectors:

```tsx
// ❌ May match hidden routes too
screen.getByText('Dashboard')

// ✅ Only matches visible content
screen.getByRole('heading', { name: 'Dashboard' })
```

Or check visibility explicitly:

```tsx
const element = screen.getByText('Dashboard')
expect(element).toBeVisible()
```
