import tailwindConfig from '@monorepo/tailwind-config';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  presets: [ tailwindConfig ],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        secondary: '#0100FF',
      },
    },
  },
  plugins: [],
}

