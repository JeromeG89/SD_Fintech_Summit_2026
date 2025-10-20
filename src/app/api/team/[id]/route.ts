// app/api/teams/route.ts (Next 13+ App Router)
import { NextResponse } from "next/server";
import { db } from "@/db";
import { teams, signups } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
	try {
		// Get all teams with their signups
		const allTeams = await db.query.teams.findMany({
			with: {
				members: true, // assuming relation defined in Drizzle
			},
		});

		// Or join manually if relations are not set
		const result = await Promise.all(
			allTeams.map(async (team) => {
				const members = await db.query.signups.findMany({
					where: eq(signups.teamId, team.id),
				});
				return { ...team, members };
			})
		);

		return NextResponse.json(result);
	} catch (err) {
		console.error("Error fetching teams:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
