import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const teams = pgTable("teams", {
	id: serial("id").primaryKey(),
	name: text("name").notNull().unique(),
	size: integer("size").notNull(),
	problemStatement: text("problem_statement").notNull(),
	adminId: integer("admin_id").references(() => signups.id),
	signupId: integer("signup_id").references(() => signups.id),
});
export const teamRelations = relations(teams, ({ many, one }) => ({
	members: many(signups),
	admin: one(signups, {
		fields: [teams.adminId],
		references: [signups.id],
	}),
}));

export const signups = pgTable("signups", {
	id: serial("id").primaryKey(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
	faculty: text("faculty").notNull(),
	major: text("major").notNull(),
	interest: text("interest"),
	createdAt: timestamp("created_at").defaultNow(),
});
