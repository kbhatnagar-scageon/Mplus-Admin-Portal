/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Extend theme to support Indian localization if needed
      fontFamily: {
        'indian': ['"Noto Sans"', 'sans-serif'], // Supporting Indic scripts
      },
    },
  },
  plugins: [],
};