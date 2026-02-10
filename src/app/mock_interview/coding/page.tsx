"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMockInterview } from "@/context/MockInterviewContext";
import dynamic from "next/dynamic";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] bg-gray-900 rounded-lg">
      <span className="text-gray-400">Loading editor...</span>
    </div>
  ),
});

export default function MockCodingPage() {
  const router = useRouter();
  const { answers, setAnswer } = useMockInterview();
  const [localAnswer, setLocalAnswer] = useState(answers.coding);

  const exampleQuestion = "Given an array of integers, find two numbers that add up to a specific target.";

  useEffect(() => {
    setLocalAnswer(answers.coding);
  }, [answers.coding]);

  const handlePreviousRound = () => {
    setAnswer("coding", localAnswer);
    router.push("/mock_interview/recruiter");
  };

  const handleNextRound = () => {
    setAnswer("coding", localAnswer);
    router.push("/mock_interview/behavioral");
  };

  const handleCodeChange = (code: string) => {
    setLocalAnswer(code);
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
        <button
          onClick={handleNextRound}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Next Round</span>
          <span>→</span>
        </button>
      </div>

      {/* Question Section */}
      <div className="mt-4 sm:mt-8 w-full">
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Round 2: Coding Question
          </h2>
          <p className="text-lg sm:text-2xl font-semibold text-foreground leading-relaxed">
            {exampleQuestion}
          </p>
        </div>
      </div>

      {/* Code Editor Section */}
      <div className="mt-4 sm:mt-6 flex-1 min-h-[500px]">
        <CodeEditor onCodeChange={handleCodeChange} />
      </div>
    </div>
  );
}
