"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function OnboardingUpload() {
  const searchParams = useSearchParams();
  const interviewStatus = searchParams.get("status");
  const isScheduled = interviewStatus === "scheduled";

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf" || ext === "docx") {
        setResumeFile(file);
      }
    }
  };

  // Generate available months (current + next 6)
  const getAvailableMonths = () => {
    const months: { value: string; label: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push({
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      });
    }
    return months;
  };

  // Generate days for selected month
  const getDaysInMonth = (yearMonth: string) => {
    if (!yearMonth) return [];
    const [year, month] = yearMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: { value: string; label: string; disabled: boolean }[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      days.push({
        value: dateStr,
        label: String(day),
        disabled: date < today,
      });
    }
    return days;
  };

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const availableMonths = getAvailableMonths();
  const daysInMonth = getDaysInMonth(selectedMonth);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <main className="flex w-full max-w-md flex-col">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isScheduled ? "Interview Details" : "Upload Your Resume"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isScheduled
            ? "Provide your interview date and materials."
            : "We'll use your resume to tailor your preparation."}
        </p>

        <div className="mt-10 space-y-8">
          {/* Interview Date - Only for Scheduled */}
          {isScheduled && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Interview Date
              </label>
              <div className="mt-3 space-y-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setSelectedDate("");
                  }}
                  className="w-full rounded-md border border-border bg-transparent px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="" className="bg-background">
                    Select month
                  </option>
                  {availableMonths.map((m) => (
                    <option key={m.value} value={m.value} className="bg-background">
                      {m.label}
                    </option>
                  ))}
                </select>

                {selectedMonth && (
                  <div className="grid grid-cols-7 gap-1">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div
                        key={i}
                        className="py-2 text-center text-xs text-muted-foreground"
                      >
                        {d}
                      </div>
                    ))}
                    {/* Empty cells for alignment */}
                    {Array.from({
                      length: new Date(
                        Number(selectedMonth.split("-")[0]),
                        Number(selectedMonth.split("-")[1]) - 1,
                        1
                      ).getDay(),
                    }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {daysInMonth.map((day) => (
                      <button
                        key={day.value}
                        disabled={day.disabled}
                        onClick={() => setSelectedDate(day.value)}
                        className={`rounded py-2 text-sm ${
                          day.disabled
                            ? "cursor-not-allowed text-muted-foreground/40"
                            : selectedDate === day.value
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                )}

                {selectedDate && (
                  <p className="text-sm text-muted-foreground">
                    Selected:{" "}
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          )}

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

          {/* Job Description - Only for Scheduled */}
          {isScheduled && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className="mt-3 w-full resize-none rounded-md border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          )}
        </div>

        <button className="mt-12 w-full rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90">
          Continue
        </button>
      </main>
    </div>
  );
}
