import antfu from '@antfu/eslint-config'

export default antfu(
  {
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
    ignores: ['.agents/**', './claude/**'],
  },
  {
    files: [
      'server/**',
      'drizzle.config.ts',
    ],
    rules: {
      'no-console': 'off',
      'node/prefer-global/process': 'off',
    },
  },
)
