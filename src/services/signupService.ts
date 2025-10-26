import { db } from "@/db";
import { signups, teams } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

import type {
  SignupRow,
  SignupInsert,
  TeamRow,
  TeamInsert,
  SignupRequest,
} from "@/db/types";



export async function findSignup(email: string): Promise<SignupRow | null> {
  const rows = await db
    .select()
    .from(signups)
    .where(eq(sql`lower(${signups.email})`, email.toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}

export async function createSignup(
  input: SignupRequest
): Promise<{ signup: SignupRow; team: TeamRow }> {
  const existing = await findSignup(input.email);
  if (existing) {
    const err = new Error("Email already registered.");
    (err as any).status = 409;
    (err as any).code = "EMAIL_TAKEN";
    throw err;
  }

  const [team] = await db
    .insert(teams)
    .values({ name: input.teamName } satisfies TeamInsert)
    .onConflictDoUpdate({
      target: teams.name,
      set: { name: input.teamName },
    })
    .returning();

  const [signup] = await db
    .insert(signups)
    .values({
      name: input.name,
      email: input.email.toLowerCase(),
      organisation: input.organisation ?? null,
      interest: input.interest ?? null,
      teamId: team.id,
    } satisfies SignupInsert)
    .onConflictDoNothing({ target: signups.email })
    .returning();

  if (!signup) {
    const err = new Error("Email already registered.");
    (err as any).status = 409;
    (err as any).code = "EMAIL_TAKEN";
    throw err;
  }

  return { signup, team };
}
