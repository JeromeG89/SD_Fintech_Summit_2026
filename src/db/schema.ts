import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const signups = pgTable("signups", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  faculty: text("faculty").notNull(),
  major: text("major").notNull(),
  interest: text("interest"),
  teamId: integer("team_id").references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow(),
});
