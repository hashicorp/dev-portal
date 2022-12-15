import fs from 'fs'
import { normalizeRemoteLoaderSlug } from '../../src/lib/docs-content-link-rewrites/normalize-remote-loader-slug'
import { getDocsToDevDotUrlMap } from './helpers/get-dot-io-to-dev-dot-url-map'
import { getLearnToDevDotUrlMap } from './helpers/get-learn-to-dev-dot-url-map'
import { getMdxLinksToRewrite } from './helpers/get-mdx-links-to-rewrite'
import { getRewriteLinksScriptArguments } from './helpers/get-rewrite-links-script-arguments'
import { getRewrittenNavDataJsonForFilePaths } from './helpers/get-rewritten-nav-data-json-for-file-paths'
import { rewriteFileContentString } from './helpers/rewrite-file-content-string'

const main = async () => {
	const { changedMdxFiles, changedNavDataJsonFiles, repo } =
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

	// If there files to check, start pulling .io and learn data needed
	console.log('Loading dotIoToDevDotPaths...')
	const dotIoToDevDotPaths = getDocsToDevDotUrlMap()
	console.log('Loading learnToDevDotPaths...')
	const learnToDevDotPaths = await getLearnToDevDotUrlMap()

	// Invoke the helpers that checks MDX and JSON files for rewriteable links
	const normalizedProductSlug = normalizeRemoteLoaderSlug(repo)
	console.log(
		`Processing ${changedMdxFiles.length} .mdx files and ${changedNavDataJsonFiles.length} -nav-data.json files`
	)

	/**
	 * HANDLE NAV DATA LINKS
	 */
	const allRewrittenNavData = await getRewrittenNavDataJsonForFilePaths({
		filePaths: changedNavDataJsonFiles,
		dotIoToDevDotPaths,
		learnToDevDotPaths,
		normalizedProductSlug,
	})
	const navDataFilesToUpdate = []
	changedNavDataJsonFiles.forEach((navDataFilePath) => {
		const originalData = JSON.parse(fs.readFileSync(navDataFilePath, 'utf-8'))
		const updatedData = allRewrittenNavData[navDataFilePath]

		const originalDataString = JSON.stringify(originalData, null, 2)
		const updatedDataString = JSON.stringify(updatedData, null, 2)
		if (updatedDataString !== originalDataString) {
			navDataFilesToUpdate.push(navDataFilePath)

			if (!CI) {
				console.log(`Updating links in ${navDataFilePath}...`)
				fs.writeFileSync(navDataFilePath, updatedDataString)
			}
		}
	})
	if (navDataFilesToUpdate.length > 0) {
		// Throw an error if configured to, such as in a legacy link format checker
		const message = `Found nav data JSON links to rewrite in ${
			navDataFilesToUpdate.length
		} files:\n${JSON.stringify(navDataFilesToUpdate, null, 2)}`
		if (ERROR_IF_LINKS_TO_REWRITE === 'true') {
			throw new Error(message)
		} else {
			console.log(message)
		}
	}

	/**
	 * HANDLE UPDATING MDX LINKS
	 */
	const { mdxLinksToRewrite } = await getMdxLinksToRewrite({
		filePaths: changedMdxFiles,
		dotIoToDevDotPaths,
		learnToDevDotPaths,
		normalizedProductSlug,
	})

	const mdxFilesWithLinksToRewrite = Object.keys(mdxLinksToRewrite)
	if (mdxFilesWithLinksToRewrite.length > 0) {
		// Throw an error if configured to, such as in a legacy link format checker
		const message = `Found MDX links to rewrite in ${
			mdxFilesWithLinksToRewrite.length
		} files:\n${JSON.stringify(mdxLinksToRewrite, null, 2)}`
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
}

main()
