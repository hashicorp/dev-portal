/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'
import { loadHashiConfigForEnvironment } from '../config'

async function main() {
	if (
		!process.env.CI ||
		process.env.HASHI_ENV !== 'production' ||
		process.env.DEV_IO
	) {
		return
	}

	/**
	 * We're selectively not rendering pages for that are hidden
	 * behind the HVD feature flag. This is accomplished by checking the products defined in
	 * config.flags.enable_hvd and removing page folders which could be associated with that content.
	 */
	const config = loadHashiConfigForEnvironment()
	const shouldBuildHVDPaths = config.flags.enable_hvd === true
	const pagesDir = path.join(process.cwd(), 'src', 'pages')

	const rootPagesDirs = (
		await fs.promises.readdir(pagesDir, { withFileTypes: true })
	).filter((ent) => ent.isDirectory())

	/**
	 * Remove page files which are not active
	 * Ensure we retain _proxied-dot-io as it serves our production .io sites
	 */
	for (const dir of rootPagesDirs) {
		if (
			dir.name === 'sentinel' ||
			(dir.name === 'validated-designs' && !shouldBuildHVDPaths)
		) {
			console.log(`🧹 removing pages at /${dir.name}`)
			if (!process.env.DRY_RUN) {
				await fs.promises.rm(path.join(pagesDir, dir.name), {
					recursive: true,
				})
			}
		}
	}
}

main()
