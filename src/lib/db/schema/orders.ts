import { index, jsonb, numeric, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";

export const orderStatusEnum = ["pending", "completed", "failed", "refunded"] as const;
export const orderTypeEnum = ["order", "pack", "subscription", "refund"] as const;
export const paymentMethodEnum = ["mobile_money", "card", "cash", "bank_transfer"] as const;

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
    type: varchar("type", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
    items: jsonb("items").notNull(),
    metadata: jsonb("metadata"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("orders_userId_createdAt_idx").on(table.userId, table.createdAt),
    index("orders_status_idx").on(table.status),
    index("orders_type_idx").on(table.type),
    index("orders_createdAt_idx").on(table.createdAt),
  ],
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export interface OrderItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  icon?: string;
}
