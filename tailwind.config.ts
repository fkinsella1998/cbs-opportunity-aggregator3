import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#111111",
        "surface-raised": "#1A1A1A",
        border: "#2A2A2A",
        "border-subtle": "#1E1E1E",
        text: "#F0F0F0",
        "text-secondary": "#888888",
        "text-tertiary": "#555555",
        accent: "#FFFFFF",
        "accent-dim": "#CCCCCC",
        destructive: "#FF4444",
        success: "#22C55E",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      fontSize: {
        "2xs": "0.65rem",
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "2px",
        lg: "6px",
        full: "9999px",
      },
      spacing: {
        page: "1.5rem",
        "page-lg": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
