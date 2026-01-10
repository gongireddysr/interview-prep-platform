"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CategoryId = "recruiter" | "coding" | "behavioral" | "system-design";

export default function PrepPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);

  const categories: { id: CategoryId; label: string }[] = [
    { id: "recruiter", label: "Recruiter Screen" },
    { id: "coding", label: "Coding Prep" },
    { id: "behavioral", label: "Behavioral" },
    { id: "system-design", label: "System Design" },
  ];

  const handleStartPrep = () => {
    if (selectedCategory === "recruiter") {
      router.push("/prep/recruiter");
    } else if (selectedCategory === "behavioral") {
      router.push("/prep/behavioral");
    }
  };

  const handleMockInstead = () => {
    router.push("/mock");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <main className="flex w-full max-w-2xl flex-col items-center">
        <h1 className="text-3xl font-bold tracking-tight">Interview Guide</h1>

        <div className="mt-12 grid w-full grid-cols-2 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-lg border px-6 py-8 text-center text-base font-medium transition-all ${
                selectedCategory === category.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary hover:bg-muted"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="mt-12 flex w-full gap-4">
          <button
            onClick={handleStartPrep}
            className="flex-1 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start Prep
          </button>
          <button
            onClick={handleMockInstead}
            className="flex-1 rounded-md border border-border bg-transparent px-6 py-3 text-base font-medium text-foreground hover:bg-muted"
          >
            Mock Interview Instead
          </button>
        </div>
      </main>
    </div>
  );
}
