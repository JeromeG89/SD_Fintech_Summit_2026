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
		),
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
			} else {
				// User is creating a new team
				if (!data.teamName || data.teamName.trim() === "") {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ["teamName"],
						message: "Team name is required",
					});
				}
				if (!data.teamSize || data.teamSize === "") {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ["teamSize"],
						message: "Please select a team size",
					});
				}
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
			// Handle server-side validation errors (e.g., duplicate email)
			if (err.field && ["email", "teamName"].includes(err.field)) {
				setError(err.field as "email" | "teamName", {
					type: "server",
					message: err.error,
				});
			} else {
				setStatus(`❌ ${err.error || "An unexpected error occurred."}`);
			}
		}
	};

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

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* General Information */}
				<div className="w-full border-t border-white my-2"></div>
				<label className="block text-lg font-bold mb-1 uppercase">
					General Information
				</label>

				{/* First & Last Name */}
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-1">
							First Name*
						</label>
						<input
							type="text"
							{...register("firstName")}
							className={`w-full rounded-lg border-2 ${
								errors.firstName
									? "border-red-500"
									: "border-white"
							} bg-transparent text-white placeholder-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
						/>
						{errors.firstName && (
							<p className="text-red-400 text-sm mt-1">
								{errors.firstName.message}
							</p>
						)}
					</div>
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-1">
							Last Name*
						</label>
						<input
							type="text"
							{...register("lastName")}
							className={`w-full rounded-lg border-2 ${
								errors.lastName
									? "border-red-500"
									: "border-white"
							} bg-transparent text-white placeholder-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
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
					<label className="block text-sm font-semibold mb-1">
						Email*
					</label>
					<input
						type="email"
						{...register("email")}
						className={`w-full rounded-lg border-2 ${
							errors.email ? "border-red-500" : "border-white"
						} bg-transparent text-white placeholder-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
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
						<label className="block text-sm font-semibold mb-1">
							Faculty*
						</label>
						<select
							{...register("faculty")}
							className={`w-full rounded-lg border-2 ${
								errors.faculty
									? "border-red-500"
									: "border-white"
							} bg-transparent text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
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
						{errors.faculty && (
							<p className="text-red-400 text-sm mt-1">
								{errors.faculty.message}
							</p>
						)}
					</div>
					<div className="flex-1">
						<label className="block text-sm font-semibold mb-1">
							Major*
						</label>
						<select
							{...register("major")}
							className={`w-full rounded-lg border-2 ${
								errors.major ? "border-red-500" : "border-white"
							} bg-transparent text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
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
						{errors.major && (
							<p className="text-red-400 text-sm mt-1">
								{errors.major.message}
							</p>
						)}
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
								value="team"
								{...register("participantType")}
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
								value="individual"
								{...register("participantType")}
								className="peer h-5 w-5 accent-gold-500"
							/>
							<span className="font-medium">
								No, I am applying as an individual participant
							</span>
							<div className="absolute inset-0 pointer-events-none border-2 rounded-lg border-transparent peer-checked:border-yellow-500"></div>
						</label>
					</div>
				</div>

				{/* Team Name & Size (conditional) */}
				{participantType === "team" && (
					<div>
						<div className="flex border-2 border-gray-600 rounded-lg overflow-hidden w-fit mb-4">
							<button
								type="button"
								onClick={() => setValue("joinTeam", false)}
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
								onClick={() => setValue("joinTeam", true)}
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
									Existing Team Name or ID*
								</label>
								<input
									type="text"
									{...register("teamSearch")}
									className={`w-full rounded-lg border-2 ${
										errors.teamSearch
											? "border-red-500"
											: "border-white"
									} bg-transparent text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
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
									<label className="block text-sm font-semibold mb-1">
										New Team Name*
									</label>
									<input
										type="text"
										{...register("teamName")}
										className={`w-full rounded-lg border-2 ${
											errors.teamName
												? "border-red-500"
												: "border-white"
										} bg-transparent text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
										placeholder="Enter new team name"
									/>
									{errors.teamName && (
										<p className="text-red-400 text-sm mt-1">
											{errors.teamName.message}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label className="block text-sm font-semibold mb-1">
										Team Size*
									</label>
									<select
										{...register("teamSize")}
										className={`w-full rounded-lg border-2 ${
											errors.teamSize
												? "border-red-500"
												: "border-white"
										} bg-transparent text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
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

				{/* Problem Statement */}
				<div>
					<label className="block text-sm font-semibold mb-3">
						Please select the Problem Statement*
					</label>
					<div className="flex flex-col space-y-3">
						<label className="relative flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer">
							<input
								type="radio"
								value="ps1"
								{...register("problemStatement")}
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
								value="ps2"
								{...register("problemStatement")}
								className="peer h-5 w-5 accent-gold-500 mt-1"
							/>
							<span className="font-medium">
								How can AI and machine learning improve fintech
								user experience and engagement?
							</span>
							<div className="absolute inset-0 border-2 rounded-lg border-transparent peer-checked:border-yellow-400 pointer-events-none"></div>
						</label>
					</div>
					{errors.problemStatement && (
						<p className="text-red-400 text-sm mt-3">
							{errors.problemStatement.message}
						</p>
					)}
				</div>

				{/* Disclaimer */}
				<div className="flex flex-col gap-2">
					<label className="block text-sm font-semibold">
						Disclaimer*
					</label>
					<p className="text-sm">
						By submitting this application, I confirm that the
						information provided is accurate...
					</p>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							{...register("disclaimer")}
							id="disclaimer"
							className="h-5 w-5 rounded-md accent-gold-500"
						/>
						<label htmlFor="disclaimer" className="text-sm">
							I agree.
						</label>
					</div>
					{errors.disclaimer && (
						<p className="text-red-400 text-sm">
							{errors.disclaimer.message}
						</p>
					)}
				</div>

				<div className="w-full flex justify-center">
					<button
						type="submit"
						disabled={isSubmitting}
						className="text-lg bg-indigo-600 font-semibold py-2 px-8 rounded-xl shadow hover:bg-gold-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "Submitting..." : "Submit"}
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