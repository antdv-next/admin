import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: {
    css: true,
  },
  rules: {
    'e18e/prefer-static-regex': 'off',
    'e18e/ban-dependencies': [
      'error',
      {
        allowed: ['axios'],
      },
    ],
  },
}, {
  files: [
    'server/**',
  ],
  rules: {
    'no-console': 'off',
  },
})
