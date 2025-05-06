/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  presets: [ require('@monorepo/tailwind-config') ],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    // './stories/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

