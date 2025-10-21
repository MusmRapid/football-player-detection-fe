/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellowBrand: '#FFBB23',
        greenBrand: '#80B28F',
        textMoss: '#364D05',
        heroBack: '#EFF4ED',
        hiwBack: '#FAFDF6',
        sideLinks: '#476603',
        dwBrand: '#F1F1E9',
        inputBorder: '#CFCFCF',
        heroLeft: '#0D1B2A',
        heroRight: '#1B263B',
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        lato: ['Lato', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
