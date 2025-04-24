import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import baseConfig from '../eslint-config/eslint.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...baseConfig,
  {
    files: [ 'src/**/*.{ts,tsx}' ],
    rules: {
      // UI 컴포넌트 라이브러리에 특화된 규칙들
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      
      // UI 컴포넌트에서 JSX 관련 규칙
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-sort-props': [ 'warn', {
        callbacksLast: true,
        shorthandFirst: true,
        multiline: 'last',
        ignoreCase: true,
        reservedFirst: true
      } ],
      
      // 타입스크립트 관련 규칙
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-unused-vars': [ 'warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      } ],
      
      // import 규칙
      'import/no-internal-modules': 'off',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            [ 'parent', 'sibling' ],
            'index',
            'object',
            'type'
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before'
            },
            {
              pattern: '@monorepo/**',
              group: 'internal',
              position: 'before'
            }
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ]
    },
    settings: {
      'import/internal-regex': '^@monorepo/',
      'import/resolver': {
        typescript: {
          project: resolve(__dirname, './tsconfig.json')
        }
      }
    }
  }
];
