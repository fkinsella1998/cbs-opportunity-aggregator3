export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Just now";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export function formatDeadline(dateStr: string): string {
  const date = new Date(dateStr);
  return `Closes ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}
