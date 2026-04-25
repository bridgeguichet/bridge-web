import { decimal, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { services, serviceVariants } from "./services";
import { users } from "./users";
import { vendors } from "./vendors";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerId: text("customer_id")
    .notNull()
    .references(() => users.id),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, confirmed, in_progress, completed, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).default("0"), // Phase 3
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("pending"), // pending, completed, failed, refunded
  paymentMethod: varchar("payment_method", { length: 50 }), // mobile_money, card, cash
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id),
  variantId: uuid("variant_id").references(() => serviceVariants.id),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  metadata: jsonb("metadata"), // Détails réservation (date, heure, lieu, etc.)
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
