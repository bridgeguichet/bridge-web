import { decimal, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { categories } from "./categories";
import { services, serviceVariants } from "./services";
import { users } from "./users";

export const customPacks = pgTable("custom_packs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, finalized
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  metadata: jsonb("metadata"), // Current category index, skipped categories, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const packItems = pgTable("pack_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  packId: uuid("pack_id")
    .notNull()
    .references(() => customPacks.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id),
  variantId: uuid("variant_id").references(() => serviceVariants.id),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  metadata: jsonb("metadata"), // Additional service details
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export type CustomPack = typeof customPacks.$inferSelect;
export type NewCustomPack = typeof customPacks.$inferInsert;
export type PackItem = typeof packItems.$inferSelect;
export type NewPackItem = typeof packItems.$inferInsert;
