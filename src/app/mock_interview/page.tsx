"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RoundId = "recruiter" | "coding" | "system-design" | "behavioral";

export default function MockInterviewPage() {
  const router = useRouter();
  const [selectedRound, setSelectedRound] = useState<RoundId | null>(null);

  const rounds: { id: RoundId; label: string }[] = [
    { id: "recruiter", label: "Recruiter Round" },
    { id: "coding", label: "Coding Round" },
    { id: "system-design", label: "System Design Round" },
    { id: "behavioral", label: "Behavioral Round" },
  ];

  const handleStartInterview = () => {
    if (selectedRound === "recruiter") {
      router.push("/mock_interview/recruiter");
    } else if (selectedRound === "coding") {
      router.push("/mock_interview/coding");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <main className="flex w-full max-w-2xl flex-col items-center">
        <h1 className="text-3xl font-bold tracking-tight">Mock Interview</h1>

        <div className="mt-12 grid w-full grid-cols-2 gap-4">
          {rounds.map((round) => (
            <button
              key={round.id}
              onClick={() => setSelectedRound(round.id)}
              className={`rounded-lg border px-6 py-8 text-center text-base font-medium transition-all ${
                selectedRound === round.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary hover:bg-muted"
              }`}
            >
              {round.label}
            </button>
          ))}
        </div>

        <div className="mt-12 w-full">
          <button
            onClick={handleStartInterview}
            className="w-full rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start Interview
          </button>
        </div>
      </main>
    </div>
  );
}
