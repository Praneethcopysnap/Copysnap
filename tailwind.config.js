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
          primary: {
            DEFAULT: '#4F46E5', // Indigo as primary
            50: '#EEF2FF',
            100: '#E0E7FF',
            200: '#C7D2FE',
            300: '#A5B4FC',
            400: '#818CF8',
            500: '#6366F1',
            600: '#4F46E5',
            700: '#4338CA',
            800: '#3730A3',
            900: '#312E81',
          },
          secondary: {
            DEFAULT: '#6C757D',
            100: '#F8F9FA',
            200: '#E9ECEF',
            300: '#DEE2E6',
            400: '#CED4DA',
            500: '#ADB5BD',
            600: '#6C757D',
            700: '#495057',
            800: '#343A40',
            900: '#212529',
          },
          accent: {
            DEFAULT: '#EC4899', // Pink
            light: '#F9A8D4',
            dark: '#BE185D',
          },
          success: {
            DEFAULT: '#10B981', // Green
            light: '#A7F3D0',
            dark: '#065F46',
          },
          warning: {
            DEFAULT: '#F59E0B', // Amber
            light: '#FDE68A',
            dark: '#92400E',
          },
          error: {
            DEFAULT: '#EF4444', // Red
            light: '#FECACA',
            dark: '#B91C1C',
          },
          info: {
            DEFAULT: '#0EA5E9', // Sky blue
            light: '#BAE6FD',
            dark: '#0369A1',
          },
          dark: '#1F2937',
          light: '#F3F4F6',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
        },
        borderRadius: {
          xl: '1rem',
          '2xl': '1.5rem',
        },
        boxShadow: {
          card: '0 4px 12px rgba(0, 0, 0, 0.1)',
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
        fontFamily: {
          sans: ['Noto Sans', 'sans-serif'],
        },
        animation: {
          'gradient-x': 'gradient-x 15s ease infinite',
        },
        keyframes: {
          'gradient-x': {
            '0%, 100%': {
              'background-size': '200% 200%',
              'background-position': 'left center',
            },
            '50%': {
              'background-size': '200% 200%',
              'background-position': 'right center',
            },
          },
        },
      },
    },
    plugins: [],
  };
  