/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPropsResult } from 'next'
import OpenApiDocsPreviewViewV2 from 'views/open-api-docs-preview-v2'

const IS_PRODUCTION = process.env.HASHI_ENV === 'production'

/**
 * We don't actually need static props for this page,
 * we use `getStaticProps` here to prevent the page from being rendered
 * in production.
 */
export async function getStaticProps(): Promise<
	GetStaticPropsResult<Record<string, never>>
> {
	/**
	 * In production, return a 404 not found for this page.
	 * In other environments (local, preview, and staging), show the page.
	 */
	return IS_PRODUCTION ? { notFound: true } : { props: {} }
}

export default OpenApiDocsPreviewViewV2
