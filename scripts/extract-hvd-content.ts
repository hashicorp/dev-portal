/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'
import { fetchGithubArchiveZip } from 'lib/fetch-github-archive-zip'
import { isDeployPreview } from 'lib/env-checks'

import { unflatten } from 'flat'
import { getHashiConfig } from '../config'

const env = process.env.HASHI_ENV || 'development'
const envConfigPath = path.join(process.cwd(), 'config', `${env}.json`)
const __config = unflatten(getHashiConfig(envConfigPath))

export const BASE_REPO_CONFIG = {
	owner: 'hashicorp',
	ref:
		__config.flags.enable_hvd_on_preview_branch === true
			? 'hvd-preview'
			: process.env.CURRENT_GIT_BRANCH || 'main',
	repo: 'hvd-docs',
	contentPath: '/content',
}

/**
 * Set the location in the local filesystem where we'll extract HVD content.
 */
const HVD_REPO_DIR = path.join(
	process.cwd(),
	'src/.extracted/hashicorp-validated-designs'
)

const ALREADY_LOADED_HVD_IN_DEV = 'ALREADY_LOADED_HVD_IN_DEV'

/**
 * Detect whether we are in the hashicorp/hvd-docs repo directly
 * and if so use the local path defined in the build or start script.
 *
 * Otherwise, use the path generated from the `extractingHvdContent` script
 */
export const HVD_CONTENT_DIR =
	process.env.LOCAL_CONTENT_DIR ||
	path.join(HVD_REPO_DIR, BASE_REPO_CONFIG.contentPath)

export const HVD_FINAL_IMAGE_ROOT_DIR = '.extracted/hvd'

// wrap HVD extraction in a singleton to avoid multiple extractions
let hvdExtractionStatus: null | Promise<{
	status: 'success' | 'failure'
}>

function getHvdExtractionStatus() {
	if (hvdExtractionStatus) {
		return hvdExtractionStatus
	}

	hvdExtractionStatus = new Promise<{
		status: 'success' | 'failure'
	}>(async (resolve, _) => {
		// Skip extraction if content has already been loaded in development.
		// This is unique to development, because in development SSR is rerun on every request
		if (
			env === 'development' &&
			process.env[ALREADY_LOADED_HVD_IN_DEV] === 'true'
		) {
			resolve({ status: 'success' })
			return
		}

		// Skip extraction in deploy previews
		if (isDeployPreview('hvd-docs')) {
			resolve({ status: 'success' })
			return
		}

		// Clear out the target directory, may be present from previous runs
		if (fs.existsSync(HVD_REPO_DIR)) {
			fs.rmSync(HVD_REPO_DIR, {
				recursive: true,
				force: true,
			})
		}

		// Ensure an enclosing content directory exists for HVD content
		fs.mkdirSync(HVD_REPO_DIR, { recursive: true })

		// Extract HVD repo contents into the `src/content` directory
		try {
			// Fetch a zip archive of the repo contents
			const contentZip = await fetchGithubArchiveZip(BASE_REPO_CONFIG)
			/**
			 * Write out the content.
			 *
			 * Note that initially, we expect the extracted content to be nested in a
			 * directory with a convoluted name including the repo org, name, and sha.
			 * We shift some content to avoid this convolution.
			 */

			// Extract into a temporary directory initially, we'll clean this up
			const tempDestination = HVD_REPO_DIR + '_temp'
			contentZip.extractAllTo(tempDestination, true)

			// Move the convolutedly named folder out of temp, rename it predictably
			const convolutedName = fs.readdirSync(tempDestination)[0]
			const convolutedDir = path.join(tempDestination, convolutedName)
			fs.cpSync(convolutedDir, HVD_REPO_DIR, { recursive: true, force: true })

			// Clean up the temporary directory
			fs.rmSync(tempDestination, { recursive: true, force: true })

			/**
			 * Copy all image files into the `public` directory,
			 * preserving the directory structure.
			 */
			const imageLocation = path.join(HVD_REPO_DIR, 'public')
			const imageDestination = path.join(
				process.cwd(),
				'public/',
				HVD_FINAL_IMAGE_ROOT_DIR
			)
			fs.cpSync(imageLocation, imageDestination, {
				recursive: true,
				force: true,
			})

			if (env === 'development') {
				console.log(
					'Loaded HVD content. Note this content will not be updated until "npm run start" is run again.'
				)

				// This is a hack to preserve some state between server restarts, as we cannot rely on JS variables persisting across restarts
				process.env[ALREADY_LOADED_HVD_IN_DEV] = 'true'
			}

			resolve({ status: 'success' })
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
			}

			resolve({ status: 'failure' })
		}
	})

	return hvdExtractionStatus
}

export { getHvdExtractionStatus }
