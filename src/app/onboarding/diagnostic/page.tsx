"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getUserId } from "@/utils/sessionManager";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[300px] bg-gray-900 rounded-lg">
      <span className="text-gray-400">Loading editor...</span>
    </div>
  ),
});

type TabId = "coding" | "explanation" | "recruiter" | "behavioral";

interface TabState {
  completed: boolean;
  unlocked: boolean;
}

interface FormData {
  coding: {
    language: string;
    code: string;
    explanation: string;
  };
  explanation: {
    answer: string;
  };
  recruiter: {
    answer: string;
  };
  behavioral: {
    answer: string;
  };
}

const TABS: { id: TabId; label: string }[] = [
  { id: "coding", label: "Coding" },
  { id: "explanation", label: "Explanation" },
  { id: "recruiter", label: "Recruiter" },
  { id: "behavioral", label: "Behavioral" },
];

const QUESTIONS: Record<TabId, string> = {
  coding: "Write a function to check if a string is a palindrome",
  explanation: "Explain how React state works to a beginner",
  recruiter: "Tell me about yourself",
  behavioral: "Describe a time you fixed a production issue or unexpected bug",
};


export default function DiagnosticPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("coding");
  const [tabStates, setTabStates] = useState<Record<TabId, TabState>>({
    coding: { completed: false, unlocked: true },
    explanation: { completed: false, unlocked: false },
    recruiter: { completed: false, unlocked: false },
    behavioral: { completed: false, unlocked: false },
  });
  const [formData, setFormData] = useState<FormData>({
    coding: { language: "JavaScript", code: "", explanation: "" },
    explanation: { answer: "" },
    recruiter: { answer: "" },
    behavioral: { answer: "" },
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabClick = (tabId: TabId) => {
    if (tabStates[tabId].unlocked) {
      setActiveTab(tabId);
    }
  };

  const handleSubmitTab = () => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    const nextTab = TABS[currentIndex + 1];

    setTabStates((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], completed: true },
      ...(nextTab ? { [nextTab.id]: { ...prev[nextTab.id], unlocked: true } } : {}),
    }));

    if (nextTab) {
      setActiveTab(nextTab.id);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const userId = getUserId();
      if (!userId) {
        console.error("No user ID found");
        router.push("/");
        return;
      }

      const response = await fetch("/api/diagnostics/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate diagnostic");
      }

      const result = await response.json();
      
      const params = new URLSearchParams({
        readiness: result.readiness,
        weakAreas: encodeURIComponent(JSON.stringify(result.weakAreas)),
      });

      router.push(`/onboarding/readiness?${params.toString()}`);
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
    }
  };

  const allCompleted = Object.values(tabStates).every((s) => s.completed);
  const isLastTab = activeTab === "behavioral";

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 sm:px-6 py-4 sm:py-12">
      <main className="flex w-full max-w-4xl flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Vertical Tab Navigation */}
        <nav className="flex w-full lg:w-48 flex-shrink-0 flex-row lg:flex-col gap-1 sm:gap-2 overflow-x-auto pb-2 lg:pb-0">
          {TABS.map((tab) => {
            const state = tabStates[tab.id];
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                disabled={!state.unlocked}
                className={`flex items-center justify-between rounded-md px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : state.unlocked
                      ? "text-foreground hover:bg-muted"
                      : "cursor-not-allowed text-muted-foreground/40"
                }`}
              >
                <span>{tab.label}</span>
                {state.completed && <span className="ml-2">✔️</span>}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <div className="flex-1 rounded-lg border border-border bg-card p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{QUESTIONS[activeTab]}</p>

          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            {activeTab === "coding" && (
              <>
                <div className="min-h-[400px]">
                  <CodeEditor
                    onCodeChange={(code, language) =>
                      setFormData((prev) => ({
                        ...prev,
                        coding: { ...prev.coding, code, language },
                      }))
                    }
                  />
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">
                    Short Explanation
                  </label>
                  <textarea
                    value={formData.coding.explanation}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        coding: { ...prev.coding, explanation: e.target.value },
                      }))
                    }
                    placeholder="Briefly explain your approach..."
                    rows={2}
                    className="mt-2 w-full resize-none rounded-md border border-border bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:rows-3"
                  />
                </div>
              </>
            )}

            {activeTab === "explanation" && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Your Answer
                </label>
                <textarea
                  value={formData.explanation.answer}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      explanation: { answer: e.target.value },
                    }))
                  }
                  placeholder="Type your explanation here..."
                  rows={8}
                  className="mt-2 w-full resize-none rounded-md border border-border bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {activeTab === "recruiter" && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Your Answer
                </label>
                <textarea
                  value={formData.recruiter.answer}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recruiter: { answer: e.target.value },
                    }))
                  }
                  placeholder="Tell us about yourself..."
                  rows={8}
                  className="mt-2 w-full resize-none rounded-md border border-border bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {activeTab === "behavioral" && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Your Answer
                </label>
                <textarea
                  value={formData.behavioral.answer}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      behavioral: { answer: e.target.value },
                    }))
                  }
                  placeholder="Describe your experience..."
                  rows={8}
                  className="mt-2 w-full resize-none rounded-md border border-border bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {!tabStates[activeTab].completed && (
              <button
                onClick={handleSubmitTab}
                className="rounded-md bg-primary px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Submit & Continue
              </button>
            )}

            {isLastTab && allCompleted && !showSuccess && (
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="rounded-md bg-green-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Evaluating..." : "Submit Diagnostic"}
              </button>
            )}

            {showSuccess && (
              <div className="rounded-md bg-green-600/20 px-4 py-3 text-sm font-medium text-green-400">
                ✓ Diagnostic submitted successfully!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
