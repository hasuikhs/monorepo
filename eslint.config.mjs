
import baseConfig from './packages/eslint-config/eslint.config.mjs';

export default [
  ...baseConfig,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/build/**',
      '**/coverage/**'
    ]
  }
];
