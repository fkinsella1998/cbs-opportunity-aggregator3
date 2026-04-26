export function daysAgo(dateStr: string): number {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function cardPostedLabel(dateStr: string): string {
  const diffDays = daysAgo(dateStr);
  if (diffDays <= 0) return "Posted today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export function formatPostedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `Posted ${date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function formatDeadline(dateStr: string): string {
  const date = new Date(dateStr);
  return `Closes ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}
