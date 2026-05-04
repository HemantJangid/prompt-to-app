import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "#app/": path.resolve("./app") + "/",
    },
  },
  test: {
    environment: "node",
    include: ["app/**/__tests__/**/*.test.ts", "app/**/*.test.ts"],
    globals: false,
  },
});
