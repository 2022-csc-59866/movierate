/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1c1f25",
        secondary: "#282c34",
        "dark-subtle": "rgba(28, 31, 37, 0.5)",
        "light-subtle": "rgba(40, 44, 52, 0.5)",
        "highlight-dark": "#ffc200",
        highlight: "#ffc200",
        "custom-gold": "#d0a462",
        "custom-gray": "#e7eff6",
      },
    },
  },
  plugins: [],
};
