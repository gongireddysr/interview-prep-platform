"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMockInterview } from "@/context/MockInterviewContext";

interface EvaluationResult {
  totalScore: number;
  maxScore: number;
  readiness: "not_ready" | "ready";
  readinessLabel: string;
  weakAreas: string[];
}

export default function MockInterviewResultsPage() {
  const router = useRouter();
  const { resetAnswers } = useMockInterview();
  const [result, setResult] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("mockInterviewResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      router.push("/mock_interview");
    }
  }, [router]);

  const handleHome = () => {
    resetAnswers();
    sessionStorage.removeItem("mockInterviewResult");
    router.push("/");
  };

  const handleStartPreparation = () => {
    resetAnswers();
    sessionStorage.removeItem("mockInterviewResult");
    router.push("/prep");
  };

  const handleTryAgain = () => {
    resetAnswers();
    sessionStorage.removeItem("mockInterviewResult");
    router.push("/mock_interview");
  };

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  const isReady = result.readiness === "ready";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <main className="flex w-full max-w-2xl flex-col items-center">
        {isReady ? (
          <>
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold tracking-tight text-center">
              Congratulations!
            </h1>
            <p className="mt-4 text-xl text-center text-muted-foreground">
              You&apos;re ready for any interview now!
            </p>
            <p className="mt-2 text-center text-muted-foreground">
              Score: {result.totalScore}/{result.maxScore}
            </p>

            <div className="mt-12 w-full">
              <button
                onClick={handleHome}
                className="w-full rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
              >
                Home
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-6">📚</div>
            <h1 className="text-3xl font-bold tracking-tight text-center">
              You Need More Preparation
            </h1>
            <p className="mt-4 text-center text-muted-foreground">
              Score: {result.totalScore}/{result.maxScore}
            </p>

            {result.weakAreas.length > 0 && (
              <div className="mt-8 w-full">
                <h2 className="text-lg font-semibold mb-4">Areas to Improve:</h2>
                <ul className="space-y-2">
                  {result.weakAreas.map((area, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
                    >
                      <span className="text-muted-foreground">•</span>
                      <span className="text-foreground">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-12 flex w-full gap-4">
              <button
                onClick={handleStartPreparation}
                className="flex-1 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
              >
                Start Preparation
              </button>
              <button
                onClick={handleTryAgain}
                className="flex-1 rounded-md border border-border bg-transparent px-6 py-3 text-base font-medium text-foreground hover:bg-muted"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
