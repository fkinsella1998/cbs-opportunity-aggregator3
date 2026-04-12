"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step = "email" | "pin";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/send-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      setMessage(
        data.pin
          ? `Dev PIN: ${data.pin}`
          : "Check your inbox for a 6-digit code.",
      );
      setStep("pin");
    } else {
      setError("Something went wrong. Please try again.");
    }
  }

  async function handlePinSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/verify-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pin }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      if (data.onboarding_done) {
        router.push("/feed");
      } else {
        router.push("/onboarding");
      }
    } else {
      setError(data.error || "Invalid code.");
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="mb-16 text-center">
        <p className="font-mono text-text-tertiary text-xs tracking-[0.2em] uppercase mb-2">
          Columbia Business School
        </p>
        <h1 className="text-text text-xl font-medium tracking-tight">
          Opportunities
        </h1>
      </div>

      <div className="w-full max-w-[320px] animate-fade-in">
        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <Label htmlFor="email">CBS email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="uni@columbia.edu"
              required
              autoFocus
            />
            {error ? <p className="text-destructive text-xs">{error}</p> : null}
            <Button type="submit" disabled={loading || !email} className="w-full">
              {loading ? "Sending..." : "Send code →"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="pin">6-digit code</Label>
              <p className="text-text-tertiary text-xs">{message}</p>
            </div>
            <Input
              id="pin"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              required
              autoFocus
              className="font-mono tracking-[0.3em] text-center"
            />
            {error ? <p className="text-destructive text-xs">{error}</p> : null}
            <Button type="submit" disabled={loading || pin.length !== 6} className="w-full">
              {loading ? "Verifying..." : "Continue →"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setPin("");
                setError("");
              }}
              className="text-text-tertiary text-xs underline underline-offset-2 hover:text-text-secondary transition-colors"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
