# PRD: PromptApp — AI-Powered Shopify Feature Generator

## Problem Statement

Shopify merchants are forced to install, configure, and pay for multiple separate apps to add basic storefront functionality to their stores. The average merchant runs 6+ apps simultaneously, spending $50–$2,000/month. Each new requirement means another app to evaluate, install, and manage. This fragments the merchant's dashboard, slows their storefront (every app adds JS overhead), and creates billing complexity. When a merchant needs something slightly custom — a countdown timer styled to their brand, a badge that only shows on sale items — no app in the store does it exactly right.

## Solution

A single Shopify app that lets merchants describe any storefront UI feature in plain English. Instead of installing another app, the merchant types a prompt ("Add a countdown timer that resets every 24 hours below the Add to Cart button") and the feature is generated, previewed, and deployed — all within the same dashboard. Generated features appear as draggable blocks in the Shopify theme editor, just like native Shopify blocks. Merchants can enable, disable, or regenerate features at any time. One app replaces many.

## User Stories

### Installation & Onboarding
1. As a merchant, I want to install the app from a direct URL so that I can start using it without waiting for App Store approval.
2. As a merchant, I want OAuth to complete automatically after clicking install so that I don't have to manually configure API keys.
3. As a merchant, I want to land on a dashboard immediately after install so that I understand what the app does and can start generating features.
4. As a merchant, I want to see my current plan and remaining generation credits on the dashboard so that I know how much I can use before upgrading.

### Feature Generation
5. As a merchant, I want to type a plain English description of a storefront feature so that I don't need technical knowledge to create it.
6. As a merchant, I want the app to generate a preview of my feature within a few seconds so that I don't have to wait long.
7. As a merchant, I want to see the generated feature in an isolated preview iframe so that I can evaluate it before adding it to my store.
8. As a merchant, I want to click "Try Again" and optionally provide feedback so that I can refine the output if the first generation doesn't match my intent.
9. As a merchant, I want the generation pipeline to handle ambiguous prompts gracefully so that I get a reasonable result even if my description is vague.
10. As a merchant, I want to click "Add to Store" after previewing so that I can publish the feature with a single action.
11. As a merchant, I want each generation to be counted against my monthly credit balance so that I understand the cost of experimenting.
12. As a merchant, I want to be warned when I'm close to exhausting my monthly generation credits so that I can decide whether to upgrade.
13. As a merchant, I want generation to be blocked with a clear upgrade prompt when I've exhausted my credits so that I know exactly what to do next.

### Theme Editor Integration
14. As a merchant, I want each published feature to appear as a draggable block in my Shopify theme editor so that I can position it exactly where I want on the page.
15. As a merchant, I want to select which generated feature a block should display from a dropdown in the theme editor so that I can manage multiple features independently.
16. As a merchant, I want the feature block to render correctly on both desktop and mobile in the theme editor preview so that I can verify placement before saving.
17. As a merchant, I want to add the same feature block to multiple pages (product page, collection page) so that I can reuse a feature across my store.
18. As a merchant, I want removing a block from the theme to not delete the feature from my dashboard so that I can re-add it later.

### Feature Management Dashboard
19. As a merchant, I want to see a list of all my generated features with their current status (enabled/disabled) so that I have a single view of what's on my store.
20. As a merchant, I want to enable or disable a feature with a single toggle so that I can quickly turn functionality on or off without touching the theme editor.
21. As a merchant, I want to see how many active feature slots I have remaining so that I know when I'm approaching my plan limit.
22. As a merchant, I want to be prevented from enabling a feature when I've used all my active slots so that I understand I need to disable another or upgrade.
23. As a merchant, I want to delete a feature so that it frees up a slot and removes it from my store permanently.
24. As a merchant, I want to give a feature a custom name so that I can identify it easily in the dashboard and theme editor dropdown.
25. As a merchant, I want to regenerate a feature from its original prompt so that I can refresh it if my store design changes.

### Storefront Runtime & Data
26. As a shopper, I want generated features to load fast so that my browsing experience is not slowed down.
27. As a shopper, I want generated features to receive live product data (price, inventory, title) so that features like countdown timers and stock badges are accurate.
28. As a shopper, I want generated features to receive current cart contents so that cart-aware widgets (free shipping bars, upsell prompts) work correctly.
29. As a shopper, I want generated features to be visually contained and not interfere with the rest of the page so that the store remains usable if a feature misbehaves.
30. As a merchant, I want the App Embed Block to send page context (product, cart, customer, page type) to all active feature iframes automatically so that features have the data they need without additional configuration.

### Error Handling & Reliability
31. As a merchant, I want a feature to be automatically disabled if it throws repeated JavaScript errors so that a broken feature cannot silently harm my store's conversion rate.
32. As a merchant, I want to receive a notification when a feature is auto-disabled so that I know something went wrong and can take action.
33. As a merchant, I want to manually disable a feature from the dashboard at any time so that I always have a recovery path.
34. As a merchant, I want the rest of my store to continue working normally even when a feature errors so that a failed widget never breaks checkout.
35. As a merchant, I want to see an error log for a feature so that I can understand why it was disabled.

