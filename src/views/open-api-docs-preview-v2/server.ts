/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Utils
import { readProps, TMP_PROPS_FILE } from 'pages/api/open-api-preview-v2'
// Types
import type { GetServerSidePropsResult } from 'next'
import type { OpenApiDocsViewProps } from 'views/open-api-docs-view-v2/types'

const IS_PRODUCTION = process.env.HASHI_ENV === 'production'
const BASE_URL = process.env.VERCEL_URL

/**
 * TODO: add description
 */
export async function getServerSideProps({ params }): Promise<
	GetServerSidePropsResult<{
		staticProps: OpenApiDocsViewProps | null
		operationSlug: string
	}>
> {
	// In production, return a 404 not found for this page.
	if (IS_PRODUCTION) {
		return { notFound: true }
	}
	// Fetch the static props from our API route, which will read in a tmp
	// file if it exists, or return null if it does not.
	const response = await fetch(`${BASE_URL}/api/open-api-preview-v2`)
	const rawStaticProps = response.status === 200 ? await response.json() : null
	const staticProps = rawStaticProps ? rawStaticProps.props : null
	// In other environments (local, preview, and staging), show the page.
	// Note that `staticProps` may be `null`, if the user has not yet provided
	// an OpenAPI spec file to preview
	const operationSlug = params?.page?.length ? params.page[0] : ''
	return { props: { staticProps, operationSlug } }
}
