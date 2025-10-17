"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SuccessModal } from "./SuccessModal";

export default function SignupForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      organisation: formData.get("organisation") as string,
      interest: formData.get("interest") as string,
      teamName: formData.get("teamName") as string,
    };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccessOpen(true);
        form.reset();
      } else {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setStatus(`❌ ${err.error}`);
      }
    } catch {
      setStatus("❌ Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 text-gray-900">
      <h1 className="text-4xl font-extrabold text-center mb-6">
        SD Fintech Summit 2026
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Register your team to join workshops, panels, and networking sessions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-lg border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Organisation
          </label>
          <input
            type="text"
            name="organisation"
            className="w-full rounded-lg border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Interest
          </label>
          <select
            name="interest"
            className="w-full rounded-lg border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          >
            <option>Workshops</option>
            <option>Panels</option>
            <option>Networking</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Team Name
          </label>
          <input
            type="text"
            name="teamName"
            required
            className="w-full rounded-lg border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </button>
      </form>

      {status && (
        <p className="mt-6 text-center text-sm font-medium text-gray-700">
          {status}
        </p>
      )}

      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        onOk={() => {
          setSuccessOpen(false);
          router.replace("/");
        }}
        title="✅ Thanks for signing up!"
        message="Your registration was successful. Click OK to go to your dashboard."
      />
    </div>
  );
}
