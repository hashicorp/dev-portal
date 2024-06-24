/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
// Utilities
import { getStaticProps } from 'views/open-api-docs-view-v2/server'
import {
	schemaModComponent,
	schemaModDescription,
	schemaModShortenHcp,
	shortenProtobufAnyDescription,
} from 'views/open-api-docs-view/utils/massage-schema-utils'
// Types
import type { NextApiRequest, NextApiResponse } from 'next'
import type { OpenAPIV3 } from 'openapi-types'
import type { ProductSlug } from 'types/products'

/**
 * Setup for temporary file storage
 */
// Determine if we're deploying to Vercel, this affects the temporary directory
const IS_VERCEL_DEPLOY = process.env.VERCEL_ENV !== 'development'
// Determine the temporary directory to use, based on Vercel deploy or not
const TMP_DIR = IS_VERCEL_DEPLOY ? '/tmp' : path.join(process.cwd(), '.tmp')
// Ensure the temporary directory exists, so we can stash files
if (!fs.existsSync(TMP_DIR)) {
	fs.mkdirSync(TMP_DIR)
}
// Set the maximum age for a file in the temporary directory
const MAX_FILE_AGE_HOURS = 1
const MAX_FILE_AGE_MS = 1000 * 60 * 60 * MAX_FILE_AGE_HOURS

/**
 * This API route is meant to be used in conjunction with the OpenAPI preview
 * tool, which allows authors to preview OpenAPI specs in a multi-page format.
 * The preview tool is _not_ deployed in production, and is meant to be
 * accessed from: https://develop.hashicorp.services/open-api-docs-preview-v2
 *
 * This API route:
 * - Allows `POST` requests with OpenAPI specs and related configuration data.
 *   The provided data is transformed into static props for `OpenApiDocsView`,
 *   and then written out to a temporary file. The unique file ID is returned.
 *   The unique file ID can be used in subsequent requests to retrieve props.
 * - Allows `GET` requests with a unique file ID. These requests allow pages
 *   to retrieve previously stored static props, which can be used to render
 *   a multi-page preview of the OpenAPI documentation.
 *
 * TODO: could support DELETE requests, to delete a specific file.
 * This could allow authors working with sensitive data to have more
 * immediate reassurance (on top of the unique file ID) that their file
 * will not be randomly accessible to the public.
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		return handlePost(req, res)
	} else if (req.method === 'GET') {
		return handleGet(req, res)
	} else {
		res.setHeader('Allow', ['POST', 'GET'])
		res.status(405).json({ error: 'Method not allowed' })
	}
}

/**
 * Boilerplate page configuration.
 *
 * We could in theory expose this so visitors to the preview tool could edit it,
 * but we intentionally hard-code it here instead, in order to keep the focus
 * of the preview tool on OpenAPI spec contents.
 */
const GENERIC_PAGE_CONFIG = {
	// basePath is the same no matter what, preview tool is on static route
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
}

/**
 * Handle POST requests
 *
 * This function is responsible for:
 * - Parsing the POST'ed data
 * - Building static props for the page
 * - Writing the static props to a temporary file
 * - Returning the unique file ID to the client
 */
async function handlePost(req, res) {
	/**
	 * Build the static props from the POST'ed page configuration data,
	 * which includes the full OpenAPI spec as a string.
	 */
	const { openApiDescription, openApiJsonString } = JSON.parse(
		req.body
	) as ExpectedBody

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
				// Short protobufAny descriptions
				const withShortProtobufAny = schemaModComponent(
					withShortTitle,
					'protobufAny',
					shortenProtobufAnyDescription
				)
				// Return the schema data with modifications
				return withShortProtobufAny
			},
		})
		if (!('props' in getStaticPropsResult)) {
			throw new Error('getStaticProps did not return props.')
		}
		const staticProps = getStaticPropsResult.props
		// Write out the static props to a new file in the `tmp` folder
		const timestamp = Date.now()
		const uniqueFileId = `ts${timestamp}_${randomUUID()}`
		const newTempFile = getTempFilePath(TMP_DIR, uniqueFileId)
		fs.writeFileSync(newTempFile, JSON.stringify(staticProps, null, 2))
		/**
		 * Return the uniqueFileId. We expect the client to store this in a cookie,
		 * such that it can be retrieved in subsequent requests in
		 * `getServerSideProps`, and in turn `getServerSideProps` will make a GET
		 * request to this API route in order to retrieve the props we've just
		 * saved.
		 */
		res.status(200).json({ staticProps, uniqueFileId })
	} catch (error) {
		res.status(200).json({ error: error.toString() })
	}
}

