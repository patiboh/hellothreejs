module.exports = {
  // For supported options, see:
  baseConfig: {
    extends: ['standard', 'prettier', 'prettier/standard'],
    plugins: ['standard'],
    rules: {
      'space-before-function-paren': 'off',
      'comma-dangle': 'off',
    },
  },
}
