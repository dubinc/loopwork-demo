import sharedConfig from "@dub/tailwind-config/tailwind.config.ts";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [sharedConfig],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@dub/ui/dist/**/*.{js,mjs}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F5F2FE",
          100: "#EBE4FD",
          200: "#D5C5FB",
          300: "#B79AF7",
          400: "#A379F9",
          500: "#8C59F8",
          600: "#7439ED",
          700: "#6428D1",
          800: "#5321AC",
          900: "#43208A",
          950: "#2B1259",
        },
      },
      boxShadow: {
        soft: "0 2px 8px rgba(23, 15, 60, 0.06)",
        card: "0 1px 2px rgba(23, 15, 60, 0.04), 0 12px 24px -8px rgba(23, 15, 60, 0.08)",
        "card-hover":
          "0 4px 8px rgba(23, 15, 60, 0.06), 0 24px 48px -12px rgba(23, 15, 60, 0.16)",
      },
    },
  },
};

export default config;