/**
 * Handle GET requests, attempting to read stored props from `/tmp`.
 *
 * We also delete old files in the temporary directory on every request
 * received to this endpoint, to ensure files don't hang around any longer
 * than they need to for author previewing purposes.
 */
async function handleGet(req, res) {
	// Delete old files in the temporary directory, to keep it clean.
	deleteOldFiles(TMP_DIR, MAX_FILE_AGE_MS)
	/**
	 * Extract a unique file ID from the request query, if possible.
	 * This allows multiple authors to work with different files, and provides
	 * some level of protection against random public access of these files
	 * (not guaranteed, but better than nothing).
	 */
	const uniqueFileId = req.query.uniqueFileId as string | undefined
	// We require a unique file ID in order to read a previously stored file
	if (!uniqueFileId) {
		res.status(404).json({ error: 'No unique file ID provided.' })
		return
	}
	// If we have a unique file ID, attempt to read the props from the file
	const tempFile = getTempFilePath(TMP_DIR, uniqueFileId)
	// If the file doesn't exist, we can return early with that info
	if (!fs.existsSync(tempFile)) {
		res.status(404).json({ error: `File not found at "${tempFile}".` })
		return
	}
	// Otherwise, attempt to read the file
	const [err, staticProps] = readJsonFile(tempFile)
	// If we failed to read props, return an error
	if (err !== null) {
		res.status(500).json({ error: `Failed to read JSON file "${tempFile}".` })
		return
	}
	// Otherwise, we have successfully read in props, return them
	res.status(200).json({ staticProps, uniqueFileId })
	return
}

/**
 * Given the path to a directory,
 * read in the filenames of all files in that directory.
 *
 * If the filename contains the pattern `ts(\d+)_`, then parse the digits
 * as a timestamp, representing the milliseconds since the Unix epoch.
 * If the file is older than the provided maxAgeMs, delete the file.
 */
function deleteOldFiles(directoryPath: string, maxAgeMs: number) {
	const files = fs.readdirSync(directoryPath)
	files.forEach((file) => {
		const match = file.match(/ts(\d+)_/)
		if (match === null) {
			return
		}
		const timestamp = parseInt(match[1], 10)
		const fileAgeMs = Date.now() - timestamp
		if (fileAgeMs > maxAgeMs) {
			console.log(`Deleting old file: ${file}`)
			fs.unlinkSync(`${directoryPath}/${file}`)
		}
	})
}

/**
 * Given a file path to a JSON file, attempt to read in the file.
 * If successful, return [null, data], where `data` is the parsed JSON.
 * Otherwise, return [err, null], where `err` describes the failure.
 */
function readJsonFile(filePath): [string, null] | [null, any] {
	try {
		const fileString = fs.readFileSync(filePath, 'utf8')
		return [null, JSON.parse(fileString)]
	} catch (error) {
		return [
			`Error: readJsonFile on "${filePath}" failed. Details: ${error.toString()}`,
			null,
		]
	}
}

/**
 * Given a temporary directory and a unique file ID, return a standard file path
 */
function getTempFilePath(tempDir, uniqueFileId) {
	return `${tempDir}/open-api-docs-view-props_${uniqueFileId}.json`
}
