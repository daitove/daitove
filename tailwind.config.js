/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'primary-900': '#040C22',
        'success-400': '#83D914',
        'gray-100': '#F9F9F9',
        'gray-200': '#ECECEC',
        'gray-400': '#BDBDBD'
      }
    }
  },
  plugins: []
};
