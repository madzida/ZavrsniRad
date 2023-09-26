module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
    'plugin:react/recommended',
  ],
  rules: { 'prettier/prettier': ['error', { endOfLine: 'auto' }] },
};
