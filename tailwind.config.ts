import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "ll-purple": {
          DEFAULT: "#8B5CF6",
          light: "#A78BFA",
          dark: "#7C3AED",
        },
        "ll-pink": {
          DEFAULT: "#EC4899",
          light: "#F472B6",
          dark: "#DB2777",
        },
        "ll-orange": {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#D97706",
        },
        "ll-yellow": {
          DEFAULT: "#FDE047",
          light: "#FEF08A",
          dark: "#EAB308",
        },
        "ll-green": {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
        },
        "ll-blue": {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#2563EB",
        },
      },
      fontFamily: {
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
