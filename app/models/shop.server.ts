import prisma from "../db.server";

export interface UpsertShopInput {
  shopId: string;
  domain: string;
}

/**
 * Creates a new shop record or updates the existing one on reinstall.
 * Never duplicates — safe to call on every OAuth callback.
 */
export async function upsertShop({ shopId, domain }: UpsertShopInput) {
  return prisma.shop.upsert({
    where: { shopId },
    update: { domain, updatedAt: new Date() },
    create: { shopId, domain, plan: "free" },
  });
}

export async function getShopByDomain(domain: string) {
  return prisma.shop.findUnique({ where: { domain } });
}

export async function getShopById(shopId: string) {
  return prisma.shop.findUnique({ where: { shopId } });
}
