import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: false,
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/globals.css",
  ],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--color-bg))",
        surface: "hsl(var(--color-surface))",
        "surface-muted": "hsl(var(--color-surface-muted))",
        text: {
          primary: "hsl(var(--color-text-primary))",
          secondary: "hsl(var(--color-text-secondary))",
          muted: "hsl(var(--color-text-muted))",
          inverse: "hsl(var(--color-text-inverse))",
        },
        border: "hsl(var(--color-border))",
      },
    },
  },

  plugins: [],
};

export default config;
