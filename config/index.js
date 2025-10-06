/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const fs = require('fs')
const path = require('path')
const flat = require('flat')

// Cache the final config to avoid re-reading files multiple times
let finalConfig;

/**
 * Load an environment config for the current environment, which is controlled by
 * process.env.HASHI_ENV
 */
async function loadHashiConfigForEnvironment() {
	const env = process.env.HASHI_ENV || 'development'
	const envConfigPath = path.join(process.cwd(), 'config', `${env}.json`)

	return await getHashiConfig(envConfigPath)
}

/**
 * Load an environment config from a specific path.
 */
async function getHashiConfig(configPath, logUDR = true) {
	if (finalConfig) {
		return finalConfig
	}

	try {
		const baseConfigPath = path.join(process.cwd(), 'config', `base.json`)
		const baseConfig = JSON.parse(fs.readFileSync(baseConfigPath))
		const envConfig = JSON.parse(fs.readFileSync(configPath))

		// Load the extended config, if no extends property is defined use the base config
		let extendsConfig = baseConfig
		if ('extends' in envConfig && envConfig.extends !== 'base') {
			// Determine which config this environment is extending from
			const extendsConfigPath = path.join(
				process.cwd(),
				'config',
				`${envConfig.extends}.json`
			)
			extendsConfig = await getHashiConfig(extendsConfigPath, false)
		}

		let udrProducts = Object.values({
			...extendsConfig.flags?.unified_docs_migrated_repos,
			...envConfig.flags?.unified_docs_migrated_repos
		})

		if (process.env.VERCEL !== 'production') {
			// Fetch additional config from UNIFIED_DOCS_API if available
			if (process.env.UNIFIED_DOCS_API) {
				try {
					const response = await fetch(`${process.env.UNIFIED_DOCS_API}/api/supported-products`)
					udrProducts = (await response.json()).result

					delete envConfig.flags.unified_docs_migrated_repos
					delete extendsConfig.flags.unified_docs_migrated_repos
					envConfig.flags.unified_docs_migrated_repos = udrProducts
				} catch (err) {
					console.warn('Failed to fetch from UNIFIED_DOCS_API:', err.message)
				}
			}
		}

		if (logUDR) {
			console.log(`Loading UDR from ${process.env.UNIFIED_DOCS_API}`);
			console.log(`Loading UDR Products: ${JSON.stringify(udrProducts, null, 2)}`);
		}

		const extendsFlattened = flat(extendsConfig, { safe: true })

		const envFlattened = flat(envConfig, {
			safe: true,
		})

		// Because we are "flattening" the object, a simple spread should be sufficient here
		finalConfig = { ...extendsFlattened, ...envFlattened }

		if (process.env.DEBUG_CONFIG) {
			console.log('[DEBUG_CONFIG]', finalConfig)
		}

		return finalConfig
	} catch (err) {
		throw new Error('Error loading environment config: ' + err)
	}
}

module.exports = { loadHashiConfigForEnvironment, getHashiConfig }
