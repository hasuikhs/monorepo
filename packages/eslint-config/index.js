module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: [
    'plugin:jsx-a11y/recommended',
    'standard',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'jsx-a11y',
    'import'
  ],
  ignorePatterns: ['vite-env.d.ts', 'node_modules/', 'dist/'],
  rules: {
    /**
     * 기본 코드 스타일
     */
    'semi': ['error', 'always'],                        // 모든 문장 끝에 세미콜론 필수
    'quotes': ['warn', 'single'],                       // 문자열은 작은따옴표 사용
    'jsx-quotes': ['warn', 'prefer-double'],            // JSX 속성값은 큰따옴표 사용
    'indent': ['warn', 2],                              // 들여쓰기 2칸 사용
    'eol-last': ['error', 'always'],                    // 파일 마지막에 빈 줄 추가
    'no-multiple-empty-lines': ['error', { 'max': 1 }], // 연속된 빈 줄은 최대 1줄까지만 허용
    'comma-dangle': ['error', 'never'],                 // 객체/배열의 마지막 항목 뒤에 쉼표 금지
    '@typescript-eslint/no-explicit-any': 'warn',

    /**
     * 공백 규칙
     */
    'object-curly-spacing': ['warn', 'always'],     // 객체 리터럴의 중괄호 안쪽에 공백 필수 ({ prop: value })
    'template-curly-spacing': ['warn', 'always'],   // 템플릿 리터럴 중괄호 안쪽에 공백 필수 (${ expression })
    'array-bracket-spacing': ['warn', 'always'],    // 배열 대괄호 안쪽에 공백 필수 ([ 1, 2, 3 ])
    'space-before-blocks': 'warn',                  // 블록 시작 전 공백 필수 (if () { )
    'space-before-function-paren': ['error', {      // 함수 괄호 앞 공백 규칙
      'anonymous': 'always',                        // 익명함수: 공백 필수 (function () {})
      'named': 'never',                             // 기명함수: 공백 금지 (function foo() {})
      'asyncArrow': 'always'                        // 화살표 함수: 공백 필수 (async () => {})
    }],

    /**
     * React 관련 규칙
     */
    'react/jsx-uses-react': 'off',                // JSX 사용 시 React import 확인
    'react/react-in-jsx-scope': 'off',            // JSX 사용 시 React import 확인
    'react/jsx-uses-vars': 'error',                 // JSX에서 사용된 변수 사용 여부 확인
    'react/jsx-curly-spacing': ['warn', 'always'],  // JSX 중괄호 안쪽에 공백 필수 ({ value })
    'react/display-name': 'off',                    // 컴포넌트 displayName 속성 필수 규칙 비활성화

    /**
     * 변수 및 타입 관련
     */
    'no-unused-vars': 'error',                      // 사용하지 않는 변수 선언 금지
    'prefer-const': 'error',                        // 재할당이 없는 변수는 const 사용
    'eqeqeq': ['error', 'smart'],                   // 일치 연산자 사용 (==, != 대신 ===, !== 사용)

    /**
     * 디버깅 및 개발 관련
     */
    'no-console': ['warn', {                        // console 사용 제한
      'allow': ['error', 'warn', 'info']            // error, warn, info는 허용
    }],
    'no-debugger': 'warn',                          // debugger 문 사용 시 경고
  },
};