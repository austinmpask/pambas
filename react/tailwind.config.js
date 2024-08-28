const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        proj: "0.3fr 0.6fr 0.6fr 0.6fr 2fr 0.3fr",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
