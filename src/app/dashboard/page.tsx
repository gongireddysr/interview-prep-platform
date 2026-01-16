"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const modes = [
    {
      id: "preparation",
      title: "Interview Preparation Guide",
      description:
        "Personalized study plan based on your assessment. Master concepts, practice problems, and track your progress.",
      icon: "📚",
      route: "/prep",
    },
    {
      id: "mock",
      title: "Mock Interviews",
      description:
        "Simulate real interview conditions. Get feedback on coding, system design, and behavioral questions.",
      icon: "🎯",
      route: "/mock_interview",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <main className="flex w-full max-w-2xl flex-col items-center">
        <h1 className="text-3xl font-bold tracking-tight">Choose Your Path</h1>
        <p className="mt-3 text-center text-muted-foreground">
          Based on your assessment, select how you want to prepare.
        </p>

        <div className="mt-12 grid w-full gap-6 sm:grid-cols-2">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => router.push(mode.route)}
              className="group flex flex-col items-start rounded-lg border border-border bg-card p-6 text-left transition-all hover:border-primary hover:bg-muted"
            >
              <span className="text-4xl">{mode.icon}</span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                {mode.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode.description}
              </p>
              <span className="mt-4 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Get Started →
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
