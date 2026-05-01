/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5bcfd',
          400: '#8098fa',
          500: '#6175f5',
          600: '#4a55e8',
          700: '#3d45d0',
          800: '#323aa8',
          900: '#2e3585',
          950: '#1c1f52',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
