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
        bg: "var(--bg)",
        card: "var(--card)",
        card2: "var(--card2)",
        line: "var(--line)",
        text: "var(--text)",
        muted: "var(--muted)",
        brand: "var(--brand)",
        brand2: "var(--brand2)",
        warn: "var(--warn)",
        danger: "var(--danger)",
      },
    },
  },
  plugins: [],
};

export default config;
