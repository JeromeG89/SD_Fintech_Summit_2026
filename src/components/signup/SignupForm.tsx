"use client";

import { useState } from "react";

export default function SignupForm() {
	const [status, setStatus] = useState<string | null>(null);
	const [participantType, setParticipantType] = useState<
		"team" | "individual"
	>("team");
	const [joinTeam, setJoinTeam] = useState<boolean>(false);
	const [teamSearch, setTeamSearch] = useState<string>("");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);

		const data = {
			firstName: formData.get("firstName") as string,
			lastName: formData.get("lastName") as string,
			email: formData.get("email") as string,
			faculty: formData.get("faculty") as string,
			major: formData.get("major") as string,
			participantType: formData.get("participantType") as string,
			teamName: formData.get("teamName") as string,
			teamSize: formData.get("teamSize") as string,
			problemStatement: formData.get("problemStatement") as string,
			disclaimer: formData.get("disclaimer") === "on",
			joinTeam,
		};

		const res = await fetch("/api/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (res.ok) {
			setStatus("✅ Thanks for signing up!");
			form.reset();
		} else {
			const err = await res.json();
			setStatus(`❌ ${err.error}`);
		}
	}

	return (
		<div className="max-w-5xl w-full bg-indigo-900 shadow-xl rounded-2xl p-8 text-white">
			<h1 className="text-4xl font-extrabold mb-6 text-gold-500">
				NUS Fintech Summit Hackathon 2026
			</h1>
			<p className="text-left text-lg text-gray-200 mb-8">
				NUS Fintech Summit aims to educate students with Fintech
				knowledge through events and industry projects, and connect and
				establish relationships with industry leaders.
			</p>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* General Information */}
				<div className="w-full border-t border-white my-2"></div>
				<label className="block text-lg font-bold mb-1 uppercase">
					General Information
				</label>

				{/* First & Last Name */}
				<div className="flex gap-4">
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-1">
							First Name*
						</label>
						<input
							type="text"
							name="firstName"
							required
							className="w-full rounded-lg border-2 border-white bg-transparent text-white placeholder-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-1">
							Last Name*
						</label>
						<input
							type="text"
							name="lastName"
							required
							className="w-full rounded-lg border-2 border-white bg-transparent text-white placeholder-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
				</div>

				{/* Email */}
				<div>
					<label className="block text-sm font-semibold mb-1">
						Email*
					</label>
					<input
						type="email"
						name="email"
						required
						className="w-full rounded-lg border-2 border-white bg-transparent text-white placeholder-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
					/>
				</div>

				{/* Faculty & Major */}
				<div className="flex gap-4">
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-1">
							Faculty*
						</label>
						<select
							name="faculty"
							required
							className="w-full rounded-lg border-2 border-white bg-transparent text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
						>
							<option className="bg-gray-800" value="">
								Select Faculty
							</option>
							<option className="bg-gray-800">
								School of Computing
							</option>
							<option className="bg-gray-800">Business</option>
							<option className="bg-gray-800">Engineering</option>
						</select>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-1">
							Major*
						</label>
						<select
							name="major"
							required
							className="w-full rounded-lg border-2 border-white bg-transparent text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
						>
							<option className="bg-gray-800" value="">
								Select Major
							</option>
							<option className="bg-gray-800">
								Computer Science
							</option>
							<option className="bg-gray-800">Finance</option>
							<option className="bg-gray-800">
								Information Systems
							</option>
						</select>
					</div>
				</div>

				{/* Hackathon Section */}
				<div className="w-full border-t border-white my-2"></div>
				<label className="block text-lg font-bold mb-1 uppercase">
					Hackathon
				</label>

				{/* Participant Type */}
				<div>
					<label className="block text-sm font-semibold mb-2">
						Please indicate if you are applying as a team
					</label>
					<div className="flex flex-col space-y-3">
						<label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer relative">
							<input
								type="radio"
								name="participantType"
								value="team"
								checked={participantType === "team"}
								onChange={() => setParticipantType("team")}
								className="peer h-5 w-5 accent-gold-500"
							/>
							<span className="font-medium">
								Yes, I am applying as a team
							</span>
							<div className="absolute inset-0 pointer-events-none border-2 rounded-lg border-transparent peer-checked:border-yellow-500"></div>
						</label>

						<label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer relative">
							<input
								type="radio"
								name="participantType"
								value="individual"
								checked={participantType === "individual"}
								onChange={() =>
									setParticipantType("individual")
								}
								className="peer h-5 w-5 accent-gold-500"
							/>
							<span className="font-medium">
								No, I am applying as an individual participant
							</span>
							<div className="absolute inset-0 pointer-events-none border-2 rounded-lg border-transparent peer-checked:border-yellow-500"></div>
						</label>
					</div>
				</div>

				{/* Team Name & Size (only show if participantType === 'team') */}
				{participantType === "team" && (
					<div className="flex gap-4">
						<div className="flex-1">
							{participantType === "team" && (
								<div>
									<div className="flex border-2 border-gray-600 rounded-lg overflow-hidden w-fit mb-4">
										<button
											type="button"
											onClick={() => setJoinTeam(false)}
											className={`px-5 py-2 transition-colors duration-200 font-medium ${
												!joinTeam
													? "bg-yellow-500 text-white"
													: "bg-gray-700 text-gray-300 hover:bg-gray-600"
											}`}
										>
											New Team
										</button>
										<button
											type="button"
											onClick={() => setJoinTeam(true)}
											className={`px-5 py-2 transition-colors duration-200 font-medium ${
												joinTeam
													? "bg-yellow-500 text-white"
													: "bg-gray-700 text-gray-300 hover:bg-gray-600"
											}`}
										>
											Existing Team
										</button>
									</div>

									{joinTeam ? (
										// Join existing team
										<div>
											<label className="block text-sm font-semibold mb-1">
												Existing Team Name or ID
											</label>
											<input
												type="text"
												value={teamSearch}
												onChange={(e) =>
													setTeamSearch(
														e.target.value
													)
												}
												className="w-full rounded-lg border-2 border-white bg-transparent text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
												placeholder="Enter existing team name or ID"
											/>
										</div>
									) : (
										<div className="flex gap-4">
											<div className="flex-1">
												<label className="block text-sm font-semibold mb-1">
													New Team Name
												</label>
												<input
													type="text"
													name="teamName"
													className="p-2 rounded-lg w-full border-2 border-white bg-transparent text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
													placeholder="Enter new team name"
												/>
											</div>
											<div className="flex-1">
												<label className="block text-sm font-semibold mb-1">
													Team Size
												</label>
												<select
													name="teamSize"
													className="w-full rounded-lg border-2 border-white bg-transparent text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
												>
													<option
														className="bg-gray-800"
														value=""
													>
														Select Size
													</option>
													<option className="bg-gray-800">
														2
													</option>
													<option className="bg-gray-800">
														3
													</option>
													<option className="bg-gray-800">
														4
													</option>
												</select>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				)}

				{/* Problem Statement */}
				<div>
					<label className="block text-sm font-semibold mb-3">
						Please select the Problem Statement
					</label>
					<div className="flex flex-col space-y-3">
						<label className="relative flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer">
							<input
								type="radio"
								name="problemStatement"
								value="ps1"
								required
								className="peer h-5 w-5 accent-gold-500 mt-1"
							/>
							<span className="font-medium">
								How can AI and machine learning be applied to
								enhance compliance and risk management for
								financial institutions leveraging blockchain?
							</span>
							<div className="absolute inset-0 border-2 rounded-lg border-transparent peer-checked:border-yellow-400 pointer-events-none"></div>
						</label>

						<label className="relative flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer">
							<input
								type="radio"
								name="problemStatement"
								value="ps2"
								required
								className="peer h-5 w-5 accent-gold-500 mt-1"
							/>
							<span className="font-medium">
								How can AI and machine learning improve fintech
								user experience and engagement?
							</span>
							<div className="absolute inset-0 border-2 rounded-lg border-transparent peer-checked:border-yellow-400 pointer-events-none"></div>
						</label>
					</div>
				</div>

				{/* Disclaimer */}
				<div className="flex flex-col gap-2">
					<label className="block text-sm font-semibold">
						Disclaimer
					</label>
					<p className="text-sm">
						By submitting this application, I confirm that the
						information provided is accurate...
					</p>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							name="disclaimer"
							required
							className="h-5 w-5 rounded-md accent-gold-500"
						/>
						<span className="text-sm">I agree.</span>
					</div>
				</div>

				<div className="w-full flex justify-center">
					<button
						type="submit"
						className="text-lg bg-indigo-600 font-semibold py-2 px-8 rounded-xl shadow hover:bg-gold-600 transition-colors"
					>
						Submit
					</button>
				</div>
			</form>

			{status && (
				<p className="mt-6 text-center text-sm font-medium text-white">
					{status}
				</p>
			)}
		</div>
	);
}
