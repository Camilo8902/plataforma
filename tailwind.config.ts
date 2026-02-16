import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary - Deep Emerald
        primary: {
          DEFAULT: "#1B4D3E",
          light: "#2D7A5F",
          dark: "#0F2E25",
        },
        // Secondary - Warm Gold
        secondary: {
          DEFAULT: "#C9A962",
          light: "#E5D4A1",
          dark: "#9A7F3E",
        },
        // Accent - Terracotta
        accent: {
          DEFAULT: "#C75B39",
          light: "#E8836A",
          dark: "#8B3D27",
        },
        // Neutrals
        background: "#FAF8F5",
        surface: {
          DEFAULT: "#FFFFFF",
          elevated: "#FDFCFA",
        },
        border: {
          DEFAULT: "#E8E4DD",
          strong: "#D4CFC6",
        },
        // Text
        text: {
          primary: "#1A1A1A",
          secondary: "#5C5C5C",
          muted: "#8C8C8C",
          inverse: "#FFFFFF",
        },
        // Status
        success: "#2D7A5F",
        warning: "#D4A017",
        error: "#C75B39",
        info: "#1B4D3E",
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-outfit)", "sans-serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
