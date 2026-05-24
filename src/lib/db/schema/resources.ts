import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { vendors } from "./vendors";

export const resources = pgTable("resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // driver, vehicle, staff
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("available"), // available, busy, offline
  metadata: jsonb("metadata"), // Infos spécifiques (plaque véhicule, téléphone chauffeur, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
