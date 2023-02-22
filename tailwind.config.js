/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "text-bg": 'text-bg 15s ease infinite',
      },
      keyframes: {
        "text-bg": {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '25%': {backgroundPosition: '50% 50%'},
          '50%': { backgroundPosition: '100% 50%' },
          '75%': { backgroundPosition: '25% 25%' },
        },
      },
    },
  },
  plugins: [],
}
