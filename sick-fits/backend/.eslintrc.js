module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['prettier', 'airbnb-base', 'plugin:react/recommended'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'comma-dangle': [
      2,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'no-console': 'off',
    'prettier/prettier': 'error',
    semi: 'off',
    'object-curly-newline': 'off',
    'react/react-in-jsx-scope': 'off',
    'implicit-arrow-linebreak': 'off',
  },
  overrides: [
    {
      files: ['**/*.spec.js', '**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
}
