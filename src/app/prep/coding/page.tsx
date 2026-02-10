"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] bg-gray-900 rounded-lg">
      <span className="text-gray-400">Loading editor...</span>
    </div>
  ),
});

const questionsWithHints = [
  {
    question: "Given an array of integers, find two numbers that add up to a specific target.",
    hints: [
      "Consider using a hash map for O(n) time",
      "Think about what complement you need for each number",
      "Handle edge cases: empty array, no solution",
      "Explain your time and space complexity",
      "Walk through an example step by step",
    ],
  },
  {
    question: "Implement a function to reverse a linked list.",
    hints: [
      "Use three pointers: prev, current, next",
      "Consider both iterative and recursive approaches",
      "Handle edge cases: empty list, single node",
      "Draw out the pointer changes visually",
      "Mention time O(n) and space O(1) for iterative",
    ],
  },
];

export default function CodingPrepPage() {
  const router = useRouter();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [code, setCode] = useState("");

  const currentQuestion = questionsWithHints[questionIndex];

  const handleBack = () => {
    router.push("/prep");
  };

  const handleSubmit = () => {
    // Non-functional
  };

  const handleNextQuestion = () => {
    setQuestionIndex((prev) => (prev + 1) % questionsWithHints.length);
    setCode("");
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <div className="flex min-h-screen flex-col px-4 sm:px-6 py-4">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      {/* Question Section - Full Width */}
      <div className="mt-4 sm:mt-6 w-full">
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2 sm:mb-4">
            Coding Prep Question
          </h2>
          <p className="text-lg sm:text-2xl font-semibold text-foreground leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>
      </div>

      {/* Hints Panel */}
      <div className="mt-4 sm:mt-6">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💡</span>
            <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              Hints
            </h3>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {currentQuestion.hints.map((hint, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Code Editor Section */}
      <div className="mt-4 sm:mt-6 flex-1 min-h-[500px]">
        <CodeEditor onCodeChange={handleCodeChange} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 py-4 mt-4 border-t border-border">
        <button
          onClick={handleSubmit}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Submit
        </button>
        <button
          onClick={handleNextQuestion}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-md border border-border bg-transparent text-foreground font-medium hover:bg-muted transition-colors"
        >
          Next Question
        </button>
      </div>
    </div>
  );
}
