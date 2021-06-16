module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint'), 'prettier'],
  rules: {
    'no-console': 0, // 禁止使用console
    'no-debugger': 2, // 禁止使用debugger
    'no-unused-vars': ['error'],
    '@typescript-eslint/no-unused-vars': ['error'], // 不能有声明后未被使用的变量或参数
    '@typescript-eslint/no-empty-function': ['warn'],
  },
};
