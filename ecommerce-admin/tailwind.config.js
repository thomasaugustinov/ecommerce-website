/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#52a6a6',
        highlighted: '#2c3a47',
        bgGray: '#242c36',
        bgBtnRed: '#ffbccd',
        btnRed: '#d60035',
      }
    },
  },
  plugins: [],
}

