import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const shells = sqliteTable("shells", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  distro: text("distro").notNull(),
  name: text("name").notNull(),
  port: integer("port").notNull(),
  password: text("password").notNull(),
  extraArgs: text("extraArgs"),
  running: integer("running", { mode: "boolean" }),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});
