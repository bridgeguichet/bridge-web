import { pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";
import { vendors } from "./vendors";

export const vendorMembers = pgTable(
  "vendor_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendors.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).notNull(), // 'admin' | 'manager' | 'operator'
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.vendorId, table.userId)],
);

export type VendorMember = typeof vendorMembers.$inferSelect;
export type NewVendorMember = typeof vendorMembers.$inferInsert;
