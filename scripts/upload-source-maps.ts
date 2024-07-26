/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { execSync } from 'child_process'

/**
 * Set up constants based on environment variables
 *
 * Note that dd stands for DataDog, many constants are used for DataDog.
 * Docs on Vercel System Environment Variables:
 * https://vercel.com/docs/projects/environment-variables/system-environment-variables
 */
const VERCEL_ENV = process.env.VERCEL_ENV
const IS_DEV = VERCEL_ENV === 'development'
const COMMIT_SHA = IS_DEV
	? execSync('git rev-parse HEAD')
	: process.env.VERCEL_GIT_COMMIT_SHA
const DD_SERVICE_MAP = {
	development: 'non-prod.developer.hashicorp.com',
	preview: 'non-prod.developer.hashicorp.com',
	production: 'developer.hashicorp.com',
}
const DD_API_KEY = process.env.DD_API_KEY
const DD_DRY_RUN = IS_DEV ? '--dry-run' : ''
const DD_SERVICE = DD_SERVICE_MAP[VERCEL_ENV]

/**
 * Upload source maps to DataDog using the `datadog-ci` CLI.
 *
 * The DataDog service to which we upload source maps will vary based on
 * the environment we're in, to correspond with the DataDog setup we have
 * in our `config` directory.
 *
 * - If we're in development, we'll execute a "dry run", no upload will occur.
 * - If we're in preview, we'll use `non-prod.developer.hashicorp.com`
 * - If we're in production, we'll use `developer.hashicorp.com`
 */
function main() {
	try {
		/**
		 * For some reason, in Vercel build contexts, there don't seem to be any
		 * git remotes available, and we get a warning from DataDog, and no links
		 * back to source in the DataDog UI. To fix this, we manually add the
		 * expected git remote here, solely for the purpose of DataDog.
		 *
		 * Note: we could in theory construct this from Vercel System env variables,
		 * but it feels a little easier to hard-code it.
		 */
		execSync(
			`git remote add origin https://github.com/hashicorp/dev-portal.git`
		)
		// Run the upload command
		execSync(
			`DATADOG_API_KEY=${DD_API_KEY} ./node_modules/.bin/datadog-ci sourcemaps upload .next/static/ --service="${DD_SERVICE}" --release-version="${COMMIT_SHA}" --minified-path-prefix="/_next/static/" ${DD_DRY_RUN}`,
			{ stdio: 'inherit' }
		)
		// Remove source maps after uploading
		execSync(`rm -f .next/static/**/*.map`)
	} catch (error) {
		console.error('Error: Failed to upload and then remove source maps.')
		console.error(error)
	}
}

main()
