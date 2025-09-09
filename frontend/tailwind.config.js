/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      'xs': '320px',   // Small phones
      'sm': '640px',   // Large phones
      'md': '768px',   // Tablets
      'lg': '1024px',  // Small laptops
      'xl': '1280px',  // Desktops
      '2xl': '1536px', // Large desktops
      // Custom device breakpoints
      'mobile': '320px',
      'tablet': '768px',
      'desktop': '1024px',
      'wide': '1440px',
    },
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
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
};