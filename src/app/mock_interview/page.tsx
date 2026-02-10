"use client";

import { useRouter } from "next/navigation";

export default function MockInterviewPage() {
  const router = useRouter();

  const rounds = [
    { number: 1, label: "Recruiter Round" },
    { number: 2, label: "Coding Round" },
    { number: 3, label: "Behavioral Round" },
    { number: 4, label: "System Design Round" },
  ];

  const handleStartInterview = () => {
    router.push("/mock_interview/recruiter");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
      <main className="flex w-full max-w-2xl flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mock Interview</h1>
        <p className="mt-3 text-center text-muted-foreground">
          Complete all 4 rounds in sequence
        </p>

        <div className="mt-8 sm:mt-12 w-full space-y-3 sm:space-y-4">
          {rounds.map((round) => (
            <div
              key={round.number}
              className="flex items-center gap-3 sm:gap-4 rounded-lg border border-border bg-card px-4 sm:px-6 py-3 sm:py-4"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                {round.number}
              </span>
              <span className="text-base font-medium text-foreground">
                {round.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 w-full">
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
