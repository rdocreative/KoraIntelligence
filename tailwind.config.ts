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
        sans: ["Nunito", "sans-serif"],
      },
      colors: {
        background: "#111b21",
        panel: "#202f36",
        sidebar: "#131f24",
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
          dark: "#06b6d4",
          foreground: "#ffffff",
        },
        "duo-gray": "#37464f",
        text: "#e5e7eb",
        "text-muted": "#9ca3af",
        border: "#374151",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        blue: "0 4px 0 0 #1899d6",
        orange: "0 4px 0 0 #e58700",
        green: "0 4px 0 0 #46a302",
        purple: "0 4px 0 0 #a855f7",
        red: "0 4px 0 0 #cc0000",
        cyan: "0 4px 0 0 #06b6d4",
        panel: "0 4px 0 0 #0b1116",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;