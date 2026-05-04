import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * Catch-all auth route — handles /auth, /auth/callback, /auth/login
 * Shopify App Remix handles all OAuth redirect logic here.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};
