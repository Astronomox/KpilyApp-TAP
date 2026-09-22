import nextVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...nextVitals,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/no-unescaped-entities': 'warn',
      'import/no-anonymous-default-export': 'warn',
    },
  },
  {
    ignores: ['styles/**/*.jsx'],
  },
]

export default config
