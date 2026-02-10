"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questionsWithHints = [
  {
    question: "Tell me about a time when you faced a challenging situation at work.",
    hints: [
      "Use the STAR method: Situation, Task, Action, Result",
      "Be specific about your role and actions",
      "Quantify the impact if possible",
      "Focus on what YOU did, not just the team",
      "End with lessons learned or positive outcome",
    ],
  },
  {
    question: "Describe a situation where you had to work with a difficult team member.",
    hints: [
      "Stay professional, don't badmouth anyone",
      "Focus on the situation, not personalities",
      "Explain your approach to resolve conflict",
      "Highlight communication and empathy",
      "Share the positive resolution or learning",
    ],
  },
];

export default function BehavioralPage() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);

  const currentQuestion = questionsWithHints[questionIndex];

  const handleBack = () => {
    router.push("/prep");
  };

  const handleSubmit = () => {
    // Non-functional
  };

  const handleNextQuestion = () => {
    setQuestionIndex((prev) => (prev + 1) % questionsWithHints.length);
    setAnswer("");
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
            Behavioral Question
          </h2>
          <p className="text-lg sm:text-2xl font-semibold text-foreground leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>
      </div>

      {/* Hints and Answer Section - 30/70 Split */}
      <div className="mt-4 sm:mt-6 flex-1 flex flex-col lg:flex-row gap-4">
        {/* Hints Panel - 30% */}
        <div className="w-full lg:w-[30%] order-2 lg:order-1">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 h-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💡</span>
              <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                Hints
              </h3>
            </div>
            <ul className="space-y-2">
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

        {/* Answer Input - 70% */}
        <div className="w-full lg:w-[70%] flex flex-col order-1 lg:order-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✍️</span>
            <h3 className="text-sm font-semibold text-foreground">Your Answer</h3>
          </div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full flex-1 min-h-[200px] lg:min-h-0 rounded-lg border border-border bg-background p-3 sm:p-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
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
