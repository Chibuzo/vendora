/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        surface: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          muted: "hsl(var(--surface-muted) / <alpha-value>)",
          inverse: "hsl(var(--surface-inverse) / <alpha-value>)"
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
        },
        overlay: "hsl(var(--overlay) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          50: "hsl(var(--color-primary-50) / <alpha-value>)",
          100: "hsl(var(--color-primary-100) / <alpha-value>)",
          200: "hsl(var(--color-primary-200) / <alpha-value>)",
          300: "hsl(var(--color-primary-300) / <alpha-value>)",
          400: "hsl(var(--color-primary-400) / <alpha-value>)",
          500: "hsl(var(--color-primary-500) / <alpha-value>)",
          600: "hsl(var(--color-primary-600) / <alpha-value>)",
          700: "hsl(var(--color-primary-700) / <alpha-value>)",
          800: "hsl(var(--color-primary-800) / <alpha-value>)",
          900: "hsl(var(--color-primary-900) / <alpha-value>)"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          50: "hsl(var(--color-accent-50) / <alpha-value>)",
          100: "hsl(var(--color-accent-100) / <alpha-value>)",
          200: "hsl(var(--color-accent-200) / <alpha-value>)",
          300: "hsl(var(--color-accent-300) / <alpha-value>)",
          400: "hsl(var(--color-accent-400) / <alpha-value>)",
          500: "hsl(var(--color-accent-500) / <alpha-value>)",
          600: "hsl(var(--color-accent-600) / <alpha-value>)",
          700: "hsl(var(--color-accent-700) / <alpha-value>)",
          800: "hsl(var(--color-accent-800) / <alpha-value>)",
          900: "hsl(var(--color-accent-900) / <alpha-value>)"
        },
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          foreground: "hsl(var(--success-foreground) / <alpha-value>)",
          100: "hsl(var(--color-success-100) / <alpha-value>)",
          300: "hsl(var(--color-success-300) / <alpha-value>)",
          600: "hsl(var(--color-success-600) / <alpha-value>)",
          700: "hsl(var(--color-success-700) / <alpha-value>)",
          800: "hsl(var(--color-success-800) / <alpha-value>)"
        },
        warning: {
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
          100: "hsl(var(--color-warning-100) / <alpha-value>)",
          300: "hsl(var(--color-warning-300) / <alpha-value>)",
          600: "hsl(var(--color-warning-600) / <alpha-value>)",
          700: "hsl(var(--color-warning-700) / <alpha-value>)",
          800: "hsl(var(--color-warning-800) / <alpha-value>)"
        },
        danger: {
          DEFAULT: "hsl(var(--danger) / <alpha-value>)",
          foreground: "hsl(var(--danger-foreground) / <alpha-value>)",
          100: "hsl(var(--color-danger-100) / <alpha-value>)",
          300: "hsl(var(--color-danger-300) / <alpha-value>)",
          600: "hsl(var(--color-danger-600) / <alpha-value>)",
          700: "hsl(var(--color-danger-700) / <alpha-value>)",
          800: "hsl(var(--color-danger-800) / <alpha-value>)"
        },
        neutral: {
          50: "hsl(var(--color-neutral-50) / <alpha-value>)",
          100: "hsl(var(--color-neutral-100) / <alpha-value>)",
          200: "hsl(var(--color-neutral-200) / <alpha-value>)",
          300: "hsl(var(--color-neutral-300) / <alpha-value>)",
          400: "hsl(var(--color-neutral-400) / <alpha-value>)",
          500: "hsl(var(--color-neutral-500) / <alpha-value>)",
          600: "hsl(var(--color-neutral-600) / <alpha-value>)",
          700: "hsl(var(--color-neutral-700) / <alpha-value>)",
          800: "hsl(var(--color-neutral-800) / <alpha-value>)",
          900: "hsl(var(--color-neutral-900) / <alpha-value>)"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      boxShadow: {
        "soft-xs": "var(--shadow-soft-xs)",
        "soft-sm": "var(--shadow-soft-sm)",
        "soft-md": "var(--shadow-soft-md)",
        "soft-lg": "var(--shadow-soft-lg)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, hsl(var(--color-primary-100) / 0.9), transparent 42%), radial-gradient(circle at bottom right, hsl(var(--color-accent-100) / 0.65), transparent 40%)",
        "panel-grid":
          "linear-gradient(hsl(var(--color-neutral-200) / 0.45) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--color-neutral-200) / 0.45) 1px, transparent 1px)"
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)"
          }
        }
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite"
      }
    }
  },
  plugins: []
};
