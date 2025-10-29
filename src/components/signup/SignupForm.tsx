"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the validation schema using Zod
const formSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.string().min(1, "Email is required").email("Invalid email address"),
		faculty: z.string().min(1, "Please select a faculty"),
		major: z.string().min(1, "Please select a major"),
		participantType: z.enum(["team", "individual"]),
		joinTeam: z.boolean(),
		teamName: z.string().optional(),
		teamSize: z.string().optional(),
		teamSearch: z.string().optional(),
		problemStatement: z.enum(
			["ps1", "ps2"],
			"Please select a problem statement"
		).optional(), // Make optional here, superRefine will handle the logic
		disclaimer: z
			.boolean()
			.refine((val) => val === true, {
				message: "You must agree to the disclaimer",
			}),
	})
	.superRefine((data, ctx) => {
		if (data.participantType === "team") {
			if (data.joinTeam) {
				// User is joining an existing team
				if (!data.teamSearch || data.teamSearch.trim() === "") {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ["teamSearch"],
						message: "Team name or ID is required",
					});
				}
				// No problem statement needed when joining a team
			} else {
				// User is creating a new team
				if (!data.teamName || data.teamName.trim() === "") {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ["teamName"],
						message: "New team name is required",
					});
				}
				if (!data.teamSize || data.teamSize === "") {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ["teamSize"],
						message: "Please select a team size",
					});
				}
				if (!data.problemStatement) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ["problemStatement"],
						message: "Please select a problem statement",
					});
				}
			}
		} else {
			// Individual participant
			if (!data.problemStatement) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["problemStatement"],
					message: "Please select a problem statement",
				});
			}
		}
	});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

