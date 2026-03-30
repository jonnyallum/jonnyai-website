/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#d3c065",
          "gold-light": "#E2C35C",
          "gold-dark": "#BF9B30",
          dark: "#050505",
          gray: "#1a1a1a",
        },
        background: "#050505",
        foreground: "#f0f0f0",
        card: "#1c1c1c",
        secondary: "#2e2e2e",
        muted: "#999999",
        primary: "#d3c065",
        "primary-foreground": "#050505",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["Oswald", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        none: "0",
        DEFAULT: "0",
      },
    },
  },
  plugins: [],
}
