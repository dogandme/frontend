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
    boxShadow: {
      "bottom-sheet":
        "0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)",
    },
  },
};
