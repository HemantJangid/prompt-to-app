/**
 * Feature Runtime — sandboxed iframe shell
 *
 * This file is the entry point for the iframe that runs each generated feature.
 * It listens for the postMessage data contract from the App Embed Block,
 * then makes the context available to the generated feature code.
 *
 * Each generated feature is injected into this shell at publish time.
 * The shell itself is deployed as a static file to Cloudflare R2.
 */

import type { PostMessagePayload } from "@prompt-to-app/shared";

let context: PostMessagePayload | null = null;

window.addEventListener("message", (event: MessageEvent) => {
  const data = event.data as PostMessagePayload;
  if (data?.type !== "PROMPT_APP_CONTEXT") return;

  context = data;
  document.dispatchEvent(new CustomEvent("promptapp:context", { detail: context }));
});

/**
 * Report JavaScript errors back to the error beacon endpoint.
 * The server tracks error counts and auto-disables features above the threshold.
 */
window.addEventListener("error", (event: ErrorEvent) => {
  const featureId = document.documentElement.dataset.featureId;
  const shop = document.documentElement.dataset.shop;
  if (!featureId || !shop) return;

  fetch("/api/features/errors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      featureId,
      shop,
      errorMessage: event.message,
    }),
    keepalive: true,
  }).catch(() => {
    // Silently ignore — never let error reporting crash the page
  });
});

export function getContext(): PostMessagePayload | null {
  return context;
}
