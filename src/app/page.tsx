import Link from "next/link";

export default function Home() {
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

        <Link
          href="/onboarding"
          className="mt-16 rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
        >
          Start the Grind
        </Link>
      </main>
    </div>
  );
}
