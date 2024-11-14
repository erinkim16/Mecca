import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        primaryDark: "var(--primary-dark)",
        secondaryDark: "var(--secondary-dark)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        accentDark: "var(--accent-dark)",
        ui: "var(--ui)",
        uiDark: "var(--ui-dark)",
      },
    },
  },
  plugins: [],
};
export default config;
