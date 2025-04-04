/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { allDocsFields, allTutorialsFields } from 'lib/sitemap'
import { unflatten } from 'flat'
import { getHashiConfig } from '../config'

const env = process.env.HASHI_ENV || 'development'
const envConfigPath = path.join(process.cwd(), 'config', `${env}.json`)

const __config = unflatten(getHashiConfig(envConfigPath))

console.log({__config})

/**
 * This script is run as part of the Build sitemap github action that runs on PRs and
 * pushes to main. To run this script manually, you can run the following command:
 * `npx hc-tools ./scripts/build-sitemap.ts`
 */
async function main() {
	try {
		await allDocsFields(__config)
	} catch (error) {
		console.error('Error building docs sitemap: ', error)
		process.exit(-1)
	}

	try {
		await allTutorialsFields(__config)
	} catch (error) {
		console.error('Error building tutorials sitemaps: ', error)
		process.exit(-1)
	}
}

main()
