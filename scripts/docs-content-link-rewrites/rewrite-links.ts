import fs from 'fs'
import path from 'path'
import { getAllLinksToRewrite } from './helpers/get-all-links-to-rewrite'
import { getDocsToDevDotUrlMap } from './helpers/get-dot-io-to-dev-dot-url-map'
import { getLearnToDevDotUrlMap } from './helpers/get-learn-to-dev-dot-url-map'
import { normalizeRemoteLoaderSlug } from './helpers/normalize-remote-loader-slug'
import { rewriteFileContentString } from './helpers/rewrite-file-content-string'

const main = async () => {
	// Make sure the required environment variables are set
	const missingRequiredEnvVariables = [
		'FILE_PATH_PREFIX',
		'RELEVANT_CHANGED_FILES',
		'REPO',
	].filter((key: string) => !process.env[key])
	if (missingRequiredEnvVariables.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missingRequiredEnvVariables}`
		)
	}

	// Destructure environment variables we want to use
	const {
		CI,
		ERROR_IF_LINKS_TO_REWRITE,
		FILE_PATH_PREFIX,
		RELEVANT_CHANGED_FILES,
		REPO,
	} = process.env

	// See if there are any relevant changed files to check for rewriteable links
	const { changedMdxFiles = [], changedNavDataJsonFiles = [] } = JSON.parse(
		RELEVANT_CHANGED_FILES
	)
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

	// Invoke the helper that checks MDX and JSON files for rewriteable links
	const normalizedProductSlug = normalizeRemoteLoaderSlug(REPO)
	console.log(
		`Processing ${changedMdxFiles.length} .mdx files and ${changedNavDataJsonFiles.length} -nav-data.json files`
	)
	const { allLinksToRewrite, allUnrewriteableLinks } =
		await getAllLinksToRewrite({
			filePaths: changedMdxFiles.map((filePath: string) =>
				path.join(FILE_PATH_PREFIX, filePath)
			),
			dotIoToDevDotPaths,
			learnToDevDotPaths,
			normalizedProductSlug,
		})

	// If there are links to rewrite...
	const filesWithLinksToRewrite = Object.keys(allLinksToRewrite)
	if (filesWithLinksToRewrite.length > 0) {
		const message = `Found links to rewrite in ${filesWithLinksToRewrite.length} files: ${allLinksToRewrite}`

		// Throw an error if configured to, such as in a legacy link format checker
		if (ERROR_IF_LINKS_TO_REWRITE === 'true') {
			throw new Error(message)
		} else {
			console.log(message)
		}

		// Otherwise, update the files determined to have rewriteable links
		filesWithLinksToRewrite.forEach((filePath: string) => {
			// Attempt to rewrite the file content string
			const linksToRewrite = allLinksToRewrite[filePath]
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

	// In CI environments, we do not need to output any files, so return.
	if (CI) {
		return
	}

	// Write out the `allLinksToRewrite` file (intended for debugging)
	if (Object.keys(allLinksToRewrite).length > 0) {
		const generatedFilesDirectory = path.join(__dirname, '.generated')
		if (!fs.existsSync(generatedFilesDirectory)) {
			fs.mkdirSync(generatedFilesDirectory)
		}

		const rewrittenLinksDirectory = path.join(
			generatedFilesDirectory,
			'links-to-rewrite'
		)
		if (!fs.existsSync(rewrittenLinksDirectory)) {
			fs.mkdirSync(rewrittenLinksDirectory)
		}

		const rewrittenLinksFile = path.join(
			rewrittenLinksDirectory,
			`${REPO}.json`
		)
		console.log(`Generating ${rewrittenLinksFile}...`)
		fs.writeFileSync(
			rewrittenLinksFile,
			JSON.stringify(allLinksToRewrite, null, 2)
		)
	}

	// Write out the `allUnrewriteableLinks` file (intended for debugging)
	if (allUnrewriteableLinks.length > 0) {
		const generatedFilesDirectory = path.join(__dirname, '.generated')
		if (!fs.existsSync(generatedFilesDirectory)) {
			fs.mkdirSync(generatedFilesDirectory)
		}

		const unrewriteableLinksDirectory = path.join(
			generatedFilesDirectory,
			'unrewriteable-links'
		)
		if (!fs.existsSync(unrewriteableLinksDirectory)) {
			fs.mkdirSync(unrewriteableLinksDirectory)
		}

		const unrewriteableLinksFile = path.join(
			unrewriteableLinksDirectory,
			`${REPO}.json`
		)
		console.log(`Generating ${unrewriteableLinksFile}...`)
		fs.writeFileSync(
			unrewriteableLinksFile,
			JSON.stringify(allUnrewriteableLinks.sort(), null, 2)
		)
	}
}

main()
