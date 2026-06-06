import { index, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const trafficSourceEnum = ["direct", "search", "referral", "social", "email"] as const;

export const analytics = pgTable(
  "analytics",
  {
    id: text("id").primaryKey(),
    date: timestamp("date").notNull(),
    visitors: integer("visitors").notNull().default(0),
    pageViews: integer("page_views").notNull().default(0),
    uniqueVisitors: integer("unique_visitors").notNull().default(0),
    source: varchar("source", { length: 50 }),
    page: varchar("page", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("analytics_date_idx").on(table.date),
    index("analytics_date_source_idx").on(table.date, table.source),
    index("analytics_page_idx").on(table.page),
  ],
);

export type Analytics = typeof analytics.$inferSelect;
export type NewAnalytics = typeof analytics.$inferInsert;
