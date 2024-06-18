/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
//
import { getStaticProps } from 'views/open-api-docs-view/server'
// Types
import type { NextApiRequest, NextApiResponse } from 'next'
import type { OpenAPIV3 } from 'openapi-types'
import type { ProductSlug } from 'types/products'
import {
	schemaModDescription,
	schemaModShortenHcp,
} from 'views/open-api-docs-view/utils/massage-schema-utils'

/**
 * Setup
 */

// Determine if we're deploying to Vercel
const IS_VERCEL_DEPLOY = process.env.VERCEL_ENV !== 'development'
// Determine the temporary directory to use, based on Vercel deploy or not
const TMP_DIR = IS_VERCEL_DEPLOY ? '/tmp' : path.join(process.cwd(), '.tmp')
// Ensure the temporary directory exists, so we can stash files
if (!fs.existsSync(TMP_DIR)) {
	fs.mkdirSync(TMP_DIR)
}

/**
 * Given a temporary directory and a unique file ID, return a standard file path
 */
function getTempFilePath(tempDir, uniqueFileId) {
	return `${tempDir}/open-api-docs-view-props_${uniqueFileId}.json`
}

/**
 * Boilerplate page configuration, we could in theory expose this so visitors
 * to the preview tool could manipulate it, but we intentionally just
 * hard-code here to keep the focus of the preview tool on OpenAPI spec
 * contents.
 */
const GENERIC_PAGE_CONFIG = {
	// basePath same no matter what, preview tool is on static route
	basePath: '/open-api-docs-preview-v2',
	// No versioning in the preview tool, focus on one spec file at a time
	context: { params: { page: [] } },
	// Product slug, using HCP to just show a generic HashiCorp logo,
	// so that the preview tool's focus can remain on the spec file contents
	productSlug: 'hcp' as ProductSlug,
	// Generic resource items, we can set more specific ones closer to launch
	navResourceItems: [
		{
			title: 'Tutorial Library',
			href: '/tutorials/library',
		},
		{
			title: 'Certifications',
			href: '/certifications',
		},
		{
			title: 'Community',
			href: 'https://discuss.hashicorp.com/',
		},
		{
			title: 'Support',
			href: 'https://www.hashicorp.com/customer-success',
		},
	],
}

/**
 * We expected posted data to be an OpenAPI spec in JSON format.
 * We also allow an optional schema `info.description`, which normally would be
 * included in the spec content, so that authors can more easily develop
 * and preview their `info.description` content using our preview tool.
 */
type ExpectedBody = {
	openApiJsonString: string
	openApiDescription: string
	groupOperationsByPath: boolean
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	/**
	 * Handle GET requests, attempting to read stored props from `/tmp`
	 *
	 * TODO: on GET requests, could also traverse the `/tmp` directory,
	 * and delete any files older than a certain age. Would first have to
	 * include a time stamp in the file name...
	 *
	 * TODO: could support DELETE requests, to delete a specific file.
	 * This could allow authors working with sensitive data to have more
	 * immediate reassurance (on top of the unique file ID) that their file
	 * will not be randomly accessible to the public.
	 */
	if (req.method === 'GET') {
		/**
		 * Extract a unique file ID from the request query, if possible.
		 * This allows multiple authors to work with different files, and provides
		 * some level of protection against random public access of these files
		 * (not guaranteed, but better than nothing).
		 */
		const uniqueFileId = req.query.uniqueFileId as string | undefined
		// We require a unique file ID in order to read a previously stored file
		if (!uniqueFileId) {
			res.status(404).json({ error: 'No unique file ID provided' })
			return
		}
		// If we have a unique file ID, attempt to read the props from the file
		const tempFile = getTempFilePath(TMP_DIR, uniqueFileId)
		const props = readProps(tempFile)
		// If we don't have props return a 404
		if (props === null) {
			res
				.status(404)
				.json({ error: 'No props found for provided uniqueFileId.' })
			return
		}
		// Otherwise, we have successfully read in props, return them
		res.status(200).json({ staticProps: props, uniqueFileId })
		return
	}

	// If not GET, reject non-POST requests, only GET or POST is allowed
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST'])
		res.status(405).json({ error: 'Method not allowed' })
	}

	/**
	 * Build the static props from the POST'ed page configuration data,
	 * which includes the full OpenAPI spec as a string.
	 */
	const { openApiDescription, openApiJsonString, groupOperationsByPath } =
		JSON.parse(req.body) as ExpectedBody

	/**
	 * Construct some preview data just to match the expected `getStaticProps`
	 * signature. The `versionId` and `releaseStage` don't really matter here.
	 */
	const versionData = [
		{
			versionId: 'preview',
			releaseStage: 'preview',
			sourceFile: openApiJsonString,
		},
	]

	/**
	 * Build static props for the page
	 */
	try {
		console.log('Attempting to getStaticProps...')
		const getStaticPropsResult = await getStaticProps({
			// Pass the bulk of the page config
			...GENERIC_PAGE_CONFIG,
			// Pass the constructed version data
			versionData,
			// Pass options
			groupOperationsByPath,
			/**
			 * Massage the schema data a little bit, replacing
			 * "HashiCorp Cloud Platform" in the title with "HCP".
			 */
			massageSchemaForClient: (schemaData: OpenAPIV3.Document) => {
				// Replace the schema description with the POST'ed description, if present
				const withCustomDescription = schemaModDescription(
					schemaData,
					(description) => openApiDescription || description
				)
				// Replace "HashiCorp Cloud Platform" with "HCP" in the title
				const withShortTitle = schemaModShortenHcp(withCustomDescription)
				// Return the schema data with modifications
				return withShortTitle
			},
		})
		const staticProps =
			'props' in getStaticPropsResult ? getStaticPropsResult.props : null
		// Write out the static props to a file in the `tmp` folder
		const uniqueFileId = randomUUID()
		const newTempFile = getTempFilePath(TMP_DIR, uniqueFileId)
		console.log(`Writing file to ${newTempFile}...`)
		fs.writeFileSync(newTempFile, JSON.stringify(staticProps, null, 2))
		console.log(`Wrote out file to ${newTempFile}`)
		// Return the static props as JSON, these can be passed to OpenApiDocsView
		res.status(200).json({ staticProps, uniqueFileId })
	} catch (error) {
		res.status(200).json({ error: error.toString() })
	}
}

/**
 * TODO: clean up once you've actually figured out what you're doing
 */
export function readProps(filePath) {
	if (!fs.existsSync(filePath)) {
		console.log(`File does not exist at ${filePath}. Returning null.`)
		return null
	}
	try {
		const fileString = fs.readFileSync(filePath, 'utf8')
		return JSON.parse(fileString)
	} catch (error) {
		console.error(
			`Error: readProps failed unexpectedly, even though file "${filePath}" exists. Details: ${error}`
		)
		return null
	}
}
