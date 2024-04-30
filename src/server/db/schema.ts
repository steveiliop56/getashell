import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const shells = sqliteTable("shells", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  distro: text("distro").notNull(),
  name: text("name").notNull(),
  port: integer("port").notNull(),
  password: text("password").notNull(),
  extraArgs: text("extraArgs"),
  running: integer("running", { mode: "boolean" }),
});