export default function SignupForm() {
	const [status, setStatus] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
		setValue,
		setError,
		reset,
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		shouldUnregister: false,
		defaultValues: {
			participantType: "team",
			joinTeam: false,
			disclaimer: false,
			faculty: "",
			major: "",
			teamSize: "",
		},
	});

	// Watch values to conditionally render parts of the form
	const participantType = watch("participantType");
	const joinTeam = watch("joinTeam");

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		setStatus(null);
		const res = await fetch("/api/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (res.ok) {
			setStatus("✅ Thanks for signing up!");
			reset();
		} else {
			const err = await res.json();
			// Handle server-side validation errors
			if (err.field && ["email", "teamName", "teamSearch"].includes(err.field)) {
				setError(err.field as "email" | "teamName" | "teamSearch", {
					type: "server",
					message: err.error,
				});
			} else {
				setStatus(`❌ ${err.error || "An unexpected error occurred."}`);
			}
		}
	};

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

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* General Information */}
				<div className="w-full h-px bg-gradient-to-r from-transparent via-header-color to-transparent my-4"></div>
				<label className="block text-xl font-bold mb-4 text-header-color uppercase tracking-wide">
					General Information
				</label>

				{/* First & Last Name */}
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-2 text-gray-200">
							First Name*
						</label>
						<input
							type="text"
							{...register("firstName")}
							className={`w-full rounded-xl border-2 ${
								errors.firstName
									? "border-red-500"
									: "border-gray-400/50"
							} bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70`}
						/>
						{errors.firstName && (
							<p className="text-red-400 text-sm mt-1">
								{errors.firstName.message}
							</p>
						)}
					</div>
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-2 text-gray-200">
							Last Name*
						</label>
						<input
							type="text"
							{...register("lastName")}
							className={`w-full rounded-xl border-2 ${
								errors.lastName ? "border-red-500" : "border-gray-400/50"
							} bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70`}
						/>
						{errors.lastName && (
							<p className="text-red-400 text-sm mt-1">
								{errors.lastName.message}
							</p>
						)}
					</div>
				</div>

				{/* Email */}
				<div>
					<label className="block text-sm font-semibold mb-2 text-gray-200">
						Email*
					</label>
					<input
						type="email"
						{...register("email")}
						className={`w-full rounded-xl border-2 ${
							errors.email ? "border-red-500" : "border-gray-400/50"
						} bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70`}
					/>
					{errors.email && (
						<p className="text-red-400 text-sm mt-1">
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Faculty & Major */}
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-2 text-gray-200">
							Faculty*
						</label>
						<select
							{...register("faculty")}
							className={`w-full rounded-xl border-2 ${
								errors.faculty ? "border-red-500" : "border-gray-400/50"
							} bg-white/10 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70`}
						>
							<option className="bg-gray-800 text-white" value="">
								Select Faculty
							</option>
							<option className="bg-gray-800 text-white">
								School of Computing
							</option>
							<option className="bg-gray-800 text-white">Business</option>
							<option className="bg-gray-800 text-white">Engineering</option>
						</select>
						{errors.faculty && (
							<p className="text-red-400 text-sm mt-1">
								{errors.faculty.message}
							</p>
						)}
					</div>
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-2 text-gray-200">
							Major*
						</label>
						<select
							{...register("major")}
							className={`w-full rounded-xl border-2 ${
								errors.major ? "border-red-500" : "border-gray-400/50"
							} bg-white/10 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70`}
						>
							<option className="bg-gray-800 text-white" value="">
								Select Major
							</option>
							<option className="bg-gray-800 text-white">
								Computer Science
							</option>
							<option className="bg-gray-800 text-white">Finance</option>
							<option className="bg-gray-800 text-white">
								Information Systems
							</option>
						</select>
						{errors.major && (
							<p className="text-red-400 text-sm mt-1">
								{errors.major.message}
							</p>
						)}
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
								value="team"
								{...register("participantType")}
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
								value="individual"
								{...register("participantType")}
								className="peer h-5 w-5 accent-about-button"
							/>
							<span className="font-medium text-gray-200">
								No, I am applying as an individual participant
							</span>
							<div className="absolute inset-0 pointer-events-none border-2 rounded-xl border-transparent peer-checked:border-about-button"></div>
						</label>
					</div>
				</div>

				{/* Team Name & Size (conditional) */}
				{participantType === "team" && (
					<div className="space-y-6">
						<div className="flex border-2 border-gray-400/50 rounded-xl overflow-hidden w-fit bg-white/5">
							<button
								type="button"
								onClick={() => setValue("joinTeam", false, { shouldValidate: true })}
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
								onClick={() => setValue("joinTeam", true, { shouldValidate: true })}
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
									Existing Team Name or ID*
								</label>
								<input
									type="text"
									{...register("teamSearch")}
									className={`w-full rounded-xl border-2 ${
										errors.teamSearch
											? "border-red-500"
											: "border-gray-400/50"
									} bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70`}
									placeholder="Enter existing team name or ID"
								/>
								{errors.teamSearch && (
									<p className="text-red-400 text-sm mt-1">
										{errors.teamSearch.message}
									</p>
								)}
							</div>
						) : (
							// Create new team
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="flex-1">
									<label className="block text-sm font-semibold mb-2 text-gray-200">
										New Team Name*
									</label>
									<input
										type="text"
										{...register("teamName")}
										className={`w-full rounded-xl border-2 ${
											errors.teamName
												? "border-red-500"
												: "border-gray-400/50"
										} bg-white/10 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70`}
										placeholder="Enter new team name"
									/>
									{errors.teamName && (
										<p className="text-red-400 text-sm mt-1">
											{errors.teamName.message}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label className="block text-sm font-semibold mb-2 text-gray-200">
										Team Size*
									</label>
									<select
										{...register("teamSize")}
										className={`w-full rounded-xl border-2 ${
											errors.teamSize
												? "border-red-500"
												: "border-gray-400/50"
										} bg-white/10 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-about-button focus:border-about-button transition-all duration-200 hover:border-gray-300/70`}
									>
										<option className="bg-gray-800" value="">
											Select Size
										</option>
										<option className="bg-gray-800">2</option>
										<option className="bg-gray-800">3</option>
										<option className="bg-gray-800">4</option>
									</select>
									{errors.teamSize && (
										<p className="text-red-400 text-sm mt-1">
											{errors.teamSize.message}
										</p>
									)}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Problem Statement (Conditionally rendered) */}
				{!joinTeam && (
					<div>
						<label className="block text-sm font-semibold mb-3">
							Please select the Problem Statement*
						</label>
						<div className="flex flex-col space-y-3">
							<label className="relative flex items-start gap-4 p-4 border-2 border-gray-400/50 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-200">
								<input
									type="radio"
									value="ps1"
									{...register("problemStatement")}
									className="peer h-5 w-5 accent-about-button mt-1"
								/>
								<span className="font-medium text-gray-200 leading-relaxed">
									How can AI and machine learning be applied to enhance
									compliance and risk management for financial institutions
									leveraging blockchain?
								</span>
								<div className="absolute inset-0 border-2 rounded-xl border-transparent peer-checked:border-about-button pointer-events-none"></div>
							</label>

							<label className="relative flex items-start gap-4 p-4 border-2 border-gray-400/50 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-200">
								<input
									type="radio"
									value="ps2"
									{...register("problemStatement")}
									className="peer h-5 w-5 accent-about-button mt-1"
								/>
								<span className="font-medium text-gray-200 leading-relaxed">
									How can AI and machine learning improve fintech user
									experience and engagement?
								</span>
								<div className="absolute inset-0 border-2 rounded-xl border-transparent peer-checked:border-about-button pointer-events-none"></div>
							</label>
						</div>
						{errors.problemStatement && (
							<p className="text-red-400 text-sm mt-3">
								{errors.problemStatement.message}
							</p>
						)}
					</div>
				)}

				{/* Disclaimer */}
				<div className="flex flex-col gap-4 p-4 bg-white/5 rounded-xl border border-gray-400/30">
					<label className="block text-sm font-semibold text-gray-200">
						Disclaimer*
					</label>
					<p className="text-sm text-gray-300 leading-relaxed">
						By submitting this application, I confirm that the information
						provided is accurate and I agree to the terms and conditions of the
						NUS Fintech Summit Hackathon 2026.
					</p>
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="disclaimer"
							{...register("disclaimer")}
							className="h-5 w-5 rounded-md accent-about-button"
						/>
						<label htmlFor="disclaimer" className="text-sm font-medium text-gray-200">
							I agree to the terms and conditions.
						</label>
					</div>
					{errors.disclaimer && (
						<p className="text-red-400 text-sm">
							{errors.disclaimer.message}
						</p>
					)}
				</div>

				<div className="w-full flex justify-center pt-4">
					<button
						type="submit"
						disabled={isSubmitting}
						className="text-lg bg-about-button text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:bg-about-button/90 hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
					>
						{isSubmitting ? "Submitting..." : "Submit Application"}
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