/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import type { OpenApiDocsViewV2Props } from 'views/open-api-docs-view-v2/types'
import staticPropsFromTmpData from './utils/static-props-from-tmp-data'

/**
 * We expect the `HASHI_ENV` environment variable to be set to `production`
 * only if we're actually in production.
 */
const IS_PRODUCTION = process.env.HASHI_ENV === 'production'

/**
 * For reference on Vercel system environment variables, see:
 * https://vercel.com/docs/projects/environment-variables/system-environment-variables
 */
const IS_VERCEL_DEPLOY = process.env.VERCEL_ENV !== 'development'
const BASE_URL = IS_VERCEL_DEPLOY
	? `https://${process.env.VERCEL_URL}`
	: 'http://localhost:3000' // we assume port 3000... maybe a better way?

/**
 * Build server-side props for a revised version of the OpenAPI docs view.
 *
 * This revised version splits each operation into its own URL. We also have
 * an "overview" page when a specific operation isn't being viewed. There are
 * common props between the overview and operation pages, such as the
 * sidebarItemGroups. There are also props specific to each view.
 */
export async function getServerSideProps({
	params,
	req,
}: GetServerSidePropsContext): Promise<
	GetServerSidePropsResult<{
		staticProps: OpenApiDocsViewV2Props | null
		submittedData: $TSFixMe
		hasPreviewProps: boolean
	}>
> {
	/**
	 * In production, return a 404 not found for this page.
	 * In other environments (local, preview, and staging), show the page.
	 */
	if (IS_PRODUCTION) {
		return { notFound: true }
	}
	// Determine which operation we're trying to render, if any
	const operationSlug = params?.page?.length ? params.page[0] : ''

	/**
	 * We store uploaded OpenAPI spec files with a unique file ID. On the initial
	 * load of this page, we expect this cookie to be empty... but once a user
	 * uploads an OpenAPI spec, we expect the unique file ID to be set in their
	 * browser cookies. This allows us to fetch the correct file from the server
	 * on subsequent visits to OpenAPI docs pages, handling page refreshes
	 * and visits to different operation URLs.
	 */
	const uniqueFileId = req.cookies['open-api-docs-preview-v2_unique-file-id']

	/**
	 * Fetch the static props from our API route, which will read in a tmp
	 * file based on the provided `uniqueFileId`. If this file does not
	 * exist, we return `null` (and the user must re-upload an OpenAPI spec).
	 */
	let submittedData: $TSFixMe = null
	let staticProps: OpenApiDocsViewV2Props | null = null
	try {
		const response = await fetch(
			`${BASE_URL}/api/open-api-preview-v2?uniqueFileId=${uniqueFileId}`
		)
		const responseJson = response.status === 200 ? await response.json() : null
		submittedData = responseJson.data
		staticProps = await staticPropsFromTmpData(submittedData, operationSlug)
	} catch (e) {
		console.log(`Ran into error fetching static props: ${e}`)
	}

	// Return, note that `staticProps` may be `null`
	return {
		props: {
			hasPreviewProps: !!staticProps,
			submittedData,
			staticProps,
		},
	}
}
