"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SystemDesignPage() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");

  const currentQuestion = "Design a URL shortening service like bit.ly.";

  const handleBack = () => {
    router.push("/prep");
  };

  const handleSubmit = () => {
    // Non-functional
  };

  const handleNextQuestion = () => {
    // Non-functional
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-4">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      {/* Question Section - 2/3 of screen */}
      <div className="flex-[2] flex items-center justify-center py-8">
        <div className="w-full max-w-3xl rounded-lg border border-border bg-card p-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            System Design Question
          </h2>
          <p className="text-2xl font-semibold text-foreground leading-relaxed">
            {currentQuestion}
          </p>
        </div>
      </div>

      {/* Answer Text Box - Takes majority of remaining space */}
      <div className="flex-[1] flex flex-col pb-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full max-w-3xl mx-auto flex-1 rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 py-4 border-t border-border">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Submit
        </button>
        <button
          onClick={handleNextQuestion}
          className="px-8 py-3 rounded-md border border-border bg-transparent text-foreground font-medium hover:bg-muted transition-colors"
        >
          Next Question
        </button>
      </div>
    </div>
  );
}
