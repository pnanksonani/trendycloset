/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      container: { center: true, padding: '1rem' },
      extend: {
        colors: {
          brand: {
            DEFAULT: '#6C63FF',
            600: '#5a52ff',
            700: '#4b43e6',
            purple: '#764ba2',
          },
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'],
        },
        boxShadow: {
          sm2: '0 2px 8px rgba(0,0,0,.08)',
          md2: '0 8px 30px rgba(0,0,0,.12)',
          lg2: '0 20px 40px rgba(0,0,0,.18)',
        },
        borderRadius: {
          xl2: '24px',
        },
      },
    },
    plugins: [require('@tailwindcss/forms')],
  };