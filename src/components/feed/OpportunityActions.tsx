 "use client";

 import { useState } from "react";

 import { Button } from "@/components/ui/button";

 export default function OpportunityActions({
   opportunityId,
   initialBookmarked,
   initialApplied,
 }: {
   opportunityId: string;
   initialBookmarked: boolean;
   initialApplied: boolean;
 }) {
  const isPreview = opportunityId === "preview";
   const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
   const [hasApplied, setHasApplied] = useState(initialApplied);
   const [busy, setBusy] = useState<"bookmark" | "apply" | null>(null);

   async function toggleBookmark() {
     setBusy("bookmark");
     const res = await fetch("/api/bookmarks", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ opportunity_id: opportunityId }),
     });
     if (res.ok) {
       const data = await res.json();
       setIsBookmarked(Boolean(data?.is_bookmarked));
     }
     setBusy(null);
   }

   async function toggleApplied() {
     setBusy("apply");
     const res = await fetch("/api/applications", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ opportunity_id: opportunityId }),
     });
     if (res.ok) {
       const data = await res.json();
       setHasApplied(Boolean(data?.has_applied));
     }
     setBusy(null);
   }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        variant="ghost"
        onClick={toggleBookmark}
        disabled={!!busy || isPreview}
        className={isBookmarked ? "border-text text-text" : undefined}
      >
        {isBookmarked ? "✓ Bookmarked" : "Bookmark"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={toggleApplied}
        disabled={!!busy || isPreview}
        className={hasApplied ? "border-text text-text" : undefined}
      >
        {hasApplied ? "✓ Applied" : "I applied"}
      </Button>
    </div>
  );
 }
