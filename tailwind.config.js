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
  },
};
