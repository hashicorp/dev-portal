import path from 'path'
import fs from 'fs'
import { execFileSync } from 'child_process'

// our CWD
const cwd = process.cwd()
const globalCSSFile = path.join(cwd, 'src', 'pages', 'style.css')

export function DeveloperPreviewBuilder(product) {
	return {
		async prebuild() {
			process.env.PREVIEW_FROM_REPO = product

			/**
			 * exclude any imports in the global CSS file which referenced the proxied io paths
			 */
			const globalCSSFileContents = await fs.promises.readFile(
				globalCSSFile,
				'utf-8'
			)

			const newContents = globalCSSFileContents
				.split('\n')
				.map((line) => {
					// comment out lines which references paths we will be removing
					if (!line.startsWith('/*') && line.includes('_proxied-dot-io')) {
						return `/* ${line} */`
					}
					return line
				})
				.join('\n')

			console.log(`🧹 removing global CSS references for other products`)
			await fs.promises.writeFile(globalCSSFile, newContents)

			/**
			 * Remove specific page files to speed up preview builds:
			 * - Remove /src/pages/_proxied-dot-io
			 */
			const pagesDir = path.join(cwd, 'src', 'pages')
			const pagesDirsToRemove = ['_proxied-dot-io']

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
