/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        institucional: '#2563EB', // O teu Azul Institucional
      }
    },
  },
  plugins: [],
}