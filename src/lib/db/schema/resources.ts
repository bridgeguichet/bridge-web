import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { orderItems } from "./orders";
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

export const orderAssignments = pgTable("order_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderItemId: uuid("order_item_id")
    .notNull()
    .references(() => orderItems.id, { onDelete: "cascade" }),
  resourceId: uuid("resource_id")
    .notNull()
    .references(() => resources.id),
  status: varchar("status", { length: 50 }).notNull().default("assigned"), // assigned, in_progress, completed, cancelled
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  notes: varchar("notes", { length: 500 }),
});

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
export type OrderAssignment = typeof orderAssignments.$inferSelect;
export type NewOrderAssignment = typeof orderAssignments.$inferInsert;
