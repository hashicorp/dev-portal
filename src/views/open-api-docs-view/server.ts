/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Library
import fetchGithubFile from 'lib/fetch-github-file'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { cachedGetProductData } from 'lib/get-product-data'
// Utilities
import {
	findLatestStableVersion,
	getNavItems,
	getOperationProps,
	groupOperations,
	parseAndValidateOpenApiSchema,
} from './utils'
// Types
import type {
	GetStaticPaths,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next'
// Utilities

// Types
import type { ProductSlug } from 'types/products'
import type {
	OpenApiDocsParams,
	OpenApiDocsViewProps,
	OpenApiDocsVersionData,
} from './types'

/**
 * Get static paths for the view.
 *
 * Initially, without versioning, we expect a single page. We use
 * `getStaticPaths` for flag-based compatibility with the previous template.
 *
 * Later, when we implement versioned API docs for the new template,
 * we'll likely need to retain `getStaticPaths`, using separate paths
 * for each version of the OpenAPI documents that we detect.
 */
export const getStaticPaths: GetStaticPaths<OpenApiDocsParams> = async () => {
	// For the new template, regardless of whether we're in a deploy preview
	// or production, statically render the single view.
	return {
		paths: [{ params: { page: [] } }],
		fallback: false,
	}
}

/**
 * Get static props for the view.
 *
 * This is where we expect to fetch the OpenAPI document, and transform
 * the schema `.json` data into props for the view component.
 *
 * For now, we have a placeholder. We'll expand this as we build out the view.
 */
export async function getStaticProps({
	context,
	productSlug,
	versionData,
	basePath,
}: {
	context: GetStaticPropsContext<OpenApiDocsParams>
	productSlug: ProductSlug
	versionData: OpenApiDocsVersionData[]
	basePath: string
}): Promise<GetStaticPropsResult<OpenApiDocsViewProps>> {
	// Get the product data
	const productData = cachedGetProductData(productSlug)

	/**
	 * Parse the version to render, or 404 if a non-existent version is requested.
	 */
	const pathParts = context.params?.page
	const versionId = pathParts?.length > 1 ? pathParts[0] : null
	const isVersionedUrl = typeof versionId === 'string'
	const latestStableVersion = findLatestStableVersion(versionData)
	// Resolve the current version
	let targetVersion: OpenApiDocsVersionData | undefined
	if (isVersionedUrl) {
		targetVersion = versionData.find((v) => v.versionId === versionId)
	} else {
		targetVersion = latestStableVersion
	}
	// If we can't resolve the current version, render a 404 page
	if (!targetVersion) {
		return { notFound: true }
	}

	/**
	 * Fetch, parse, and validate the OpenAPI schema for this version.
	 */
	const { sourceFile } = targetVersion
	const schemaFileString =
		typeof sourceFile === 'string'
			? sourceFile
			: await fetchGithubFile(sourceFile)
	const schemaData = await parseAndValidateOpenApiSchema(schemaFileString)
	const { title } = schemaData.info
	const operationProps = await getOperationProps(schemaData)
	const operationGroups = groupOperations(operationProps)
	const navItems = getNavItems({
		operationGroups,
		basePath,
		title,
		productSlug: productData.slug,
	})

	/**
	 * Build breadcrumb links for the page
	 *
	 * TODO: potentially split this to a separate function?
	 * Might be nice to have a centralized place where we codify the `title`
	 * and `url` for each possible URL segment.
	 *
	 * We'd have a URL segment name lookup dictionary:
	 * const URL_SEGMENT_NAMES = {
	 *   '/': 'Developer',
	 *   '/hcp': 'HashiCorp Cloud Platform',
	 *   '/hcp/api-docs': 'API',
	 * }
	 *
	 * As well as a list of URL segments that should not be linked:
	 * const UNLINKED_URL_SEGMENTS = [
	 *   '/hcp/api-docs'
	 * ]
	 *
	 * On top of this, there's a process for docs pages where we look up
	 * the `title` for a given URL segment using the corresponding `navData`.
	 * One challenge would be how to merge these two approaches - maybe for docs,
	 * we'd split the URL segment, generating higher-level breadcrumb links
	 * using the approach described above, and generating the docs-specific
	 * breadcrumb links using the `navData` approach.
	 */
	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: 'HashiCorp Cloud Platform', url: '/hcp' },
		{ title: 'API' }, // Note: no URL here, as we don't yet have a page
		{
			title: 'Vault Secrets',
			url: '/hcp/api-docs/vault-secrets',
			isCurrentPage: true,
		},
	]

	/**
	 * Return props
	 */
	return {
		props: {
			productData,
			title: schemaData.info.title,
			releaseStage: targetVersion.releaseStage,
			description: schemaData.info.description,
			IS_REVISED_TEMPLATE: true,
			_placeholder: {
				productSlug,
				targetVersion,
				schemaData,
			},
			operationGroups: stripUndefinedProperties(operationGroups),
			navItems,
			breadcrumbLinks,
		},
	}
}
