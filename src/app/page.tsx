import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-amber-50 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-black p-8">
      <h1 className="text-5xl font-bold mb-4">Coffee Logger</h1>
      <p className="text-lg mb-8 max-w-xl">
        Record every pour-over, analyze your brews, and refine your technique with this sleek logging tool.
      </p>
      <Link href="/brews" className="btn-primary px-6 py-3 text-lg">
        Start Logging
      </Link>
    </main>
  );
}