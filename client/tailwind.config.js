/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        earth: {
          50: '#fef7ee',
          100: '#fdecd1',
          200: '#fad4a5',
          300: '#f5b878',
          400: '#f0934a',
          500: '#ea7500',
          600: '#c25800',
          700: '#9a4400',
          800: '#7a3700',
          900: '#612e00',
        }
      },
      fontFamily: {
        'hindi': ['Noto Sans Devanagari', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
