/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const platformPostcssConfig = require('@hashicorp/platform-postcss-config')

// Next.js allows for plugins to be specified as an array of arrays, but this
// isn't supported by Vitest, so use a helper function to convert the array of
// arrays to an object.
function standardSyntax(plugins) {
	const _plugins = {}
	plugins.forEach((p) => {
		if (Array.isArray(p)) {
			_plugins[p[0]] = p[1]
		} else {
			_plugins[p] = {}
		}
	})
	return _plugins
}

/**
 * TODO: this is a spike to show that this configuration may resolve
 * the issues we're having in dev-dot when using @custom-media.
 * We likely want to incorporate this into `@hashicorp/platform-postcss-config`.
 * Eg, maybe it should accept an optional "options" object, where we can
 * pass additional files to `importFrom`?
 */
function alsoImportDevDotCustomMedia(postcssConfig) {
	const newPlugins = postcssConfig.plugins.map((plugin) => {
		// we only want to modify postcss-preset-env
		const isPresetEnv =
			Array.isArray(plugin) &&
			plugin.length == 2 &&
			plugin[0] == 'postcss-preset-env'
		if (!isPresetEnv) {
			return plugin
		}
		// we want to modify the postcss-preset-env settings object,
		// which we expect as a second part of a tuple in the plugin array entry.
		// specifically, we want to add to the "importFrom" setting.
		const [presetEnvName, presetEnvOptions] = plugin
		const existingImportFrom =
			presetEnvOptions.features['custom-media-queries'].importFrom
		const alsoImportFrom = require.resolve('./src/styles/custom-media.css')
		const newImportFrom = [alsoImportFrom].concat(existingImportFrom)
		// tack the newImportFrom on to the existing settings,
		// while retaining the rest of the settings
		const newPresetEnvSettings = { ...presetEnvOptions }
		newPresetEnvSettings.features['custom-media-queries'].importFrom =
			newImportFrom
		return [presetEnvName, newPresetEnvSettings]
	})
	// return the modified config
	return { ...postcssConfig, plugins: standardSyntax(newPlugins) }
}

module.exports = {
	...alsoImportDevDotCustomMedia(platformPostcssConfig),
}
