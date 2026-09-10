/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import env from 'env-var'
import { GetStaticPropsResult } from 'next'
import OpenApiDocsPreviewView from 'views/open-api-docs-preview'

const HASHI_ENV = env.get('HASHI_ENV').asString()
const IS_PRODUCTION = HASHI_ENV === 'production'

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

export default OpenApiDocsPreviewView
