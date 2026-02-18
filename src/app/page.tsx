"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateUserId } from "@/utils/sessionManager";
import { supabase } from "@/lib/supabase";
import DevResetButton from "@/components/DevResetButton";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartGrind = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get existing user ID or create new one
      const userId = getOrCreateUserId();
      console.log("User ID:", userId);

      // Skip Supabase operations if client not available (build time)
      if (!supabase) {
        router.push("/onboarding");
        return;
      }

      // Upsert user_sessions row immediately to ensure parent exists
      // This creates a minimal row that will be updated in onboarding
      const { error: upsertError } = await supabase
        .from("user_sessions")
        .upsert(
          {
            user_id: userId,
            target_role: "pending",
            years_of_experience: 0,
            interview_status: "preparing",
          },
          {
            onConflict: "user_id",
            ignoreDuplicates: true,
          }
        );

      if (upsertError) {
        console.error("Failed to create user session:", upsertError);
        setError("Failed to start session. Please try again.");
        setIsLoading(false);
        return;
      }

      // Navigate to onboarding
      router.push("/onboarding");
    } catch (err) {
      console.error("Error starting session:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <main className="flex max-w-2xl flex-col items-center text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          THE INTERVIEW LOOP.
          <br />
          MASTERED.
        </h1>

        <div className="mt-12 space-y-4 text-lg text-muted-foreground">
          <p>Resume-aware preparation tailored to your experience.</p>
          <p>Honest readiness evaluation: Ready, Borderline, or Not Ready.</p>
          <p>Realistic interview simulation under real conditions.</p>
        </div>

        {error && (
          <p className="mt-8 text-sm text-red-500">{error}</p>
        )}

        <button
          onClick={handleStartGrind}
          disabled={isLoading}
          className={`mt-16 rounded-md px-8 py-3 text-base font-medium ${
            isLoading
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isLoading ? "Starting..." : "Start the Grind"}
        </button>
      </main>

      {/* Dev-only reset button */}
      <DevResetButton />
    </div>
  );
}
