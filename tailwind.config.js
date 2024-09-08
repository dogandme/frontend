/** @type {import('tailwindcss').Config} */
import { colors } from "./src/shared/constants";

export default {
  content: [
    ".index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./.storybook/**/*.{ts,tsx,js,jsx}",
    "./stories/**/*.{ts,tsx,js,jsx}",
  ],
  plugins: [],
  theme: {
    colors,
    extend: {
      boxShadow: {
        "floating-button":
          "0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)",
        "info-snackbar":
          "0px 1px 3px 0px rgba(0, 0, 0, 0.30), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
      },
      backgroundColor: {
        "translucent-gray": "rgba(33,33,33,0.25)",
        "translucent-tangerine": "rgba(251,88,33,0.5)",
      },
      keyframes: {
        radar: {
          "0%": {
            transform: "scale(0)",
            "transform-origin": "center center",
            opacity: 1,
          },
          "100%": {
            transform: "scale(1.5)",
            "transform-origin": "center center",
            opacity: 0,
          },
        },
      },
      animation: {
        radar: "radar 1.5s linear infinite",
      },
    },
  },
};
