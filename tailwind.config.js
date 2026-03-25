/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f8f7",
          100: "#d9ece7",
          200: "#afd9cc",
          300: "#7fc2af",
          400: "#4ca88f",
          500: "#2f8d75",
          600: "#246f5d",
          700: "#1e594c",
          800: "#19463d",
          900: "#173a33"
        },
        ink: "#0f1720",
        sand: "#f7f4ed"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      boxShadow: {
        panel: "0 20px 50px rgba(15, 23, 32, 0.10)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(15, 23, 32, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 32, 0.05) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