### Billing & Plans
36. As a merchant, I want a free plan with 3 active feature slots and 15 monthly generations so that I can try the product with no financial commitment.
37. As a merchant, I want a Pro plan at $29/month with 10 active slots and 100 monthly generations so that I can replace most of my existing apps with a single subscription.
38. As a merchant, I want a Business plan at $99/month with unlimited active slots and unlimited generations so that large stores can scale without restrictions.
39. As a merchant, I want billing to be handled through Shopify's native billing so that I don't have to enter payment details separately.
40. As a merchant, I want to upgrade my plan from the dashboard so that I can unlock more features without leaving the app.
41. As a merchant, I want my generation credits to reset at the start of each billing cycle so that I always have a fresh allocation each month.

### Rate Limiting & Abuse Prevention
42. As a merchant, I want generation to be rate-limited to 5 per hour so that I'm protected from accidentally burning through credits in a single session.
43. As a system operator, I want per-store rate limiting enforced server-side so that no merchant can abuse the generation pipeline regardless of client behavior.

## Implementation Decisions

### Architecture: Vertical Tracer Bullet Slices
The system is built and tested as 7 independent vertical slices. Each slice delivers end-to-end value and is fully tested before the next slice begins. All slices are built using TDD (red → green → refactor).

**Slice 1 — Install & Onboard**: Shopify OAuth flow, session persistence, basic dashboard shell, plan initialization.

**Slice 2 — Generate & Preview**: Prompt intake, Claude API call (Haiku by default, Sonnet fallback for retries), internal spec storage, static HTML/CSS/JS output, isolated iframe preview in dashboard.

**Slice 3 — Publish to CDN**: Compiled feature file upload to Cloudflare R2, CDN URL assignment, feature record persisted to database with status `draft → published`.

**Slice 4 — Theme Block**: Generic App Block (single block registered once in the extension), block setting dropdown populated from merchant's published features, iframe rendered in theme editor and storefront using CDN URL.

**Slice 5 — Enable/Disable Slots**: Slot enforcement against plan tier, enable/disable toggle updates feature status and CDN file visibility, slot count displayed in dashboard.

**Slice 6 — Error Auto-Disable**: Feature Runtime reports JS errors via a beacon endpoint, error count tracked per feature, feature auto-disabled after threshold (5 errors in 10 minutes), merchant notified via Shopify admin notification.

**Slice 7 — Billing & Credits**: Shopify AppSubscription creation and webhook handling, plan tier stored per shop, generation credit counter incremented on each pipeline call, rate limiter (5/hour) enforced via sliding window in database.

### Key Architectural Decisions

**Sandboxed iframe runtime**: All generated code runs inside a sandboxed `<iframe>` served from Cloudflare R2/CDN. Generated code has no direct access to the merchant's DOM, cookies, or Shopify APIs. The iframe boundary is a hard security guarantee.

**postMessage data contract**: The App Embed Block (running on the storefront) reads Shopify storefront context and sends it to every active feature iframe on page load via `postMessage`. The contract includes: `{ product, cart, customer, page_type, shop }`. The Claude generation prompt includes this contract as context so generated code uses it correctly.

**Pre-built static files**: On publish, generated HTML/CSS/JS is compiled into a single self-contained static file and uploaded to Cloudflare R2. The iframe `src` points directly to the CDN URL. There is no server involvement on the shopper's page load.

**One generic App Block**: A single App Block is registered in the Shopify extension. It renders whichever feature is selected via a block setting (feature ID). This works around Shopify's constraint that App Blocks must be statically defined at deploy time.

**Internal spec, not exposed to merchant**: The generation pipeline produces an internal JSON spec before generating code. This spec is stored in the database but never shown to the merchant. It enables debugging, future re-generation with improved models, and versioning (v2).

**AI model strategy**: Claude Haiku 4.5 is the default generation model. Claude Sonnet 4.6 is used as a fallback on explicit merchant retry. This keeps per-generation costs at ~$0.01 (Haiku) vs ~$0.04 (Sonnet).

### Data Schema (conceptual)

**Shop**: shopId, domain, plan (free/pro/business), generationCreditsUsed, generationCreditsResetAt, installedAt

**Feature**: featureId, shopId, name, prompt, spec (JSON), status (draft/published/disabled/error), cdnUrl, activeSlot (boolean), errorCount, createdAt, updatedAt

**GenerationEvent**: eventId, shopId, featureId, modelUsed, inputTokens, outputTokens, createdAt

**ErrorEvent**: eventId, shopId, featureId, errorMessage, createdAt

### API Contracts (internal)

