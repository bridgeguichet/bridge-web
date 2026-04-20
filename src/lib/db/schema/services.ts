import { decimal, integer, jsonb, pgTable, text, time, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { categories, subcategories } from "./categories";
import { vendors } from "./vendors";

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  subcategoryId: uuid("subcategory_id").references(() => subcategories.id),
  nameFr: varchar("name_fr", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  priceUnit: varchar("price_unit", { length: 50 }).notNull(), // hour, day, month, unit
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, draft, archived
  metadata: jsonb("metadata"), // Configuration spécifique par type de service
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const serviceVariants = pgTable("service_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  nameFr: varchar("name_fr", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  priceModifier: decimal("price_modifier", { precision: 10, scale: 2 }).notNull(), // Prix absolu ou différence
  metadata: jsonb("metadata"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const serviceAvailability = pgTable("service_availability", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (dimanche-samedi)
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type ServiceVariant = typeof serviceVariants.$inferSelect;
export type NewServiceVariant = typeof serviceVariants.$inferInsert;
export type ServiceAvailability = typeof serviceAvailability.$inferSelect;
export type NewServiceAvailability = typeof serviceAvailability.$inferInsert;
