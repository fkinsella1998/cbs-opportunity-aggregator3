import Link from "next/link";

export default function EmptyFeed() {
  return (
    <div className="py-16 text-center text-text-tertiary">
      <p>No opportunities match your filters.</p>
      <Link href="/feed" className="underline underline-offset-2 text-text-secondary">
        Clear filters
      </Link>
    </div>
  );
}