**POST /api/features/generate**: Accepts `{ prompt, shopId }`. Returns `{ featureId, previewUrl, spec }`. Enforces credit and rate limits before calling Claude.

**POST /api/features/:id/publish**: Uploads compiled file to R2. Transitions feature status to `published`. Returns `{ cdnUrl }`.

**PATCH /api/features/:id**: Accepts `{ enabled, name }`. Enforces slot limits on enable. Returns updated feature.

**POST /api/features/errors**: Beacon endpoint called by Feature Runtime. Accepts `{ featureId, shopId, errorMessage }`. Increments error count, triggers auto-disable if threshold exceeded.

**GET /api/features**: Returns all features for a shop with status and slot usage summary.

## Testing Decisions

### What Makes a Good Test
Tests verify external behavior — what the module produces given an input — not implementation details like which internal functions were called or how the database query was structured. Tests should remain valid even if the internal implementation is completely rewritten.

### Slice 1 — Install & Onboard
- OAuth callback results in a valid session and shop record
- Dashboard renders with correct plan info for a new shop
- Unauthenticated requests are redirected to install flow

### Slice 2 — Generate & Preview
- Valid prompt returns a preview URL and stores a feature record with status `draft`
- Generation is blocked when monthly credits are exhausted
- Generation is blocked when rate limit is exceeded
- Claude API failure returns a user-friendly error, does not persist a broken feature
- Preview iframe URL resolves and returns valid HTML

### Slice 3 — Publish to CDN
- Published feature file is accessible at its CDN URL
- Feature status transitions from `draft` to `published` on publish
- CDN file contains the postMessage listener contract

### Slice 4 — Theme Block
- App Block renders the correct feature iframe for a given feature ID setting
- App Embed Block sends the correct postMessage payload on page load
- Selecting a different feature ID in block settings updates the rendered iframe

### Slice 5 — Enable/Disable Slots
- Enabling a feature increments active slot count
- Enabling a feature when all slots are full returns an error
- Disabling a feature decrements active slot count and makes the slot available
- Deleting a feature removes it from the store and frees its slot

### Slice 6 — Error Auto-Disable
- Feature with error count below threshold remains enabled
- Feature reaching the error threshold is auto-disabled
- Auto-disabled feature appears as `error` status in dashboard
- Error beacon endpoint rejects requests for features not belonging to the calling shop

### Slice 7 — Billing & Credits
- Free plan enforces 3 active slots and 15 monthly generations
- Pro plan enforces 10 active slots and 100 monthly generations
- Business plan has no active slot or generation limits
- Shopify subscription webhook correctly updates shop plan on activation and cancellation
- Generation credits reset on billing cycle renewal

## Out of Scope

- **In-context (on-store) preview**: Previewing generated features in the context of the merchant's actual storefront. Deferred to v2.
- **Feature versioning and rollback**: Storing multiple versions of a feature and allowing merchants to revert. Deferred to v2.
- **Admin and automation features**: Order tagging, bulk edits, email triggers, or any feature that requires Shopify Admin API write access. Storefront UI only in v1.
- **Checkout customization**: Any feature requiring Shopify Plus checkout extensibility.
- **Developer code editing**: An escape hatch for developers to manually edit generated code. Deferred to v2.
- **Feature marketplace**: A catalog of community-created or pre-built feature templates.
- **Multi-language / i18n support** for generated feature UI.
- **Analytics per feature**: Click tracking, impression counts, conversion attribution.
- **Shopify App Store listing**: v1 ships via direct install URL. App Store submission follows once the product is stable.

## Further Notes

### Competitive Context
Vitals (4.9 stars, 9,500+ reviews, $29.99/month) validates that merchants will pay for app consolidation. Vitals is limited to a fixed catalog of ~40 features. This product's differentiator is an unbounded feature catalog driven by AI generation. No current app in the Shopify ecosystem offers this.

Shopify's own AI tools (Sidekick, Tinker, Magic) focus on content creation and store administration — not storefront UI widget generation. They are not direct competitors.

### Unit Economics
At Claude Haiku 4.5 pricing (~$0.01/generation), the Pro plan ($29/month, 100 generations) yields ~95% gross margin on AI costs. Free tier cost is ~$0.15/merchant/month at full credit usage. Infrastructure (hosting + DB + R2) is estimated at $100–150/month fixed, negligible at early scale.

### Security Model
The sandboxed iframe is the primary security boundary. Generated code cannot access the merchant's theme code, cookies, or Shopify session. The postMessage contract is read-only from the feature's perspective — it receives data, it cannot write back to the parent page. This position is defensible in a Shopify App Store security review.

### App Store Strategy
Build for App Store compliance from day one (use Shopify Billing API, follow performance guidelines, implement required webhooks). Launch via direct URL with first 10–20 merchants to iterate without review cycles. Submit to App Store after product stability is confirmed.
