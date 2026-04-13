import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center space-y-6 animate-fade-in">
        <p className="font-mono text-text-tertiary text-xs tracking-[0.2em] uppercase">
          Columbia Business School
        </p>
        <h1 className="text-2xl font-medium tracking-tight">Opportunities</h1>
        <p className="text-text-secondary text-sm">
          Find non-OCR roles with alumni visibility and a single feed.
        </p>
        <Link href="/login" className="w-full">
          <Button className="w-full">Enter with CBS PIN →</Button>
        </Link>
      </div>
    </main>
  );
}
