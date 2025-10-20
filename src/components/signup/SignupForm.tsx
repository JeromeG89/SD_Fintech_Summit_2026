"use client";

import { useState } from "react";

export default function SignupForm() {
	const [status, setStatus] = useState<string | null>(null);

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
				establish relationship with industry leaders.
			</p>

			<form onSubmit={handleSubmit} className="space-y-6">
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
							className="w-full rounded-lg border-2 border-white bg-transparent text-white placeholder-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						>
							<option value="">Select Faculty</option>
							<option>School of Computing</option>
							<option>Business</option>
							<option>Engineering</option>
						</select>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-1">
							Major*
						</label>
						<select
							name="major"
							required
							className="w-full rounded-lg border-2 border-white bg-transparent text-white placeholder-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						>
							<option value="">Select Major</option>
							<option>Computer Science</option>
							<option>Finance</option>
							<option>Information Systems</option>
						</select>
					</div>
				</div>
				<div className="w-full border-t border-white my-2"></div>
				<label className="block text-lg font-bold mb-1 uppercase">
					Hackathon
				</label>
				{/* Participant Type */}
				<div>
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
									defaultChecked
									className="peer h-5 w-5 accent-gold-500"
								/>
								<span className="font-medium">
									Yes, I am applying as a team
								</span>

								{/* Border highlight when selected */}
								<div className="absolute inset-0 pointer-events-none border-2 rounded-lg border-transparent peer-checked:border-yellow-500"></div>
							</label>

							<label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer relative">
								<input
									type="radio"
									name="participantType"
									value="individual"
									className="peer h-5 w-5 accent-gold-500"
								/>
								<span className="font-medium">
									No, I am applying as an individual
									participant for now
								</span>

								<div className="absolute inset-0 pointer-events-none border-2 rounded-lg border-transparent peer-checked:border-yellow-500"></div>
							</label>
						</div>
					</div>
				</div>

				{/* Team Name & Size */}
				<div className="flex gap-4">
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-1">
							Team Name
						</label>
						<input
							type="text"
							name="teamName"
							className="w-full rounded-lg border-2 border-white bg-transparent text-white placeholder-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-1">
							Team Size
						</label>
						<select
							name="teamSize"
							className="w-full rounded-lg border-2 border-white bg-transparent text-white placeholder-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						>
							<option value="">Select Size</option>
							<option>2</option>
							<option>3</option>
							<option>4</option>
						</select>
					</div>
				</div>

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
							{/* Border highlight on selection */}
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
						information provided is accurate to the best of my
						knowledge. I understand that participation in the
						hackathon is subject to the organizer's approval. I
						consent to the use of any photo or video material taken
						during the event by the organizers for promotional
						purposes, including but not limited to social media,
						websites, and future marketing materials. I also
						understand that any submissions, ideas, and projects
						developed during the hackathon may be publicly showcased
						or shared with the organizing team, partners, and the
						organization that presented the challenge we worked on.
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
