# Theme Extension

Shopify theme extension containing:

- **App Embed Block** (`blocks/app-embed.liquid`) — installs once across the storefront, reads page context, and broadcasts it to all active feature iframes via `postMessage`
- **Generic App Block** (`blocks/feature-block.liquid`) — draggable block in the theme editor; renders the correct feature iframe based on a block setting (feature ID)

## Development

Extensions are managed by Shopify CLI from the `apps/web` workspace:

```bash
cd apps/web
pnpm dev        # starts shopify app dev (includes extensions)
pnpm build      # builds app + extensions
```

## Structure

```
extensions/theme/
├── blocks/
│   ├── app-embed.liquid      ← App Embed Block (Slice 4/7)
│   └── feature-block.liquid  ← Generic App Block (Slice 4/7)
└── shopify.extension.toml
```

These files are scaffolded as part of Slice 4 (Theme Block) and Slice 7 (App Embed Block).
