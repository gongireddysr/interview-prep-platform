"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMockInterview } from "@/context/MockInterviewContext";

export default function MockRecruiterPage() {
  const router = useRouter();
  const { answers, setAnswer } = useMockInterview();
  const [localAnswer, setLocalAnswer] = useState(answers.recruiter);

  const exampleQuestion = "Tell me about yourself.";

  useEffect(() => {
    setLocalAnswer(answers.recruiter);
  }, [answers.recruiter]);

  const handleNextRound = () => {
    setAnswer("recruiter", localAnswer);
    router.push("/mock_interview/coding");
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-4">
      {/* Navigation - Top Right */}
      <div className="flex justify-end gap-4">
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
            Round 1: Recruiter Question
          </h2>
          <p className="text-2xl font-semibold text-foreground leading-relaxed">
            {exampleQuestion}
          </p>
        </div>
      </div>

      {/* Answer Input Box */}
      <div className="mt-8 flex-1 w-full max-w-3xl mx-auto">
        <textarea
          value={localAnswer}
          onChange={(e) => setLocalAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-64 rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>
  );
}
