import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold underline mb-8">Coffee Logger</h1>
      <p className="mb-6">
        Welcome to your coffee brew log. Track all your pour-overs, recipes, and tasting notes!
      </p>
      <Link href="/brews">
        <button className="btn-primary">View Brews</button>
      </Link>
    </main>
  );
}