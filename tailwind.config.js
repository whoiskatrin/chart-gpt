/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      textColor: ["placeholder"],
      backgroundColor: {
        "custom-gray-bg": "#EDEDED",
        "custom-gray": "#171717",
        "custom-dark-gray": "#1D1D1D",
        "frame-gray": "EEEEEE",
      },
      borderColor: {
        "custom-gray": "#171717",
      },
      placeholderColor: {
        dark: "#FFFFFF",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@headlessui/tailwindcss")],
};
