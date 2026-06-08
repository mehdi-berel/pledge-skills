# Testing in Next.js 16

## Types of Tests

| Type | Purpose | Tools |
|------|---------|-------|
| **Unit** | Test individual functions/hooks in isolation | Vitest, Jest |
| **Component** | Test React component rendering/interaction | Vitest + React Testing Library, Jest |
| **Integration** | Test multiple units working together | Vitest, Jest |
| **E2E** | Test full user flows in a browser | Playwright, Cypress |
| **Snapshot** | Compare rendered output against saved snapshots | Vitest, Jest |

## Async Server Components

**Important:** Async Server Components are new to the React ecosystem. Some testing tools don't fully support them yet.

**Recommendation:** Use **End-to-End Testing** (Playwright/Cypress) over Unit Testing for async Server Components.

## Vitest Setup

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
})
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
```

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

### Testing Client Components

```tsx
// __tests__/Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Counter } from '@/components/Counter'
import { describe, it, expect } from 'vitest'

describe('Counter', () => {
  it('increments count on click', () => {
    render(<Counter />)
    const button = screen.getByRole('button', { name: /count/i })
    expect(button).toHaveTextContent('Count: 0')

    fireEvent.click(button)
    expect(button).toHaveTextContent('Count: 1')
  })
})
```

### Testing Hooks

```tsx
// __tests__/useCounter.test.ts
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '@/hooks/useCounter'
import { describe, it, expect } from 'vitest'

describe('useCounter', () => {
  it('increments count', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)

    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(1)
  })
})
```

## Playwright (E2E)

```bash
npm install -D @playwright/test
npx playwright install
```

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

```ts
// e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test('homepage has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Next\.js/)
})

test('navigation works', async ({ page }) => {
  await page.goto('/')
  await page.click('text=About')
  await expect(page).toHaveURL('/about')
})
```

## Cypress (E2E + Component)

```bash
npm install -D cypress
```

```ts
// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

```ts
// cypress/e2e/app.cy.ts
describe('App', () => {
  it('should navigate to the about page', () => {
    cy.visit('/')
    cy.get('a[href*="about"]').click()
    cy.url().should('include', '/about')
    cy.get('h1').contains('About')
  })
})
```

## Jest Setup

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

```ts
// jest.config.ts
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
}

export default createJestConfig(customJestConfig)
```

```ts
// jest.setup.ts
import '@testing-library/jest-dom'
```

## Mocking Server Actions

```ts
// __mocks__/actions.ts
import { vi } from 'vitest'

export const createPost = vi.fn(async () => ({
  success: true,
  message: 'Post created',
}))
```

```tsx
// __tests__/PostForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { createPost } from '@/app/actions'
import { PostForm } from '@/components/PostForm'
import { vi } from 'vitest'

vi.mock('@/app/actions', () => ({
  createPost: vi.fn(),
}))

describe('PostForm', () => {
  it('submits form data', async () => {
    render(<PostForm />)
    const input = screen.getByLabelText('Title')
    const button = screen.getByRole('button')

    fireEvent.change(input, { target: { value: 'New Post' } })
    fireEvent.click(button)

    expect(createPost).toHaveBeenCalledWith(
      expect.any(FormData)
    )
  })
})
```

## Testing Tips

1. **Test behavior, not implementation** — Focus on what users see/do
2. **Use `data-testid` sparingly** — Prefer semantic queries (`getByRole`, `getByLabelText`)
3. **Mock external APIs** — Use `msw` (Mock Service Worker) for API mocking
4. **Test loading/error states** — Don't just test the happy path
5. **Keep tests close to code** — Co-locate `__tests__` folders or use `.test.ts` files
6. **Use E2E for Server Components** — Unit tests don't work well with async RSC yet
