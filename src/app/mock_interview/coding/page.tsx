"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MockCodingPage() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");

  const exampleQuestion = "Given an array of integers, find two numbers that add up to a specific target.";

  const handlePreviousRound = () => {
    router.push("/mock_interview/recruiter");
  };

  const handleNextRound = () => {
    router.push("/mock_interview/behavioral");
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-4">
      {/* Navigation - Top Right */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handlePreviousRound}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Previous Round</span>
        </button>
        <button
          onClick={handleNextRound}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Next Round</span>
          <span>→</span>
        </button>
      </div>

      {/* Question Section */}
      <div className="mt-8 w-full max-w-3xl mx-auto">
        <div className="rounded-lg border border-border bg-card p-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Round 2: Coding Question
          </h2>
          <p className="text-2xl font-semibold text-foreground leading-relaxed">
            {exampleQuestion}
          </p>
        </div>
      </div>

      {/* Answer Input Box */}
      <div className="mt-8 flex-1 w-full max-w-3xl mx-auto">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-64 rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>
  );
}
