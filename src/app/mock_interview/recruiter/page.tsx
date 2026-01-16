"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MockRecruiterPage() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");

  const exampleQuestion = "Tell me about yourself.";

  const handleBack = () => {
    router.push("/mock_interview");
  };

  const handleSubmit = () => {
    // Non-functional
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-4">
      {/* Back Button - Top Right */}
      <div className="flex justify-end">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </button>
      </div>

      {/* Question Section */}
      <div className="mt-8 w-full max-w-3xl mx-auto">
        <div className="rounded-lg border border-border bg-card p-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Recruiter Question
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

      {/* Submit Button */}
      <div className="mt-8 w-full max-w-3xl mx-auto">
        <button
          onClick={handleSubmit}
          className="w-full rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
