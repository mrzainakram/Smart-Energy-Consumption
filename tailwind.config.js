/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1e3a78',
        'dark-bg': '#0a0a0a',
        'light-blue': '#3b82f6',
        'maroon': {
          50: '#fdf2f2',
          100: '#fce7e7',
          200: '#f7c2c2',
          300: '#f29696',
          400: '#e86868',
          500: '#dc4444',
          600: '#c53030',
          700: '#7c2d12',
          800: '#5c1a0b',
          900: '#3c1312',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        zoom: 'zoomInOut 0.3s ease-in-out',
      },
      keyframes: {
        zoomInOut: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};