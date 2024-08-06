/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { execSync } from 'child_process'

/**
 * Uploads source maps to Datadog and then deletes source maps to prevent bundle size increase and leaking of source code.
 */
const main = () => {
	if (
		typeof process.env.DATADOG_API_KEY === 'undefined' ||
		typeof process.env.VERCEL_ENV === 'undefined' ||
		process.env.VERCEL_ENV === 'development'
	) {
		return
	}

	const LATEST_SHA = process.env.VERCEL_GIT_COMMIT_SHA
	const PATH_PREFIX =
		process.env.VERCEL_ENV === 'production'
			? 'https://developer.hashicorp.com/_next/static/'
			: `https://${process.env.VERCEL_BRANCH_URL}/_next/static/`
	const SERVICE =
		process.env.VERCEL_ENV === 'production'
			? 'developer.hashicorp.com'
			: 'non-prod.developer.hashicorp.com'

	const DATADOG_API_KEY = process.env.DD_API_KEY

	try {
		execSync(
			`DATADOG_API_KEY=${DATADOG_API_KEY} npx @datadog/datadog-ci sourcemaps upload .next/static/ --service=${SERVICE} --release-version=${LATEST_SHA} --minified-path-prefix=${PATH_PREFIX} --disable-git`,
			{ stdio: 'inherit' }
		)

		console.log('Source maps uploaded successfully')
	} catch (error) {
		console.error(error)

		console.log('Failed to upload sourcemaps')
	}

	// delete sourcemaps
	try {
		execSync(`rm -f .next/static/**/*.js.map`)
	} catch (error) {
		console.error(error)

		console.log('Failed to delete sourcemaps')
	}
}

main()
