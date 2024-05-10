import animations from '@midudev/tailwind-animations';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      //
    }
  },
  plugins: [animations, forms({ strategy: 'class' })]
};
