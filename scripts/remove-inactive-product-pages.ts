/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'

async function main() {
	if (
		!process.env.CI ||
		process.env.HASHI_ENV !== 'production' ||
		process.env.DEV_IO
	) {
		return
	}

	const pagesDir = path.join(process.cwd(), 'src', 'pages')

	const rootPagesDirs = (
		await fs.promises.readdir(pagesDir, { withFileTypes: true })
	).filter((ent) => ent.isDirectory())

	/**
	 * Remove page files which are not active
	 * Ensure we retain _proxied-dot-io as it serves our production .io sites
	 */
	for (const dir of rootPagesDirs) {
		if (dir.name === 'sentinel') {
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
