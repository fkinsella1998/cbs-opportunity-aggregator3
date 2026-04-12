"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-background text-text flex items-center justify-center px-6">
      <div className="text-center space-y-4">
        <p className="text-text-secondary">Something went wrong.</p>
        <button
          onClick={() => reset()}
          className="underline underline-offset-2 text-text-tertiary"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
