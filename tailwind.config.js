/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0284c7', // sky-600
          hover: '#0369a1', // sky-700
          light: '#f0f9ff' // sky-50
        },
        secondary: '#475569', // slate-600
        accent: '#10b981', // emerald-500
      },
      boxShadow: {
          'lg-blue': '0 10px 15px -3px rgb(14 165 233 / 0.1), 0 4px 6px -4px rgb(14 165 233 / 0.1)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
