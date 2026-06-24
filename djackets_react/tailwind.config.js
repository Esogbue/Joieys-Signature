/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C8A96E',
        pink: '#D63384',
        purple: '#9B59B6',
        lavender: '#E8D5F5',
        'light-pink': '#FCE4F0',
        dark: '#1a1a1a',
        light: '#FDFAFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
    },
  },
  plugins: [],
}
