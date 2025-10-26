// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { signups, teams } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";

export async function POST(req: Request) {
	try {
		const {
			firstName,
			lastName,
			email,
			faculty,
			major,
			participantType,
			teamName,
			teamSize,
			problemStatement,
			disclaimer,
			joinTeam,
		} = await req.json();

		if (!firstName || !lastName || !email) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		if (participantType === "team" && !teamName) {
			return NextResponse.json(
				{ error: "Team name is required for team participants" },
				{ status: 400 }
			);
		}
		let team;
		team = await db.query.teams.findFirst({
			where: ilike(teams.name, teamName),
		});
		if (!joinTeam && team) { //Create team but exists
			return NextResponse.json(
				{
					error: "Team name already exists. Please use a different team name.",
				},
				{ status: 404 }
			);
		} else if (joinTeam && !team) { //Join team but dont exist
			return NextResponse.json(
				{
					error: "Team not found. Please check the team name or ID.",
				},
				{ status: 404 }
			);
		}

		const [newSignup] = await db
			.insert(signups)
			.values({ firstName, lastName, email, faculty, major,  })
			.returning();

		// Create team
		if (participantType === "team" && !joinTeam) { 
				const [insertedTeam] = await db
					.insert(teams)
					.values({
						name: teamName,
						size: teamSize,
						problemStatement,
						adminId: newSignup.id, // the new signup becomes admin
						signupId: newSignup.id,
					})
					.returning();

				team = insertedTeam;
			}

		return NextResponse.json({ success: true, signup: newSignup, team });
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
