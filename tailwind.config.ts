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
      keyframes: {
        "bounce-skew": {
          "0%": { transform: "translateY(0) skew(0deg, 0deg)" },
          "20%": { transform: "translateY(-12px) skew(-3deg, -3deg)" },
          "40%": { transform: "translateY(0) skew(2deg, 2deg)" },
          "60%": { transform: "translateY(-6px) skew(-2deg, -2deg)" },
          "80%": { transform: "translateY(0) skew(1deg, 1deg)" },
          "100%": { transform: "translateY(0) skew(0deg, 0deg)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-up": {
          "0%": {
            transform: "translateY(50px) scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0px)",
            opacity: "1",
          },
        },
        "fade-left": {
          "0%": { transform: "translateX(-200px)" },
          "100%": { transform: "translateX(0px)" },
        },
        "fade-right": {
          "0%": { transform: "translateX(200px)" },
          "100%": { transform: "translateX(0px)" },
        },
        "fade-horizontal": {
          "0%": { transform: "translateX(0)" },
          "30%": { transform: "translateX(30px)" },
          "60%": { transform: "translateX(15px)" },
          "80%": { transform: "translateX(25px)" },
          "100%": { transform: "translateX(0)" },
        },
        "zoom-in": {
          "0%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1.01)" },
        },
        "marquee-left-to-right": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "marquee-right-to-left": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "bounce-skew": "bounce-skew 1s ease-in-out",
        spin: "spin 1s linear infinite",
        "fade-up": "fade-up 300ms ease-in",
        "fade-left": "fade-left 500ms ease-in",
        "fade-right": "fade-right 500ms ease-in",
        "fade-horizontal": "fade-horizontal 2.5s linear infinite",
        "zoom-in": "zoom-in 0.5s ease-in",
        "marquee-left-to-right": "marquee-left-to-right 30s linear infinite",
        "marquee-right-to-left": "marquee-right-to-left 30s linear infinite",
      },
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
    },
  },
  plugins: [],
};
export default config;
