/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'
import { execFileSync } from 'child_process'

// our CWD
const cwd = process.cwd()
const globalCSSFile = path.join(cwd, 'src', 'pages', 'style.css')

/**
 * Handles building deploy previews for content repositories within the context of a product's .io site.
 */
export function IoPreviewBuilder(product) {
	return {
		async prebuild() {
			process.env.DEV_IO = product

			/**
			 * exclude any imports in the global CSS file which rely on other products
			 */
			const globalCSSFileContents = await fs.promises.readFile(
				globalCSSFile,
				'utf-8'
			)

			const newContents = globalCSSFileContents
				.split('\n')
				.map((line) => {
					// comment out lines which references paths we will be removing
					if (
						!line.startsWith('/*') &&
						line.includes('_proxied-dot-io') &&
						!line.includes(product)
					) {
						return `/* ${line} */`
					}
					return line
				})
				.join('\n')

			console.log(`🧹 removing global CSS references for other products`)
			await fs.promises.writeFile(globalCSSFile, newContents)

			/**
			 * Remove dirs in `src/pages` which are not associated with the product
			 */
			const pagesDir = path.join(cwd, 'src', 'pages')
			const proxiedIoPagesDir = path.join(pagesDir, '_proxied-dot-io')

			const rootPagesDirs = (
				await fs.promises.readdir(pagesDir, { withFileTypes: true })
			).filter((ent) => ent.isDirectory())
			const proxiedIoDirs = (
				await fs.promises.readdir(proxiedIoPagesDir, { withFileTypes: true })
			).filter((ent) => ent.isDirectory())

			for (const dir of rootPagesDirs) {
				if (dir.name !== '_proxied-dot-io' && dir.name !== 'api') {
					console.log(`🧹 removing pages at /${dir.name}`)
					await fs.promises.rm(path.join(pagesDir, dir.name), {
						recursive: true,
					})
				}
			}

			for (const dir of proxiedIoDirs) {
				if (!dir.name.includes(product)) {
					console.log(`🧹 removing pages for ${dir.name}`)
					await fs.promises.rm(path.join(proxiedIoPagesDir, dir.name), {
						recursive: true,
					})
				}
			}
		},
		async build() {
			execFileSync('npm', ['run', 'build'], { stdio: 'inherit' })
		},
	}
}
