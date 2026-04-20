import { decimal, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

import { orders } from "./orders";
import { users } from "./users";

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // billing, delivery, pickup
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull().default("Kinshasa"),
  district: varchar("district", { length: 100 }), // Gombe, Ngaliema, etc.
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  notes: text("notes"),
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
