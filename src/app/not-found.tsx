import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-text flex items-center justify-center px-6">
      <div className="text-center space-y-4">
        <p className="text-text-secondary">Page not found.</p>
        <Link href="/feed" className="underline underline-offset-2 text-text-tertiary">
          ← Go to feed
        </Link>
      </div>
    </main>
  );
}
