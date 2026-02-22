import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'Exo 2'", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Design System Colors
        "duo-bg": "#111b21",
        "duo-panel": "#202f36",
        "duo-sidebar": "#131f24",
        "duo-gray": "#37464f",
        "duo-primary": "#22d3ee",
        "duo-primary-dark": "#06b6d4",
        
        "card-blue": "#1cb0f6",
        "card-blue-shadow": "#1899d6",
        "card-orange": "#ff9600",
        "card-orange-shadow": "#e58700",
        "card-green": "#58cc02",
        "card-green-shadow": "#46a302",
        "card-purple": "#ce82ff",
        "card-purple-shadow": "#a855f7",
        "card-red": "#ff4b4b",
        "card-red-shadow": "#cc0000",

        primary: {
          DEFAULT: "#22d3ee",
          foreground: "#111b21",
        },
        secondary: {
          DEFAULT: "#202f36",
          foreground: "#e5e7eb",
        },
        destructive: {
          DEFAULT: "#ff4b4b",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#37464f",
          foreground: "#9ca3af",
        },
        accent: {
          DEFAULT: "#22d3ee",
          foreground: "#111b21",
        },
        popover: {
          DEFAULT: "#202f36",
          foreground: "#e5e7eb",
        },
        card: {
          DEFAULT: "#202f36",
          foreground: "#e5e7eb",
        },
      },
      boxShadow: {
        '3d-blue': '0 4px 0 0 #1899d6',
        '3d-orange': '0 4px 0 0 #e58700',
        '3d-green': '0 4px 0 0 #46a302',
        '3d-purple': '0 4px 0 0 #a855f7',
        '3d-red': '0 4px 0 0 #cc0000',
        '3d-cyan': '0 4px 0 0 #06b6d4',
        '3d-panel': '0 4px 0 0 #0b1116',
        '3d-none': '0 0 0 0 transparent',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;