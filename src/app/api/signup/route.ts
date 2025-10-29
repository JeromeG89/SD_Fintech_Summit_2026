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
			interest,
			teamName,
			teamSize,
			participantType,
			problemStatement,
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

		const [newSignup] = await db
			.insert(signups)
			.values({ firstName, lastName, email, faculty, major, interest })
			.returning();

		// Create or join existing team
		let team;
		if (participantType === "team") {
			if (joinTeam) {
				team = await db.query.teams.findFirst({
					where: ilike(teams.name, teamName),
				});

				if (!team) {
					return NextResponse.json(
						{
							error: "Team not found. Please check the team name or ID.",
						},
						{ status: 404 }
					);
				}
			} else {
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
		}

		return NextResponse.json({ success: true, signup: newSignup, team });
	} catch (err: any) {
		const pgError = err.cause ?? err;

		// Handle unique constraint violations (e.g., duplicate email or team name)
		if (pgError.code === "23505") {
			// Check the error detail to see which constraint was violated
			if (pgError.detail?.includes("email")) {
				return NextResponse.json(
					{ error: "This email is already registered.", field: "email" },
					{ status: 409 }
				);
			}
			// The unique constraint on the teams table is on the 'name' column
			if (pgError.detail?.includes("name")) {
				return NextResponse.json(
					{ error: "A team with this name already exists.", field: "teamName" },
					{ status: 409 }
				);
			}
			// Fallback for any other unique constraint violation
			return NextResponse.json(
				{ error: "A unique value is already in use." },
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