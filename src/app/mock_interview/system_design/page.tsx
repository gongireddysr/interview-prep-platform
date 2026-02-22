"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMockInterview } from "@/context/MockInterviewContext";
import { getUserId } from "@/utils/sessionManager";

export default function MockSystemDesignPage() {
  const router = useRouter();
  const { answers, setAnswer } = useMockInterview();
  const [localAnswer, setLocalAnswer] = useState(answers.systemDesign);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exampleQuestion = "Design a URL shortening service like bit.ly.";

  useEffect(() => {
    setLocalAnswer(answers.systemDesign);
  }, [answers.systemDesign]);

  const handlePreviousRound = () => {
    setAnswer("systemDesign", localAnswer);
    router.push("/mock_interview/behavioral");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setAnswer("systemDesign", localAnswer);

    const userId = getUserId();
    if (!userId) {
      console.error("No user ID found");
      router.push("/");
      return;
    }

    const payload = {
      user_id: userId,
      recruiter: { answer: answers.recruiter },
      coding: { answer: answers.coding },
      behavioral: { answer: answers.behavioral },
      systemDesign: { answer: localAnswer },
    };

    try {
      const response = await fetch("/api/mock_interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        sessionStorage.setItem("mockInterviewResult", JSON.stringify(result));
        router.push("/mock_interview/results");
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-4 sm:px-6 py-3 sm:py-4">
      {/* Navigation - Top Right */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handlePreviousRound}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Previous Round</span>
        </button>
      </div>

      {/* Question Section */}
      <div className="mt-8 w-full max-w-3xl mx-auto">
        <div className="rounded-lg border border-border bg-card p-4 sm:p-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Round 4: System Design Question
          </h2>
          <p className="text-lg sm:text-2xl font-semibold text-foreground leading-relaxed">
            {exampleQuestion}
          </p>
        </div>
      </div>

      {/* Answer Input Box */}
      <div className="mt-4 sm:mt-8 flex-1 w-full max-w-3xl mx-auto">
        <textarea
          value={localAnswer}
          onChange={(e) => setLocalAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-48 sm:h-64 rounded-lg border border-border bg-background p-3 sm:p-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Submit Button */}
      <div className="mt-8 w-full max-w-3xl mx-auto">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
