import anfu from '@antfu/eslint-config'

export default anfu({
  formatters: {
    css: true,
  },
}, {
  files: [
    'server/**',
  ],
  rules: {
    'no-console': 'off',
  },
})
