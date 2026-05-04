import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "#app/shopify.server";
import { getShopByDomain } from "#app/models/shop.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getShopByDomain(session.shop);

  return json({ shop });
};

export default function Dashboard() {
  const { shop } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>PromptApp Dashboard</h1>
      {shop && (
        <p>
          {shop.domain} — Plan: {shop.plan}
        </p>
      )}
    </div>
  );
}
