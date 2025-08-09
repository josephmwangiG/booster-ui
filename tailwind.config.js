/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "arial"],
      },
      colors: {
        primary: {
          100: "#777",
          500: "#444",
          700: "#071437",
          900: "#000",
        },
        secondary:{
          500: "#0095E8",
        }
      },
    },
  },
  plugins: [],
};
