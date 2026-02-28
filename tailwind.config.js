/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        silver: {
          50:  '#f8fafc',
          100: '#f0f4f8',
          200: '#d9e2ec',
          300: '#bcccdc',
          400: '#9fb3c8',
          500: '#829ab1',
          600: '#627d98',
          700: '#486581',
          800: '#334e68',
          900: '#243b53',
          950: '#102a43',
        },
      },
      backgroundImage: {
        'silver-gradient': 'linear-gradient(135deg, #c8d6e5 0%, #e8edf2 50%, #a0b4c8 100%)',
        'dark-gradient':   'linear-gradient(180deg, #0d0d18 0%, #111120 100%)',
      },
    },
  },
  plugins: [],
}
