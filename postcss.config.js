module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      stage: 3,
      browsers: ['defaults'],
      autoprefixer: { flexbox: 'no-2009' },
      features: {
        'nesting-rules': true,
        'custom-media-queries': {
          importFrom: require.resolve(
            '@hashicorp/mktg-global-styles/custom-media.css'
          ),
        },
        'custom-properties': false,
      },
    },
    'postcss-normalize': { browsers: 'defaults' },
  },
}
