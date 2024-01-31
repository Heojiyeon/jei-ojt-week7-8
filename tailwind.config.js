/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      white: '#ffffff',
      red: '#E5001A',
      borderRed: '#FFA09C',
      bgRed: '#FFF8F8',
      gray: '#A5A5A5',
      borderGray: '#E3E3E3',
    },
    fontFamily: {
      SUIT: ['Regular', 'Medium'],
    },
    extend: {},
  },
  plugins: [],
};
