# Testing Guide

## Philosophy

Tests verify **external behavior** — what a module produces given an input — not implementation details. A test should remain valid even if the internal implementation is completely rewritten. Never test which internal functions were called or how a database query was structured unless that is the explicit contract.

All features are built using **TDD (red → green → refactor)**:
1. Write failing tests that describe the desired behavior
2. Write the minimum code to make them pass
3. Refactor without breaking tests

## Stack

- **Test runner**: [Vitest](https://vitest.dev/) — fast, ESM-native, compatible with Vite config
- **Mocking**: Vitest's built-in `vi.mock` / `vi.fn`
- **Environment**: Node (no browser DOM required for server-side logic)

## Running Tests

```bash
# Run all tests once
npm test

# Run in watch mode during development
npm run test:watch

# Run a specific file
npx vitest run app/models/__tests__/shop.server.test.ts
```

## Project Structure

```
app/
  __tests__/              # Route-level and integration behavior tests
  models/
    __tests__/            # Model-level unit tests
    shop.server.ts
  db.server.ts
  shopify.server.ts
  routes/
```

Tests live next to the code they test inside `__tests__/` directories. Test files are named `*.test.ts`.

## Import Aliases

All imports use the `#app/*` subpath pattern:

```ts
import { upsertShop } from "#app/models/shop.server";
import prisma from "#app/db.server";
```

Vitest resolves `#app/*` to `./app/*` via the alias in `vitest.config.ts`. The same mapping is declared in `package.json` under `imports` for Node.js runtime resolution.

## Mocking Prisma

Prisma is mocked at the module level so tests never require a real database connection:

```ts
vi.mock("#app/db.server", () => ({
  default: {
    shop: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import prisma from "#app/db.server";

// In each test:
vi.mocked(prisma.shop.upsert).mockResolvedValueOnce(mockShop);
```

Always call `vi.clearAllMocks()` in `beforeEach` to prevent state leaking between tests.

## What to Test Per Slice

### Slice 1 — Install & Onboard
- OAuth callback creates a shop record with `plan=free`
- Reinstall does not duplicate the shop record (upsert behavior)
- Existing plan is not overwritten on reinstall
- Unauthenticated requests throw a redirect response to `/auth`

### Slice 2 — Generation Pipeline
- Valid prompt returns a `draft` feature record and a preview URL
- Internal spec is stored but never returned to the caller
- Generation blocked when monthly credits are exhausted
- Generation blocked when hourly rate limit is exceeded
- Claude API failure does not persist a broken feature record

### Slice 3 — Publish to CDN
- Published feature file is accessible at its CDN URL
- Feature status transitions from `draft` → `published`
- Re-publishing overwrites the existing R2 file

### Slice 4 — Theme Block
- App Block renders the correct iframe for a given feature ID setting
- App Embed Block sends the correct postMessage payload on page load
- Changing the feature ID setting updates the rendered iframe

### Slice 5 — Enable/Disable Slots
- Enabling a feature increments active slot count
- Enabling fails when all plan slots are used
- Disabling decrements slot count and frees the slot
- Deleting removes the DB record and frees the slot

### Slice 6 — Error Auto-Disable
- Feature below error threshold remains enabled
- Feature reaching threshold (5 errors / 10 min) is auto-disabled
- Auto-disabled feature has status `error`
- Error beacon rejects requests for features not belonging to the calling shop

### Slice 7 — Billing & Credits
- Free plan enforces 3 active slots and 15 monthly generations
- Pro plan enforces 10 active slots and 100 monthly generations
- Business plan has no slot or generation limits
- Subscription webhook correctly updates plan on activation and cancellation
- Generation credits reset on billing cycle renewal

## What NOT to Test

- Shopify's own OAuth mechanics — `@shopify/shopify-app-remix` handles this; test your integration points only
- Third-party library internals (Prisma query syntax, Remix routing)
- Implementation details that could change without affecting external behavior
- Happy paths without edge cases (always pair success cases with failure/boundary cases)
