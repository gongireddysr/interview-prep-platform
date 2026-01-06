"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "frontend" | "backend" | "fullstack" | null;
type InterviewStatus = "scheduled" | "preparing" | null;

export default function Onboarding() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [yearsOfExperience, setYearsOfExperience] = useState<string>("");
  const [interviewStatus, setInterviewStatus] = useState<InterviewStatus>(null);

  const handleContinue = () => {
    if (interviewStatus) {
      router.push(`/onboarding/upload?status=${interviewStatus}`);
    }
  };

  const roles = [
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "fullstack", label: "Full-Stack" },
  ] as const;

  const statuses = [
    { id: "scheduled", label: "Interview scheduled" },
    { id: "preparing", label: "Preparing for future interviews" },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <main className="flex w-full max-w-md flex-col">
        <h1 className="text-2xl font-semibold tracking-tight">
          Tell us about yourself
        </h1>

        <div className="mt-10 space-y-10">
          {/* Role Selection */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              What role are you targeting?
            </label>
            <div className="mt-3 flex gap-3">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`flex-1 rounded-md border px-4 py-3 text-sm font-medium ${
                    role === r.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-transparent text-foreground hover:bg-muted"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Years of Experience */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Years of experience
            </label>
            <input
              type="number"
              min="0"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              placeholder="0"
              className="mt-3 w-full rounded-md border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Interview Status */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Where are you in the process?
            </label>
            <div className="mt-3 flex flex-col gap-3">
              {statuses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setInterviewStatus(s.id)}
                  className={`rounded-md border px-4 py-3 text-left text-sm font-medium ${
                    interviewStatus === s.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-transparent text-foreground hover:bg-muted"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="mt-12 w-full rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
        >
          Continue
        </button>
      </main>
    </div>
  );
}
