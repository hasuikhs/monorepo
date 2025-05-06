import type { StorybookConfig } from '@storybook/react-webpack5';

import { dirname, join } from 'path';

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  'stories': [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  'addons': [
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('storybook-dark-mode'),
    getAbsolutePath('@storybook/addon-themes'),
    {
      name: '@storybook/addon-styling-webpack', // 추가된 부분
      options: {
        rules: [{
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  config: './postcss.config.js', // 프로젝트 루트 기준 경로
                },
              },
            },
          ],
        }]
      }
    }
  ],
  'framework': {
    'name': getAbsolutePath('@storybook/react-webpack5'),
    'options': {}
  }
};
export default config;