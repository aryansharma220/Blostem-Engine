/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d8eeff",
          500: "#0b8f8f",
          600: "#087878",
          900: "#08434a"
        }
      }
    },
  },
  plugins: [],
};
