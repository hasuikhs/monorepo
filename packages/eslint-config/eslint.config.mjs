import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  eslint.configs.recommended,
  {
    files: [ '**/*.{js,mjs,cjs,jsx,ts,tsx}' ],
    plugins: {
      '@typescript-eslint': tseslint,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'import': importPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: [ './tsconfig.json', './packages/*/tsconfig.json' ]
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/parsers': {
        '@typescript-eslint/parser': [ '.ts', '.tsx' ]
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: [ './tsconfig.json', './packages/*/tsconfig.json' ]
        },
        node: true
      }
    },
    rules: {
      'semi': [ 'error', 'always' ],
      'react/jsx-uses-react': 'warn',
      'react/jsx-uses-vars': 'warn',
      'react/jsx-curly-spacing': [ 'warn', 'always' ],
      'react/display-name': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'quotes': [ 'warn', 'single' ],
      'jsx-quotes': [ 'warn', 'prefer-double' ],
      'object-curly-spacing': [ 'warn', 'always' ],
      'template-curly-spacing': [ 'warn', 'always' ],
      'array-bracket-spacing': [ 'warn', 'always' ],
      'comma-dangle': [ 'error', 'never' ],
      'no-console': [ 'warn', { 'allow': [ 'error', 'warn', 'info' ] } ],
      'space-before-blocks': 'warn',
      'space-before-function-paren': [ 'error', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always'
      } ],
      'indent': [ 'warn', 2 ],
      'eqeqeq': [ 'error', 'smart' ],
      'prefer-const': 'error',
      'no-multiple-empty-lines': [ 'error', { 'max': 1 } ],
      'eol-last': [ 'error', 'always' ],
      'no-debugger': 'error',
      '@next/next/no-img-element': 'off',
      
      // 추가 import 규칙
      'import/order': [
        'warn',
        {
          groups: [ 'builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type' ],
          pathGroups: [
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
    }
  }
];
