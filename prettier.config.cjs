module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],

  singleQuote: true,
  semi: false,

  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
