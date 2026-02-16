"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function OnboardingUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewStatus = searchParams.get("status");
  const isScheduled = interviewStatus === "scheduled";

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");

  // Validation: resume required for all, job description required for scheduled
  const canContinue = isScheduled
    ? resumeFile && jobDescription.trim()
    : resumeFile;

  const handleContinue = () => {
    if (canContinue) {
      router.push("/onboarding/diagnostic");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf" || ext === "docx") {
        setResumeFile(file);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <main className="flex w-full max-w-md flex-col">
        <h1 className="text-2xl font-semibold tracking-tight">
          Upload Your Resume
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We'll use your resume to tailor your preparation.
        </p>

        <div className="mt-10 space-y-8">
          {/* Resume Upload */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Resume
            </label>
            <div className="mt-3">
              <label className="flex cursor-pointer items-center justify-between rounded-md border border-border px-4 py-3 text-sm hover:bg-muted">
                <span className="text-muted-foreground">
                  {resumeFile ? resumeFile.name : "Upload PDF or DOCX"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-xs text-muted-foreground">Browse</span>
              </label>
            </div>
          </div>

          {/* Job Description - Required for Scheduled, Optional for Preparing */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Job Description {!isScheduled && <span className="text-xs text-muted-foreground/60">(Optional)</span>}
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description you're applying for..."
              rows={6}
              className="mt-3 w-full resize-none rounded-md border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            {!isScheduled && (
              <p className="mt-2 text-xs text-muted-foreground">
                💡 Adding a job description helps us tailor your prep to the specific role requirements
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`mt-12 w-full rounded-md px-8 py-3 text-base font-medium ${
            canContinue
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          }`}
        >
          Continue
        </button>
      </main>
    </div>
  );
}

export default function OnboardingUpload() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <OnboardingUploadContent />
    </Suspense>
  );
}
