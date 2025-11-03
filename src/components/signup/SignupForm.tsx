"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SuccessModal } from "./SuccessModal";

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
		<div className="max-w-5xl w-full bg-indigo-950/90 backdrop-blur-sm shadow-2xl rounded-3xl p-6 md:p-8 text-white border border-indigo-800/50">
			<h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-header-color text-center">
				NUS Fintech Summit Hackathon 2026
			</h1>
			<p className="text-center text-base md:text-lg text-gray-300 mb-8 leading-relaxed">
				NUS Fintech Summit aims to educate students with Fintech knowledge
				through events and industry projects, and connect and establish
				relationships with industry leaders.
			</p>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* General Information */}
				<div className="w-full h-px bg-gradient-to-r from-transparent via-header-color to-transparent my-4"></div>
				<label className="block text-xl font-bold mb-4 text-header-color uppercase tracking-wide">
				General Information
				</label>

				{/* First & Last Name */}
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-2 text-gray-200">
						First Name*
						</label>
						<input
							type="text"
							name="firstName"
							required
							className="w-full rounded-xl border-2 border-gray-400/50 bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70"
						/>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-2 text-gray-200">
							Last Name*
						</label>
						<input
							type="text"
							name="lastName"
							required
							className="w-full rounded-xl border-2 border-gray-400/50 bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70"
						/>
					</div>
				</div>

				{/* Email */}
				<div>
					<label className="block text-sm font-semibold mb-2 text-gray-200">
						Email*
					</label>
					<input
						type="email"
						name="email"
						required
						className="w-full rounded-xl border-2 border-gray-400/50 bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70"
					/>
				</div>

				{/* Faculty & Major */}
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-2 text-gray-200">
						Faculty*
						</label>
						<input
							type="text"
							name="faculty"
							required
							className="w-full rounded-xl border-2 border-gray-400/50 bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70"
							placeholder="Enter Faculty"
						/>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-2 text-gray-200">
							Major*
						</label>
						<input
							type="text"
							name="major"
							required
							className="w-full rounded-xl border-2 border-gray-400/50 bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70"
							placeholder="Enter Major"
						/>
					</div>
				</div>

				{/* Hackathon Section */}
				<div className="w-full h-px bg-gradient-to-r from-transparent via-header-color to-transparent my-4"></div>
				<label className="block text-xl font-bold mb-4 text-header-color uppercase tracking-wide">
					Hackathon
				</label>

				{/* Participant Type */}
				<div>
					<label className="block text-sm font-semibold mb-4 text-gray-200">
						Please indicate if you are applying as a team
					</label>
					<div className="flex flex-col space-y-3">
						<label className="flex items-center gap-4 p-4 border-2 border-gray-400/50 rounded-xl cursor-pointer relative bg-white/5 hover:bg-white/10 transition-all duration-200">
							<input
								type="radio"
								name="participantType"
								value="team"
								checked={participantType === "team"}
								onChange={() => setParticipantType("team")}
								className="peer h-5 w-5 accent-about-button"
							/>
							<span className="font-medium text-gray-200">
								Yes, I am applying as a team
							</span>
							<div className="absolute inset-0 pointer-events-none border-2 rounded-xl border-transparent peer-checked:border-about-button"></div>
						</label>

						<label className="flex items-center gap-4 p-4 border-2 border-gray-400/50 rounded-xl cursor-pointer relative bg-white/5 hover:bg-white/10 transition-all duration-200">
							<input
								type="radio"
								name="participantType"
								value="individual"
								checked={participantType === "individual"}
								onChange={() => 
									setParticipantType("individual")
								}
								className="peer h-5 w-5 accent-about-button"
							/>
							<span className="font-medium text-gray-200">
								No, I am applying as an individual participant
							</span>
							<div className="absolute inset-0 pointer-events-none border-2 rounded-xl border-transparent peer-checked:border-about-button"></div>
						</label>
					</div>
				</div>

				{/* Team Name & Size (only show if participantType === 'team') */}
				{participantType === "team" && (
					<div className="space-y-6">
						<div>
							<div className="flex border-2 border-gray-400/50 rounded-xl overflow-hidden w-fit mb-6 bg-white/5">
								<button
								type="button"
								onClick={() => setJoinTeam(false)}
								className={`px-6 py-3 transition-all duration-200 font-semibold ${
									!joinTeam
									? "bg-about-button text-white shadow-lg"
									: "bg-transparent text-gray-300 hover:bg-white/10"
								}`}
								>
									New Team
								</button>
								<button
								type="button"
								onClick={() => setJoinTeam(true)}
								className={`px-6 py-3 transition-all duration-200 font-semibold ${
									joinTeam
									? "bg-about-button text-white shadow-lg"
									: "bg-transparent text-gray-300 hover:bg-white/10"
								}`}
								>
									Existing Team
								</button>
							</div>

									{joinTeam ? (
										// Join existing team
										<div>
											<label className="block text-sm font-semibold mb-2 text-gray-200">
												Existing Team Name or ID
											</label>
											<input
												type="text"
												name="teamName"
												value={teamSearch}
												onChange={(e) => setTeamSearch(e.target.value)}
												className="w-full rounded-xl border-2 border-gray-400/50 bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70"
												placeholder="Enter existing team name or ID"
											/>
										</div>
									) : (
										<div className="flex flex-col md:flex-row gap-4">
											<div className="flex-1">
												<label className="block text-sm font-semibold mb-2 text-gray-200">
													New Team Name
												</label>
												<input
													type="text"
													name="teamName"
													className="w-full rounded-xl border-2 border-gray-400/50 bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70"
													placeholder="Enter new team name"
												/>
											</div>
											<div className="flex-1">
												<label className="block text-sm font-semibold mb-2 text-gray-200">
													Team Size
												</label>
												<select
													name="teamSize"
													className="w-full rounded-xl border-2 border-gray-400/50 bg-white/10 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70"
												>
													<option className="bg-gray-800 text-white" value="">
														Select Size
													</option>
													<option className="bg-gray-800 text-white">
														2
													</option>
													<option className="bg-gray-800 text-white">
														3
													</option>
													<option className="bg-gray-800 text-white">
														4
													</option>
												</select>
											</div>
										</div>
									)}
								</div>
							</div>
						)}

				{/* Problem Statement */}
				{!joinTeam && <div>
					<label className="block text-sm font-semibold mb-4 text-gray-200">
						Please select the Problem Statement
					</label>
					<div className="flex flex-col space-y-3">
						<label className="relative flex items-start gap-4 p-4 border-2 border-gray-400/50 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-200">
							<input
								type="radio"
								name="problemStatement"
								value="ps1"
								required
								className="peer h-5 w-5 accent-about-button mt-1"
							/>
							<span className="font-medium text-gray-200 leading-relaxed">
								How can AI and machine learning be applied to enhance compliance
								and risk management for financial institutions leveraging
								blockchain?
							</span>
							<div className="absolute inset-0 border-2 rounded-xl border-transparent peer-checked:border-about-button pointer-events-none"></div>
						</label>

						<label className="relative flex items-start gap-4 p-4 border-2 border-gray-400/50 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-200">
							<input
								type="radio"
								name="problemStatement"
								value="ps2"
								required
								className="peer h-5 w-5 accent-about-button mt-1"
							/>
							<span className="font-medium text-gray-200 leading-relaxed">
								How can AI and machine learning improve fintech user experience
								and engagement?
							</span>
							<div className="absolute inset-0 border-2 rounded-xl border-transparent peer-checked:border-about-button pointer-events-none"></div>
						</label>
					</div>
				</div>}

				{/* Disclaimer */}
				<div className="flex flex-col gap-4 p-4 bg-white/5 rounded-xl border border-gray-400/30">
					<label className="block text-sm font-semibold text-gray-200">
						Disclaimer
					</label>
					<p className="text-sm text-gray-300 leading-relaxed">
						By submitting this application, I confirm that the information
						provided is accurate and I agree to the terms and conditions of the
						NUS Fintech Summit Hackathon 2026.
					</p>
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							name="disclaimer"
							required
							className="h-5 w-5 rounded-md accent-about-button"
						/>
						<span className="text-sm text-gray-200 font-medium">
						I agree to the terms and conditions.
						</span>
					</div>
				</div>

				<div className="w-full flex justify-center pt-4">
					<button
						type="submit"
						className="text-lg bg-about-button text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:bg-about-button/90 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
					>
						Submit Application
					</button>
				</div>
			</form>

			{status && (
				<div
				className={`mt-6 p-4 rounded-xl text-center font-semibold ${
					status.includes("✅")
					? "bg-green-500/20 text-green-300 border border-green-500/30"
					: "bg-red-500/20 text-red-300 border border-red-500/30"
				}`}
				>
				{status}
				</div>
			)}
			</div>
		);
}
