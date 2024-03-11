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
		__config.flags.enable_hvd_on_hvd_preview_branch === true
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

/**
 * Detect whether we are in the hashicorp/hvd-docs repo directly
 * and if so use the local path defined in the build or start script.
 *
 * Otherwise, use the path generated from the `extractHvdContent` script
 */
export const HVD_CONTENT_DIR =
	process.env.LOCAL_CONTENT_DIR ||
	path.join(HVD_REPO_DIR, BASE_REPO_CONFIG.contentPath)

export const HVD_FINAL_IMAGE_ROOT_DIR = '.extracted/hvd'

/**
 * This script extracts HVD content from the `hashicorp-validated-designs`
 * GitHub organization into the local filesystem that `dev-portal` can access.
 */
;(async function extractHvdContent() {
	// Skip extraction in deploy previews
	if (isDeployPreview()) {
		console.log(
			'Note: content repo deploy preview detected. Skipping HVD content.'
		)
		return
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
		// Clear out the target directory, may be present from previous runs
		fs.rmSync(HVD_REPO_DIR, { recursive: true, force: true })
		// Extract into a temporary directory initially, we'll clean this up
		const tempDestination = HVD_REPO_DIR + '_temp'
		contentZip.extractAllTo(tempDestination, true)
		// Move the convolutedly named folder out of temp, rename it predictably
		const convolutedName = fs.readdirSync(tempDestination)[0]
		const convolutedDir = path.join(tempDestination, convolutedName)
		fs.renameSync(convolutedDir, HVD_REPO_DIR)
		// Clean up the temporary directory
		fs.rmSync(tempDestination, { recursive: true })

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
		fs.cpSync(imageLocation, imageDestination, { recursive: true })
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
})()
