"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getSessionId } from "@/utils/sessionManager";

type Role = "frontend" | "backend" | "fullstack" | null;
type InterviewStatus = "scheduled" | "preparing" | null;

export default function Onboarding() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [yearsOfExperience, setYearsOfExperience] = useState<string>("");
  const [interviewStatus, setInterviewStatus] = useState<InterviewStatus>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");

  // Generate available months (current + next 5 = 6 total)
  const getAvailableMonths = () => {
    const months: { value: string; label: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push({
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      });
    }
    return months;
  };

  // Generate days for selected month
  const getDaysInMonth = () => {
    if (!selectedMonth) return [];
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: { value: string; label: string; disabled: boolean }[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      days.push({
        value: String(day).padStart(2, "0"),
        label: String(day),
        disabled: date < today,
      });
    }
    return days;
  };

  const availableMonths = getAvailableMonths();
  const daysInMonth = getDaysInMonth();

  const handleContinue = async () => {
    if (!interviewStatus || !role) return;
    if (interviewStatus === "scheduled" && (!selectedMonth || !selectedDay)) return;

    setIsSubmitting(true);

    try {
      const sessionId = getSessionId();

      if (!sessionId) {
        console.error("No session ID found");
        router.push("/");
        return;
      }

      // Check if user session already exists
      const { data: existingSession } = await supabase
        .from("user_sessions")
        .select("id")
        .eq("session_id", sessionId)
        .single();

      // Build interview date if scheduled
      const interviewDate = interviewStatus === "scheduled" && selectedMonth && selectedDay
        ? `${selectedMonth}-${selectedDay}`
        : null;

      if (existingSession) {
        // Update existing session
        await supabase
          .from("user_sessions")
          .update({
            target_role: role,
            years_of_experience: parseInt(yearsOfExperience) || 0,
            interview_status: interviewStatus,
            interview_date: interviewDate,
            updated_at: new Date().toISOString(),
          })
          .eq("session_id", sessionId);
      } else {
        // Insert new session
        await supabase.from("user_sessions").insert({
          session_id: sessionId,
          target_role: role,
          years_of_experience: parseInt(yearsOfExperience) || 0,
          interview_status: interviewStatus,
          interview_date: interviewDate,
        });
      }

      router.push(`/onboarding/upload?status=${interviewStatus}`);
    } catch (error) {
      console.error("Error saving user session:", error);
      // Still navigate even if save fails
      router.push(`/onboarding/upload?status=${interviewStatus}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "fullstack", label: "Full-Stack" },
  ] as const;

  const statuses = [
    { id: "scheduled", label: "Interview scheduled" },
    { id: "preparing", label: "Preparing for future interviews" },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <main className="flex w-full max-w-md flex-col">
        <h1 className="text-2xl font-semibold tracking-tight">
          Tell us about yourself
        </h1>

        <div className="mt-10 space-y-10">
          {/* Role Selection */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              What role are you targeting?
            </label>
            <div className="mt-3 flex gap-3">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`flex-1 rounded-md border px-4 py-3 text-sm font-medium ${
                    role === r.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-transparent text-foreground hover:bg-muted"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Years of Experience */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Years of experience
            </label>
            <input
              type="number"
              min="0"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              placeholder="0"
              className="mt-3 w-full rounded-md border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Interview Status */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Where are you in the process?
            </label>
            <div className="mt-3 flex flex-col gap-3">
              {statuses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setInterviewStatus(s.id);
                    if (s.id === "preparing") {
                      setSelectedMonth("");
                      setSelectedDay("");
                    }
                  }}
                  className={`rounded-md border px-4 py-3 text-left text-sm font-medium ${
                    interviewStatus === s.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-transparent text-foreground hover:bg-muted"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Date Selection - Only for Scheduled */}
            {interviewStatus === "scheduled" && (
              <div className="mt-6">
                <label className="text-sm font-medium text-muted-foreground">
                  When is your interview?
                </label>
                <div className="mt-3 flex gap-3">
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setSelectedDay("");
                    }}
                    className="flex-1 rounded-md border border-border bg-transparent px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="" className="bg-background">Select month</option>
                    {availableMonths.map((m) => (
                      <option key={m.value} value={m.value} className="bg-background">
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    disabled={!selectedMonth}
                    className="w-24 rounded-md border border-border bg-transparent px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                  >
                    <option value="" className="bg-background">Day</option>
                    {daysInMonth.map((d) => (
                      <option 
                        key={d.value} 
                        value={d.value} 
                        disabled={d.disabled}
                        className="bg-background"
                      >
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!role || !interviewStatus || isSubmitting || (interviewStatus === "scheduled" && (!selectedMonth || !selectedDay))}
          className={`mt-12 w-full rounded-md px-8 py-3 text-base font-medium ${
            !role || !interviewStatus || isSubmitting || (interviewStatus === "scheduled" && (!selectedMonth || !selectedDay))
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </button>
      </main>
    </div>
  );
}
