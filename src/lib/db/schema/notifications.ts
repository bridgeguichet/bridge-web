import { index, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";

export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 100 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    data: jsonb("data"),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("notifications_userId_createdAt_idx").on(table.userId, table.createdAt),
    index("notifications_userId_readAt_idx").on(table.userId, table.readAt),
  ],
);

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
