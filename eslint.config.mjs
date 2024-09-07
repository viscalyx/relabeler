import globals from 'globals';
import js from '@eslint/js';
import ts_eslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2020
      },
      parser: ts_eslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
    },
    plugins: {
      '@typescript-eslint': ts_eslint.plugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts_eslint.configs.recommended.rules,
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      '@typescript-eslint/no-unused-vars': 'error'
    }
  }
];
