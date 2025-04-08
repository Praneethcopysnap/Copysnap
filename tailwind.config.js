/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#0070f3', // 💡 Electric Blue
          secondary: '#6C757D', // muted gray
          accent: '#FF6B6B', // red accent (for error/warning)
          success: '#4ADE80', // green (success tooltip)
          dark: '#1F2937', // neutral dark (backgrounds)
          light: '#F3F4F6', // neutral light (backgrounds)
        },
        borderRadius: {
          xl: '1rem',
          '2xl': '1.5rem',
        },
        boxShadow: {
          card: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        fontFamily: {
          sans: ['Noto Sans', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
  