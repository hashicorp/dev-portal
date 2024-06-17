/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { GetServerSidePropsResult } from 'next'
import type { OpenApiDocsViewProps } from 'views/open-api-docs-view-v2/types'

const IS_PRODUCTION = process.env.HASHI_ENV === 'production'
const IS_VERCEL_DEPLOY = process.env.VERCEL_ENV !== 'development'
const BASE_URL = IS_VERCEL_DEPLOY
	? `https://${process.env.VERCEL_URL}`
	: 'http://localhost:3000'

/**
 * TODO: add description
 */
export async function getServerSideProps({ params }): Promise<
	GetServerSidePropsResult<{
		staticProps: OpenApiDocsViewProps | null
		operationSlug: string
		sidebarItemGroups?: $TSFixMe
	}>
> {
	// In production, return a 404 not found for this page.
	// In other environments (local, preview, and staging), show the page.
	// if (IS_PRODUCTION) {
	// 	return { notFound: true }
	// }
	// Determine which operation we're trying to render, if any
	const operationSlug = params?.page?.length ? params.page[0] : ''
	// Fetch the static props from our API route, which will read in a tmp
	// file if it exists, or return null if it does not.
	let staticProps: OpenApiDocsViewProps | null = null
	try {
		const response = await fetch(`${BASE_URL}/api/open-api-preview-v2`)
		const rawStaticProps =
			response.status === 200 ? await response.json() : null
		staticProps = rawStaticProps ? rawStaticProps.props : null
	} catch (e) {
		console.log(`Ran into error fetching static props: ${e}`)
	}

	// If we didn't manage to fetch static props, return early
	if (!staticProps) {
		return { props: { staticProps: null, operationSlug } }
	}

	// Otherwise, we have static props, so we can process them
	const { operationGroups } = staticProps
	const sidebarItemGroups =
		operationGroups?.map((group) => {
			const items = group.items.map((item) => {
				return {
					title: item.slug,
					url: `/open-api-docs-preview-v2/${item.operationId}`,
				}
			})
			return {
				title: group.heading,
				items,
			}
		}) || []
	// Note that `staticProps` may be `null`, if the user has not yet provided
	// an OpenAPI spec file to preview
	return { props: { staticProps, operationSlug, sidebarItemGroups } }
}
