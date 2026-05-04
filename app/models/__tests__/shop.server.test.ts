import { describe, it, expect, vi, beforeEach } from "vitest";
import { upsertShop, getShopByDomain, getShopById } from "../shop.server";

// Mock Prisma client
vi.mock("../../db.server", () => ({
  default: {
    shop: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import prisma from "../../db.server";

const mockShop = {
  id: "clx123",
  shopId: "test-store.myshopify.com",
  domain: "test-store.myshopify.com",
  plan: "free",
  installedAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("upsertShop", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a shop record with plan=free on first install", async () => {
    vi.mocked(prisma.shop.upsert).mockResolvedValueOnce(mockShop);

    const result = await upsertShop({
      shopId: "test-store.myshopify.com",
      domain: "test-store.myshopify.com",
    });

    expect(prisma.shop.upsert).toHaveBeenCalledWith({
      where: { shopId: "test-store.myshopify.com" },
      update: expect.objectContaining({ domain: "test-store.myshopify.com" }),
      create: {
        shopId: "test-store.myshopify.com",
        domain: "test-store.myshopify.com",
        plan: "free",
      },
    });
    expect(result.plan).toBe("free");
    expect(result.shopId).toBe("test-store.myshopify.com");
  });

  it("does not duplicate shop record on reinstall (upserts by shopId)", async () => {
    vi.mocked(prisma.shop.upsert).mockResolvedValueOnce(mockShop);

    // Call twice simulating reinstall
    await upsertShop({ shopId: "test-store.myshopify.com", domain: "test-store.myshopify.com" });
    vi.mocked(prisma.shop.upsert).mockResolvedValueOnce(mockShop);
    await upsertShop({ shopId: "test-store.myshopify.com", domain: "test-store.myshopify.com" });

    // Both calls use upsert — no separate create, no duplicates
    expect(prisma.shop.upsert).toHaveBeenCalledTimes(2);
    expect(prisma.shop.upsert).not.toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ plan: undefined }) })
    );
  });

  it("preserves existing plan on reinstall", async () => {
    const proShop = { ...mockShop, plan: "pro" };
    vi.mocked(prisma.shop.upsert).mockResolvedValueOnce(proShop);

    const result = await upsertShop({
      shopId: "test-store.myshopify.com",
      domain: "test-store.myshopify.com",
    });

    // update block does NOT overwrite plan — only domain and updatedAt
    const call = vi.mocked(prisma.shop.upsert).mock.calls[0][0];
    expect(call.update).not.toHaveProperty("plan");
  });
});

describe("getShopByDomain", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns shop when found", async () => {
    vi.mocked(prisma.shop.findUnique).mockResolvedValueOnce(mockShop);

    const result = await getShopByDomain("test-store.myshopify.com");

    expect(prisma.shop.findUnique).toHaveBeenCalledWith({
      where: { domain: "test-store.myshopify.com" },
    });
    expect(result).toEqual(mockShop);
  });

  it("returns null when shop not found", async () => {
    vi.mocked(prisma.shop.findUnique).mockResolvedValueOnce(null);

    const result = await getShopByDomain("unknown.myshopify.com");

    expect(result).toBeNull();
  });
});

describe("getShopById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns shop by shopId", async () => {
    vi.mocked(prisma.shop.findUnique).mockResolvedValueOnce(mockShop);

    const result = await getShopById("test-store.myshopify.com");

    expect(prisma.shop.findUnique).toHaveBeenCalledWith({
      where: { shopId: "test-store.myshopify.com" },
    });
    expect(result).toEqual(mockShop);
  });
});
