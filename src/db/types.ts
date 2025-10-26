import { signups, teams } from "./schema";

export type SignupRow   = typeof signups.$inferSelect; 
export type SignupInsert = typeof signups.$inferInsert;
export type TeamRow     = typeof teams.$inferSelect;
export type TeamInsert  = typeof teams.$inferInsert;

export type SignupRequest = Omit<SignupInsert, "teamId"> & { teamName: string };