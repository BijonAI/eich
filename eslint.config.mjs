import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    eqeqeq: 'off',
  },
  ignores: [
    'packages/test/**/*.{ts,js,tsx,jsx,json,html,css}',
  ],
})
