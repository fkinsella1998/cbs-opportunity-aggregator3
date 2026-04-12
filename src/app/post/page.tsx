"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PostPage() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/post-opportunity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unable to submit.");
      return;
    }

    setStatus(
      data.status === "Pending" ? "Submitted for CMC review." : "Posted live.",
    );
    form.reset();
    setDescription("");
  }

  return (
    <div className="animate-fade-in max-w-[480px]">
      <div className="mb-8">
        <h1 className="text-text text-lg font-medium">Post opportunity</h1>
        <p className="text-text-tertiary text-sm font-mono mt-0.5">
          Contributor access required
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="company_name">Company name</Label>
          <Input id="company_name" name="company_name" required />
        </div>
        <div>
          <Label htmlFor="role_title">Role title</Label>
          <Input id="role_title" name="role_title" required />
        </div>
        <div>
          <Label htmlFor="function">Function</Label>
          <Input id="function" name="function" />
        </div>
        <div>
          <Label htmlFor="company_stage">Company stage</Label>
          <Input id="company_stage" name="company_stage" />
        </div>
        <div>
          <Label htmlFor="employment_type">Employment type</Label>
          <Input id="employment_type" name="employment_type" />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            maxLength={500}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-2 w-full rounded border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-tertiary"
          />
          <p className="text-text-tertiary text-xs font-mono text-right">
            {description.length} / 500
          </p>
        </div>
        <div>
          <Label htmlFor="application_link">Application link</Label>
          <Input id="application_link" name="application_link" />
        </div>
        <div>
          <Label htmlFor="application_deadline">
            Application deadline (optional)
          </Label>
          <Input id="application_deadline" name="application_deadline" />
        </div>
        <div>
          <Label htmlFor="has_cbs_alumni">CBS alumni</Label>
          <Input id="has_cbs_alumni" name="has_cbs_alumni" />
        </div>
        {error ? <p className="text-destructive text-xs">{error}</p> : null}
        {status ? <p className="text-success text-xs">{status}</p> : null}
        <Button type="submit" className="w-full">
          Post opportunity →
        </Button>
      </form>
    </div>
  );
}
