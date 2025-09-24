/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const path = require('path')
const { webpack } = require('next/dist/compiled/webpack/webpack')
const { getHashiConfig } = require('./index')

/**
 * Reads in config files from config/[env].json and replaces references in the
 * code with the literal values using webpack.DefinePlugin.
 *
 * Supports extending configs via the `extends` property.
 *
 * Example:
 *
 * ```
 * // base.json
 * {
 *   "foo": "bar"
 * }
 *
 * // production.json
 * {
 *   "extends": "base",
 *   "x": "y"
 * }
 *
 * // Result:
 * {
 *   "foo": "bar",
 *   "x": "y"
 * }
 * ```
 *
 * See the test file at `./config/__tests__/index.test.js` for a more thorough example.
 */
module.exports = async function HashiConfigPlugin() {
	const env = process.env.HASHI_ENV || 'development'
	const envConfigPath = path.join(process.cwd(), 'config', `${env}.json`)
	const baseConfigPath = path.join(process.cwd(), 'config', `base.json`)

	const config = await getHashiConfig(envConfigPath);

	return new webpack.DefinePlugin({
		...Object.fromEntries(
			Object.entries(config).map(([key]) => {
				return [
					`__config.${key}`,
					webpack.DefinePlugin.runtimeValue(
						() => {
							return JSON.stringify(config[key])
						},
						/**
						 * version is set to env here to ensure that webpack's persistent cache
						 * does not cache the wrong config values across builds with different HASHI_ENV values
						 */
						{ fileDependencies: [envConfigPath, baseConfigPath], version: env }
					),
				]
			})
		),
	})
}
