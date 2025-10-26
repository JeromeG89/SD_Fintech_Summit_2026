"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Signup {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	faculty: string;
	major: string;
}

interface Team {
	id: number;
	name: string;
	size: number;
	problemStatement: string;
	members: Signup[];
}

export default function TeamPage() {
	const params = useParams();
	const teamId = params.id;
	const [team, setTeam] = useState<Team | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!teamId) return;

		fetch(`/api/team/${teamId}`)
			.then((res) => res.json())
			.then((data) => setTeam(data))
			.finally(() => setLoading(false));
	}, [teamId]);

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center text-white">
				Loading...
			</div>
		);

	if (!team)
		return (
			<div className="min-h-screen flex items-center justify-center text-white">
				<p>{team ?? "Team not found"}</p>
			</div>
		);

	return (
		<main className="min-h-screen bg-gradient-to-b from-indigo-950 to-indigo-800 px-4 py-12 flex justify-center">
			<div className="max-w-3xl w-full bg-indigo-900 shadow-xl rounded-2xl p-8 text-white space-y-6">
				<h1 className="text-4xl font-extrabold mb-6 text-gold-500">
					{team.name}
				</h1>
				<p className="text-gray-300">
					Problem Statement: {team.problemStatement}
				</p>
				<p className="text-gray-300">Team Size: {team.size}</p>

				<div className="mt-4">
					<h2 className="font-semibold text-white mb-2">Members:</h2>
					<ul className="list-disc list-inside text-gray-300 space-y-1">
						{(team.members || []).map((member) => (
							<li key={member.id}>
								{member.firstName} {member.lastName} (
								{member.email})
							</li>
						))}
					</ul>
				</div>
			</div>
		</main>
	);
}
