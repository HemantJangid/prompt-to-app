# PromptApp

A Shopify app where merchants describe storefront features in plain English and get live, draggable theme blocks — without installing another app.

## Monorepo Structure

```
/
├── apps/
│   └── web/                  ← Remix app (Shopify OAuth, dashboard, AI generation pipeline)
├── extensions/
│   └── theme/                ← App Block + App Embed Block (Shopify CLI theme extension)
├── packages/
│   ├── feature-runtime/      ← Sandboxed iframe shell, built and deployed to Cloudflare R2
│   └── shared/               ← PostMessage contract types shared across packages
├── docs/
│   ├── PRD.md
│   └── TESTING.md
├── turbo.json
└── pnpm-workspace.yaml
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run all packages in dev mode
pnpm dev

# Run all tests
pnpm test

# Build all packages
pnpm build
```

## Apps

| Package | Description |
|---|---|
| `apps/web` | Remix + TypeScript Shopify app |
| `extensions/theme` | Shopify theme extension (App Block + Embed Block) |
| `packages/feature-runtime` | Iframe shell served from Cloudflare R2 CDN |
| `packages/shared` | Shared TypeScript types (postMessage contract) |

## Docs

- [PRD](docs/PRD.md) — full product requirements
- [Testing Guide](docs/TESTING.md) — testing philosophy, patterns, and per-slice checklist
