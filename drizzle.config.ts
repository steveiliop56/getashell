import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/sqlite.db",
  },
  schema: "./src/server/db/schema.ts",
  out: "./migrations",
  breakpoints: true,
});
