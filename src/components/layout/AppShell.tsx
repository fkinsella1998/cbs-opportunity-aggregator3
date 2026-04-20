"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/feed", label: "Feed" },
  { href: "/saved", label: "Saved" },
  { href: "/onboarding", label: "Profile" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const nextTheme = saved === "light" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="hidden md:flex">
        <aside className="w-[200px] border-r border-border-subtle bg-surface-raised px-6 py-10">
          <p className="font-mono text-accent text-xs tracking-[0.2em] uppercase mb-8">
            CBS Opportunities
          </p>
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm ${
                  pathname === item.href ? "text-text" : "text-text-tertiary"
                } hover:text-text`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-12">
            <Button
              variant="ghost"
              className="px-0 text-xs text-text-tertiary hover:text-text"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </Button>
            <Button
              variant="ghost"
              className="px-0 text-xs text-text-tertiary hover:text-text"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
            >
              Sign out
            </Button>
          </div>
        </aside>
        <main className="flex-1 px-8 py-10">{children}</main>
      </div>

      <div className="md:hidden px-6 py-8">{children}</div>
    </div>
  );
}
