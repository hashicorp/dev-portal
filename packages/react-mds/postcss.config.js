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

const baseConfig = require('@hashicorp/platform-postcss-config')

module.exports = {
	...baseConfig,
	plugins: standardSyntax(baseConfig.plugins),
}
