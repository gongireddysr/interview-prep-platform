"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ReadinessData {
  readiness: "ready" | "borderline" | "not_ready";
  weakAreas: string[];
  recommendation?: "guided_prep" | "mock_ok";
}

const STATUS_CONFIG = {
  ready: {
    label: "Ready",
    icon: "✅",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
  borderline: {
    label: "Borderline",
    icon: "⚠️",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
  not_ready: {
    label: "Not Ready",
    icon: "❌",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
};

const STATUS_EXPLANATION = {
  ready: "Your responses show clear thinking, structure, and ownership.",
  borderline: "You show potential, but some answers lack clarity or structure.",
  not_ready: "Your answers indicate gaps in explanation, structure, or confidence.",
};

const RECOMMENDATION_TEXT = {
  ready: "You are ready to take mock interviews or continue refining your skills.",
  borderline: "Guided Preparation is recommended, but mock interviews are available.",
  not_ready: "We recommend starting with Guided Preparation before mock interviews.",
};

function ReadinessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ReadinessData | null>(null);

  useEffect(() => {
    const readiness = searchParams.get("readiness") as ReadinessData["readiness"];
    const weakAreasParam = searchParams.get("weakAreas");

    if (readiness) {
      setData({
        readiness,
        weakAreas: weakAreasParam ? JSON.parse(decodeURIComponent(weakAreasParam)) : [],
      });
    }
  }, [searchParams]);

  const handleNext = () => {
    router.push("/dashboard");
  };

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading results...</div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[data.readiness];
  const explanation = STATUS_EXPLANATION[data.readiness];
  const recommendation = RECOMMENDATION_TEXT[data.readiness];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <main className="w-full max-w-2xl space-y-8">
        {/* A. Page Header */}
        <header className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Your Interview Readiness</h1>
          <p className="mt-2 text-muted-foreground">Based on your initial diagnostic</p>
        </header>

        {/* B. Readiness Status */}
        <div
          className={`rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor} p-8 text-center`}
        >
          <div className="text-5xl">{statusConfig.icon}</div>
          <div className={`mt-4 text-2xl font-semibold ${statusConfig.color}`}>
            Status: {statusConfig.label}
          </div>

          {/* C. Status Explanation */}
          <p className="mt-4 text-muted-foreground">{explanation}</p>
        </div>

        {/* D. Weak Areas Section */}
        {data.weakAreas.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Areas to Improve</h2>
            <ul className="mt-4 space-y-2">
              {data.weakAreas.slice(0, 5).map((area, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <span className="text-primary">•</span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* E. System Recommendation */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Our Recommendation</h2>
          <p className="mt-2 text-muted-foreground">{recommendation}</p>
        </div>

        {/* F. Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ReadinessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-muted-foreground">Loading results...</div>
        </div>
      }
    >
      <ReadinessContent />
    </Suspense>
  );
}
