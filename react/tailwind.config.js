const { nextui } = require("@nextui-org/react");

const colors = {
  success: "#00FF9B",
  successShadow: "#0a8f5a",

  danger: "#FF3A85",
  dangerShadow: "#a12554",

  warn: "#FFFF5C",
  warnShadow: "#a6a630",

  lightBg: "FILLIN",
  lightShadow: "#CED6D6",

  projBg: "#ececec",
};

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
      colors: { ...colors },
      backgroundColor: { ...colors },
      borderColor: { ...colors },

      transitionDuration: {
        140: "140ms",
        250: "250ms",
      },

      transitionTimingFunction: {
        "fmarker-in": "cubic-bezier(0.21, 1.245, 0, 1.125)",
        "fmarker-out": "cubic-bezier(0.29, 0, 0, 0.99)",
      },

      backgroundImage: {
        "proj-img":
          "linear-gradient(#101cff0a 1px, transparent 1px), linear-gradient(to right, #3a18ff15 1px, #e6e6e6 1px)",
        "header-img":
          "linear-gradient(72deg, hsl(216, 45%, 43%) 0%, hsl(241, 33%, 36%) 100%)",
      },

      backgroundSize: {
        "proj-size": "20px 20px",
      },
      screens: {
        lg: "1220px",
        xl: "1424px",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
