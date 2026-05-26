import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";
import { vendors } from "./vendors";

export const pendingActions = pgTable("pending_actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id, { onDelete: "cascade" }),
  requestedBy: text("requested_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  actionType: varchar("action_type", { length: 50 }).notNull(), // 'delete'
  targetType: varchar("target_type", { length: 50 }).notNull(), // 'vendor' | 'service' | 'category' | 'resource' | 'member'
  targetId: uuid("target_id").notNull(),
  targetName: varchar("target_name", { length: 255 }), // pour affichage sans lookup
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending' | 'approved' | 'rejected'
  reviewedBy: text("reviewed_by").references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at"),
  reason: text("reason"), // justification optionnelle du demandeur
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PendingAction = typeof pendingActions.$inferSelect;
export type NewPendingAction = typeof pendingActions.$inferInsert;
