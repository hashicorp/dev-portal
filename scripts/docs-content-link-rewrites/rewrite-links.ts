/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'
import tutorialMap from 'data/_tutorial-map.generated.json'
import { normalizeRemoteLoaderSlug } from 'lib/docs-content-link-rewrites/normalize-remote-loader-slug'
import { cachedGetProductData } from 'lib/get-product-data'
import { getProductUrlAdjuster } from 'views/docs-view/utils/product-url-adjusters'
import { getMdxLinksToRewrite } from './helpers/get-mdx-links-to-rewrite'
import { getRewriteLinksScriptArguments } from './helpers/get-rewrite-links-script-arguments'
import { rewriteFileContentString } from './helpers/rewrite-file-content-string'

const main = async () => {
	const { changedMdxFiles, changedNavDataJsonFiles, mdxFilesPrefix, repo } =
		await getRewriteLinksScriptArguments()

	// Destructure environment variables we want to use
	const { CI, ERROR_IF_LINKS_TO_REWRITE } = process.env

	// See if there are any relevant changed files to check for rewriteable links
	if (changedMdxFiles.length === 0) {
		console.log('No `changedMdxFiles` to check for rewriteable links.')
	}
	if (changedNavDataJsonFiles.length === 0) {
		console.log('No `changedNavDataJsonFiles` to check for rewriteable links.')
	}
	if (changedMdxFiles.length === 0 && changedNavDataJsonFiles.length === 0) {
		return
	}

	// Invoke the helpers that checks MDX and JSON files for rewriteable links
	const normalizedProductSlug = normalizeRemoteLoaderSlug(repo)
	const productData = cachedGetProductData(normalizedProductSlug)
	const urlAdjustFn = getProductUrlAdjuster(productData)
	console.log(
		`Processing ${changedMdxFiles.length} .mdx files and ${changedNavDataJsonFiles.length} -nav-data.json files`
	)

	/**
	 * @TODO HANDLE NAV DATA LINKS
	 * https://app.asana.com/0/1202114367927919/1203641801270767/f
	 */

	/**
	 * HANDLE UPDATING MDX LINKS
	 */
	const { mdxLinksToRewrite, mdxUnrewriteableLinks } =
		await getMdxLinksToRewrite({
			filePathPrefix: mdxFilesPrefix,
			filePaths: changedMdxFiles,
			urlAdjustFn,
			repo,
			tutorialMap,
		})

	// Handle files that contain links that need to be rewritten.
	const mdxFilesWithLinksToRewrite = Object.keys(mdxLinksToRewrite)
	if (mdxFilesWithLinksToRewrite.length > 0) {
		// Throw an error if configured to, such as in a legacy link format checker
		let message = `\n 🔴 Found MDX links to rewrite in ${mdxFilesWithLinksToRewrite.length} files:`
		mdxFilesWithLinksToRewrite.forEach((file, index) => {
			message += `\n\n  File #${index + 1}: "${file}"`

			const linksForFile = mdxLinksToRewrite[file]
			Object.entries(linksForFile).forEach(([actual, expected]) => {
				message += `\n    Expected "${actual}" to be "${expected}"`
			})
		})
		message += '\n'

		if (ERROR_IF_LINKS_TO_REWRITE === 'true') {
			throw new Error(message)
		} else {
			console.log(message)
		}

		// If not in CI, update the files determined to have rewriteable links
		if (!CI) {
			mdxFilesWithLinksToRewrite.forEach((filePath: string) => {
				// Attempt to rewrite the file content string
				const linksToRewrite = mdxLinksToRewrite[filePath]
				const fileContent = fs.readFileSync(filePath, 'utf-8')
				const updatedContent = rewriteFileContentString(
					fileContent,
					linksToRewrite
				)

				// If the updated string is unchanged from the original, throw an error
				if (updatedContent === fileContent) {
					throw new Error(
						`None of the 'linksToRewrite' were rewritten for ${filePath}. There may be an issue with 'rewriteFileContentString'. The identified 'linksToRewrite' were:\n${JSON.stringify(
							linksToRewrite,
							null,
							2
						)}`
					)
				}

				// Otherwise, update the file with the rewritten links
				console.log(`Updating links in ${filePath}...`)
				fs.writeFileSync(filePath, updatedContent)
			})
		}
	}

	// Write the unrewriteable links data to an output file.
	const mdxFilesWithUnrewriteableLinks = Object.keys(mdxUnrewriteableLinks)
	if (!CI && mdxFilesWithUnrewriteableLinks.length > 0) {
		const generatedFilesFolder = path.join(process.cwd(), 'src', '.generated')
		if (!fs.existsSync(generatedFilesFolder)) {
			fs.mkdirSync(generatedFilesFolder)
		}
		const unrewriteableLinksFile = path.join(
			generatedFilesFolder,
			'docs-content-unrewriteable-links.json'
		)
		fs.writeFileSync(
			unrewriteableLinksFile,
			JSON.stringify(mdxUnrewriteableLinks, null, 2)
		)
	}
}

main()
