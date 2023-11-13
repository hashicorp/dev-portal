import fs from 'fs'
import path from 'path'
import { fetchGithubArchiveZip } from 'lib/fetch-github-archive-zip'
import { isDeployPreview } from 'lib/env-checks'

/**
 * Set the location in the local filesystem where we'll extract HVD content.
 */
export const HVD_CONTENT_DIR = path.join(
	process.cwd(),
	'src/.extracted/hashicorp-validated-designs'
)

const BASE_REPO_CONFIG = {
	owner: 'hashicorp',
	ref: 'main',
}

/**
 * For now, we extract content from `hvd-docs` only.
 *
 * TODO: provide a solution for local development of HVD content.
 *
 * One option might be, if we detect we're in local development using
 * the `hashicorp/dev-portal` repo directly, we could attempt to load in
 * `hvd-docs` content from the local filesystem in an adjacent directory
 * one level up from the current working directory. In other words, we'd assume:
 * - `dev-portal` is the current working directory (i.e. `process.cwd()`
 * - `dev-portal/../hvd-docs` has local content being developed
 */
extractHvdContent(['hvd-docs'], HVD_CONTENT_DIR)

/**
 * This script extracts HVD content from the `hashicorp-validated-designs`
 * GitHub organization into the local filesystem that `dev-portal` can access.
 *
 * Note that we
 */
async function extractHvdContent(repoNames: string[], contentDir: string) {
	// Skip extraction in deploy previews
	if (isDeployPreview()) {
		console.log(
			'Note: Content repo deploy preview detected. Skipping HVD content.'
		)
		return
	}

	// Ensure an enclosing content directory exists for HVD content
	fs.mkdirSync(contentDir, { recursive: true })
	// Extract HVD repo contents into the `src/content` directory
	for (const repoName of repoNames) {
		try {
			// Fetch a zip archive of the repo contents
			const contentZip = await fetchGithubArchiveZip({
				repo: repoName,
				...BASE_REPO_CONFIG,
			})
			/**
			 * Write out the content.
			 *
			 * Note that initially, we expect the extracted content to be nested in a
			 * directory with a convoluted name including the repo org, name, and sha.
			 * We shift some content to avoid this convolution.
			 */
			// Establish our target directory
			const finalDestination = path.join(contentDir, repoName)
			// Clear out the target directory, may be present from previous runs
			fs.rmSync(finalDestination, { recursive: true, force: true })
			// Extract into a temporary directory initially, we'll clean this up
			const tempDestination = finalDestination + '_temp'
			contentZip.extractAllTo(tempDestination, true)
			// Move the convolutedly named folder out of temp, rename it predictably
			const convolutedName = fs.readdirSync(tempDestination)[0]
			const convolutedDir = path.join(tempDestination, convolutedName)
			fs.renameSync(convolutedDir, finalDestination)
			// Clean up the temporary directory
			fs.rmSync(tempDestination, { recursive: true })
		} catch (error) {
			/**
			 * When authors are running locally from content repos,
			 * we want to ignore errors.
			 *
			 * In all other scenarios, we want errors related to HVD content to
			 * surface. This does mean that anyone running `hashicorp/dev-portal`
			 * locally will need to have a valid `GITHUB_TOKEN`.
			 */
			if (process.env.IS_CONTENT_PREVIEW) {
				console.log(
					`Note: HVD content was not extracted, and will not be built. If you need to work on HVD content, please ensure a valid GITHUB_TOKEN is present in your environment variables. Error: ${error}`
				)
			} else {
				throw error
			}
		}
	}
}
