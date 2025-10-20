import { NextResponse } from "next/server";
import { db } from "@/db";
import { signups, teams } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
	try {
		const {
			firstName,
			lastName,
			email,
			faculty,
			major,
			interest,
			teamName,
			isIndividual,
		} = await req.json();

		if (!firstName || !lastName || !email || !teamName) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Ensure team exists
		let team;
		if (!!teamName && !isIndividual) {
			await db.query.teams.findFirst({
				where: eq(teams.name, teamName),
			});
		}
		if (!team && !isIndividual) {
			const [inserted] = await db
				.insert(teams)
				.values({ name: teamName })
				.returning();
			team = inserted;
		}

		// Insert signup
		await db.insert(signups).values({
			firstName,
			lastName,
			email,
			faculty,
			major,
			interest,
			teamId: team?.id,
		});

		return NextResponse.json({ success: true });
	} catch (err: any) {
		const pgError = err.cause ?? err;

		if (pgError.code === "23505") {
			return NextResponse.json(
				{ error: "This email is already registered." },
				{ status: 409 }
			);
		}

		console.error("Signup error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
