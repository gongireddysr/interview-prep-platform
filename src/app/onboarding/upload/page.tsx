"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getUserId } from "@/utils/sessionManager";

function OnboardingUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewStatus = searchParams.get("status");
  const isScheduled = interviewStatus === "scheduled";

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation: only resume is required, job description is optional for all
  const canContinue = !!resumeFile;

  const handleContinue = async () => {
    if (!canContinue || !resumeFile) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const userId = getUserId();

      if (!userId) {
        console.error("No user ID found");
        router.push("/");
        return;
      }

      // Skip Supabase operations if client not available (build time)
      if (!supabase) {
        router.push("/onboarding/diagnostic");
        return;
      }

      // 1. Upload file to Supabase Storage
      const fileExt = resumeFile.name.split(".").pop()?.toLowerCase();
      const filePath = `${userId}/resume.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setError("Failed to upload resume. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // 2. Parse resume to extract text
      const formData = new FormData();
      formData.append("file", resumeFile);

      const parseResponse = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      let resumeText = "";
      if (parseResponse.ok) {
        const parseData = await parseResponse.json();
        resumeText = parseData.text || "";
      } else {
        console.warn("Failed to parse resume, continuing without text");
      }

      // 3. Check if document already exists for this user
      const { data: existingDoc } = await supabase
        .from("user_documents")
        .select("id")
        .eq("user_id", userId)
        .single();

      let dbError = null;

      if (existingDoc) {
        // Update existing document
        const { error: updateError } = await supabase
          .from("user_documents")
          .update({
            resume_file_path: filePath,
            resume_filename: resumeFile.name,
            resume_text: resumeText,
            job_description: jobDescription.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
        dbError = updateError;
      } else {
        // Insert new document
        const { error: insertError } = await supabase.from("user_documents").insert({
          user_id: userId,
          resume_file_path: filePath,
          resume_filename: resumeFile.name,
          resume_text: resumeText,
          job_description: jobDescription.trim() || null,
        });
        dbError = insertError;
      }

      if (dbError) {
        console.error("Database error:", dbError);
        // Check if it's a foreign key error (user_sessions doesn't exist)
        if (dbError.code === "23503") {
          setError("Session expired. Please start over.");
          router.push("/");
          return;
        }
        setError("Failed to save document. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.push("/onboarding/diagnostic");
    } catch (err) {
      console.error("Error saving documents:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf" || ext === "docx") {
        setResumeFile(file);
        setError(null);
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

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

        <button
          onClick={handleContinue}
          disabled={!canContinue || isSubmitting}
          className={`mt-12 w-full rounded-md px-8 py-3 text-base font-medium ${
            canContinue && !isSubmitting
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          }`}
        >
          {isSubmitting ? "Uploading..." : "Continue"}
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
