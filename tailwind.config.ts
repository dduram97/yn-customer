import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B1220",
          900: "#0F172A",
          700: "#334155"
        },
        brand: {
          600: "#2563EB",
          700: "#1D4ED8"
        },
        line: {
          100: "#EEF2F7",
          200: "#E5E7EB"
        }
      }
    }
  },
  plugins: []
} satisfies Config;

