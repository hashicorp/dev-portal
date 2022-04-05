const platformPostcssConfig = require('@hashicorp/platform-postcss-config')

/**
 * TODO: this is a spike to show that this configuration may resolve
 * the issues we're having in dev-dot when using @custom-media.
 * We likely want to incorporate this into `@hashicorp/platform-postcss-config`.
 * Eg, maybe it should accept an optional "options" object, where we can
 * pass additional files to `importFrom`?
 */
function alsoImportDevDotCustomMedia(postcssConfig) {
  const newPlugins = postcssConfig.plugins.map((p) => {
    // we only want to modify postcss-preset-env
    const isPresetEnv =
      Array.isArray(p) && p.length == 2 && p[0] == 'postcss-preset-env'
    if (!isPresetEnv) return p
    // we want to modify the postcss-preset-env settings object,
    // which we expect as a second part of a tuple in the plugin array entry.
    // specifically, we want to add to the "importFrom" setting.
    const existingImportFrom = p[1].features['custom-media-queries'].importFrom
    const alsoImportFrom = require.resolve('./src/styles/custom-media.css')
    const newImportFrom = [alsoImportFrom].concat(existingImportFrom)
    // tack the newImportFrom on to the existing settings,
    // while retaining the rest of the settings
    const newPresetEnvSettings = {
      ...p[1],
      features: {
        ...p[1].features,
        'custom-media-queries': {
          ...p[1].features['custom-media-queries'],
          importFrom: newImportFrom,
        },
      },
    }
    return ['postcss-preset-env', newPresetEnvSettings]
  })
  // return the modified config
  return { ...postcssConfig, plugins: newPlugins }
}

module.exports = {
  ...alsoImportDevDotCustomMedia(platformPostcssConfig),
}
