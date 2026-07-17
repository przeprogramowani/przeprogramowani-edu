import path from 'path';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [path.resolve(__dirname, './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}')],
  theme: {
    extend: {
      fontFamily: {
        main: "'Cocogoose', system-ui, sans-serif",
        light: "'CocogooseLight', system-ui, sans-serif",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    plugin(function ({ addComponents }) {
      addComponents({
        '.prose input[type="checkbox"]': {
          marginRight: '0.5rem',
          cursor: 'pointer',
        },
        '.prose li': {
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
        },
      });
    }),
  ],
};
