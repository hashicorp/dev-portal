/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Utilities
import getPropsFromPreviewData from './utils/get-props-from-preview-data'
// Constants
import { COOKIE_ID, API_ROUTE, DYNAMIC_PARAM } from './constants'
// Types
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import type { OpenApiDocsViewV2Props } from 'views/open-api-docs-view-v2/types'
import type { OpenApiPreviewV2InputValues } from './components/open-api-preview-inputs'
import { OpenApiDocsPreviewV2Props } from '.'

/**
 * We expect the `HASHI_ENV` environment variable to be set to `production`
 * only if we're actually in production.
 */
const IS_PRODUCTION = process.env.VERCEL_ENV === 'production'

/**
 * For reference on Vercel system environment variables, see:
 * https://vercel.com/docs/projects/environment-variables/system-environment-variables
 *
 * Note: we assume port 3000 for local development... there may be edge cases
 * where NextJS decides to start on a different port (eg if 3000 is in use),
 * but I couldn't find a way to detect that, and for now, this seems sufficient.
 */
const IS_VERCEL_DEPLOY = process.env.VERCEL_ENV !== 'development'
const BASE_URL = IS_VERCEL_DEPLOY
	? `https://${process.env.VERCEL_URL}`
	: 'http://localhost:3000'

/**
 * Get server side props for an OpenAPIDocsPreviewV2 view.
 *
 * On initial load, we expect the `uniqueFileId` cookie to be empty, and we'll
 * return `null` for both `previewData` and `staticProps`.
 *
 * We expect the user to upload some preview data to an API route. The preview
 * data is given a unique ID and stored in a temporary file, and the unique ID
 * is returned to the client and stored in a cookie.
 *
 * On subsequent loads, we expect the `uniqueFileId` cookie to be set. We use
 * this ID to retrieve preview data from the aforementioned API route. After
 * retrieving the preview data, we transform it into props we can use to render
 * a view component, and we return those props.
 */
export async function getServerSideProps({
	params,
	req,
}: GetServerSidePropsContext): Promise<
	GetServerSidePropsResult<OpenApiDocsPreviewV2Props>
> {
	/**
	 * In production, return a 404 not found for this page.
	 * In other environments (local, preview, and staging), show the page.
	 */
	if (IS_PRODUCTION) {
		return { notFound: true }
	}
	// Determine which specific operation we're trying to render, if any
	const dynamicParams = params?.[DYNAMIC_PARAM]
	const operationSlug = dynamicParams?.length ? dynamicParams[0] : null

	// Try to grab the unique ID from the cookie
	const uniqueFileId = req.cookies[COOKIE_ID]

	/**
	 * Fetch the static props from our API route, which will read in a tmp
	 * file based on the provided `uniqueFileId`. If this file does not
	 * exist, we return `null` (and the user must re-upload their preview data).
	 */
	let previewData: OpenApiPreviewV2InputValues = null
	let staticProps: OpenApiDocsViewV2Props | null = null
	try {
		const response = await fetch(
			`${BASE_URL}${API_ROUTE}?uniqueFileId=${uniqueFileId}`
		)
		previewData = response.status === 200 ? await response.json() : null
		staticProps = await getPropsFromPreviewData(previewData, operationSlug)
	} catch (e) {
		console.log(`Ran into error fetching server-side props: ${e}`)
	}

	/**
	 * Return data. Note that both `staticProps` and `previewData` may be `null`,
	 * such as on initial loads of this page, when no `uniqueId` cookie is set.
	 */
	return {
		props: {
			hasStaticProps: !!staticProps,
			previewData,
			staticProps,
		},
	}
}
