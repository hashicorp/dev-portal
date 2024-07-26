/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { execSync } from 'child_process'
import { readdirSync, unlinkSync } from 'fs'
import { join } from 'path'

const main = () => {
	if (process.env.VERCEL_ENV === 'development') {
		return
	}

	const LATEST_SHA = process.env.VERCEL_GIT_COMMIT_SHA
	// const PATH_PREFIX = 'https://developer.hashicorp.com/_next/static/'
	// const SERVICE = 'developer.hashicorp.com'
	const PATH_PREFIX =
		'https://dev-portal-git-rn-featbuild-source-maps-during-deploy-hashicorp.vercel.app/_next/static/'
	const SERVICE = process.env.VERCEL_ENV === 'production' ? 'developer.hashicorp.com' : 'non-prod.developer.hashicorp.com'

	const DATADOG_API_KEY = process.env.DD_API_KEY

	try {
		execSync(
			`DATADOG_API_KEY=${DATADOG_API_KEY} npx @datadog/datadog-ci sourcemaps upload .next/static/ --service=${SERVICE} --release-version=${LATEST_SHA} --minified-path-prefix=${PATH_PREFIX} --disable-git`,
			{ stdio: 'inherit' }
		)

		console.log('Source maps uploaded successfully')
	} catch (error) {
		console.error(error)

		console.log('Failed to upload source maps')
	}

	// delete sourcemaps from chunks dir
	try {
		// Read the directory and delete all *.js.map files
		const dirPath = `.next/static/chunks`
		const files = readdirSync(dirPath)
		files.forEach((file) => {
			if (file.endsWith('.js.map')) {
				unlinkSync(join(dirPath, file))
			}
		})
	} catch (error) {
		console.error(error)

		console.log('Failed to delete source maps from chunks dir')
	}

	// delete sourcemaps from pages dir
	try {
		// Read the directory and delete all *.js.map files
		const dirPath = `.next/static/chunks/pages`
		const files = readdirSync(dirPath)
		files.forEach((file) => {
			if (file.endsWith('.js.map')) {
				unlinkSync(join(dirPath, file))
			}
		})
	} catch (error) {
		console.error(error)

		console.log('Failed to delete source maps from pages dir')
	}
}

main()
