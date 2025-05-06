import tailwindConfig from '@monorepo/tailwind-config';

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [ tailwindConfig ],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

