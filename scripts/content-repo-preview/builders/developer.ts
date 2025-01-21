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
 * Handles building deploy previews for content repositories within the context of the Developer site.
 */
export function DeveloperPreviewBuilder(product) {
	return {
		async prebuild() {
			process.env.PREVIEW_FROM_REPO = product

			const globalCSSFileContents = await fs.promises.readFile(
				globalCSSFile,
				'utf-8'
			)

			console.log(`🧹 removing global CSS references for other products`)
			await fs.promises.writeFile(globalCSSFile, globalCSSFileContents)

			/**
			 * Remove specific page files to speed up preview builds:
			 * - /src/pages/well-architected-framework
			 * - /src/pages/validated-patterns
			 */
			const pagesDir = path.join(cwd, 'src', 'pages')
			const pagesDirsToRemove = [
				'well-architected-framework',
				'validated-patterns',
			]

			/**
			 * Remove validated designs paths from docs previews
			 * unless we are in the hvd-docs repo
			 */
			if (process.env.REPO !== 'hvd-docs') {
				pagesDirsToRemove.push('/validated-designs')
			}

			const rootPagesDirs = (
				await fs.promises.readdir(pagesDir, { withFileTypes: true })
			).filter((ent) => ent.isDirectory())

			for (const dir of rootPagesDirs) {
				if (pagesDirsToRemove.includes(dir.name)) {
					console.log(`🧹 removing pages at /${dir.name}`)
					await fs.promises.rm(path.join(pagesDir, dir.name), {
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
