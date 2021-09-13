module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      "@babel/preset-env",
      {
        // "useBuiltIns": "usage",
        "targets": "> 0.25%, not dead",
        "modules": "cjs"
      }
    ]
  ],
  plugins: [
    ['module-resolver', {
      root: ['./lib'],
      alias: {
        '@': './lib',
      }
    }]
  ],
  only: ['src/components', 'src/core', 'src/utils', 'src/index.ts'],
  ignore: ['**/__tests__']
}