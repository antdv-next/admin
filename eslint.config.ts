import anfu from '@antfu/eslint-config'

export default anfu({
  formatters: {
    css: true,
  },
  rules: {
    'e18e/ban-dependencies': 'off',
  },
}, {
  files: [
    'server/**',
  ],
  rules: {
    'no-console': 'off',
  },
})
