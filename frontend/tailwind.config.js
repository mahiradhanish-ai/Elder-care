/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a6f6',
          500: '#0c87eb', // Soft primary blue
          600: '#006bc9',
          700: '#0155a3',
          800: '#054885',
          900: '#0b3c6f',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Soft healthcare teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          card: '#ffffff',
        },
        elderly: {
          taken: '#10b981',    // Success green
          pending: '#f59e0b',  // Warning amber
          missed: '#ef4444',   // Danger red
          unconfirmed: '#8b5cf6', // Violet attention
          skipped: '#6b7280',  // Neutral gray
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'elderly-base': '1.125rem',  // 18px base for elderly readability
        'elderly-lg': '1.25rem',     // 20px
        'elderly-xl': '1.5rem',      // 24px
        'elderly-2xl': '1.875rem',   // 30px
        'elderly-3xl': '2.25rem',    // 36px
      },
      borderRadius: {
        'card': '1rem',
        'btn': '0.75rem',
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 8px 24px -4px rgba(15, 23, 42, 0.06)',
      }
    },
  },
  plugins: [],
};
