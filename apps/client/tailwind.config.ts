import tailwindConfig from '@monorepo/tailwind-config';

import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  presets: [ tailwindConfig ],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      // colors: {
      //   background: 'var(--background)',
      //   foreground: 'var(--foreground)'
      // }
    }
  },
  plugins: []
};

export default config;
