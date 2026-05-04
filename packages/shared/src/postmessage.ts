/**
 * PostMessage data contract between the App Embed Block (sender)
 * and the Feature Runtime iframe (receiver).
 *
 * The App Embed Block reads this data from the Shopify storefront
 * and broadcasts it to all active feature iframes on every page load.
 */

export interface PostMessageProduct {
  id: string;
  title: string;
  handle: string;
  price: number;
  compareAtPrice: number | null;
  inventoryQuantity: number | null;
  available: boolean;
  variantId: string | null;
}

export interface PostMessageCartItem {
  variantId: string;
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface PostMessageCart {
  items: PostMessageCartItem[];
  totalPrice: number;
  itemCount: number;
}

export interface PostMessageCustomer {
  loggedIn: boolean;
  id: string | null;
  email: string | null;
  orderCount: number | null;
}

export type PostMessagePageType =
  | "product"
  | "collection"
  | "cart"
  | "home"
  | "other";

export interface PostMessagePayload {
  type: "PROMPT_APP_CONTEXT";
  shop: string;
  pageType: PostMessagePageType;
  product: PostMessageProduct | null;
  cart: PostMessageCart;
  customer: PostMessageCustomer;
}
