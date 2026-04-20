import { decimal, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { orders } from "./orders";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: varchar("method", { length: 50 }).notNull(), // mobile_money, card, cash
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, completed, failed, refunded
  providerReference: varchar("provider_reference", { length: 255 }),
  metadata: jsonb("metadata"), // Données spécifiques au provider
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
