import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const shells = sqliteTable("shells", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  distro: text("distro").notNull(),
  name: text("name").notNull(),
  port: integer("port").notNull(),
  password: text("password").notNull(),
});
