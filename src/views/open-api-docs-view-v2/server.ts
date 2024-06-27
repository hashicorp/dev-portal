/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Library
import fetchGithubFile from 'lib/fetch-github-file'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { cachedGetProductData } from 'lib/get-product-data'
import { serialize } from 'lib/next-mdx-remote/serialize'
// Utilities
import {
	getNavItems,
	getOperationProps,
	groupOperations,
	parseAndValidateOpenApiSchema,
	getVersionSwitcherProps,
} from 'views/open-api-docs-view/utils'
import parseVersionData from './utils/parse-version-data'
// Types
import type { BreadcrumbLink } from '@components/breadcrumb-bar'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { OpenAPIV3 } from 'openapi-types'
import type { ApiDocsVersionData } from 'lib/api-docs/types'
import type {
	OpenApiDocsParams,
	OpenApiDocsViewV2Props,
	OpenApiDocsV2PageConfig,
} from './types'

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
	serviceProductSlug = productSlug,
	versionData,
	basePath,
	operationSlug,
	statusIndicatorConfig = null, // must be JSON-serializable
	topOfPageId = 'overview',
	groupOperationsByPath = false,
	massageSchemaForClient = (s: OpenAPIV3.Document) => s,
	navResourceItems = [],
}: Omit<OpenApiDocsV2PageConfig, 'githubSourceDirectory'> & {
	operationSlug: string | null
	context: GetStaticPropsContext<OpenApiDocsParams>
	versionData: ApiDocsVersionData[]
}): Promise<GetStaticPropsResult<OpenApiDocsViewV2Props>> {
	// Get the product data
	const productData = cachedGetProductData(productSlug)

	// Parse the version to render, or 404 if a non-existent version is requested
	const { isVersionedUrl, defaultVersion, targetVersion } = parseVersionData(
		context.params?.page || [],
		versionData
	)
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
	const schemaData = await parseAndValidateOpenApiSchema(
		schemaFileString,
		massageSchemaForClient
	)
	const operationProps = await getOperationProps(schemaData)
	const operationGroups = groupOperations(operationProps, groupOperationsByPath)
	const navItems = getNavItems({
		operationGroups,
		topOfPageId,
		title: schemaData.info.title,
		productSlug: productData.slug,
	})

	/**
	 * Serialize description MDX for rendering in our DevDotContent component.
	 */
	const descriptionMdx = await serialize(schemaData.info.description)

	/**
	 * Build breadcrumb links for the page, and activate the final breadcrumb.
	 *
	 * @TODO: we have a task to remove the need for `isCurrentPage`:
	 * https://app.asana.com/0/1202097197789424/1202354347457831/f
	 */
	// Breadcrumb links
	const breadcrumbLinks: BreadcrumbLink[] = [
		{
			title: schemaData.info.title + ' API',
			url: '/open-api-docs-preview-v2',
		},
	]
	if (operationSlug) {
		breadcrumbLinks.push({
			title: operationSlug,
			url: `/open-api-docs-preview-v2/${operationSlug}`,
		})
	}
	// Activate the last breadcrumb link
	breadcrumbLinks[breadcrumbLinks.length - 1].isCurrentPage = true

	/**
	 * First we set up `sidebarItemGroups`, which are used to render the sidebar.
	 * These props are needed on the overview page, as well as on each individual
	 * operation page.
	 */
	const sidebarItemGroups =
		operationGroups?.map((group) => {
			const items = group.items.map((item) => {
				const slugWithWordBreaks = item.slug.replace(
					/([a-z])([A-Z])/g,
					'$1\u200B$2'
				)
				return {
					title: slugWithWordBreaks,
					url: `/open-api-docs-preview-v2/${item.operationId}`,
				}
			})
			return {
				title: group.heading,
				items,
			}
		}) || []

	/**
	 * If we have an operationSlug, try to get the associated operationProps
	 */
	let targetOperationProps = null
	if (operationSlug) {
		const allOperations = operationGroups.flatMap((g) => g.items)
		targetOperationProps = allOperations.find(
			(item) => item.operationId === operationSlug
		)
	}

	/**
	 * Return props
	 */
	return {
		props: {
			metadata: {
				// TODO: should vary based on current operation
				title: schemaData.info.title + ' API',
			},
			productData,
			serviceProductSlug,
			topOfPageHeading: {
				text: schemaData.info.title + ' API',
				id: topOfPageId,
			},
			releaseStage: targetVersion.releaseStage,
			descriptionMdx,
			isVersionedUrl,
			versionSwitcherProps: getVersionSwitcherProps({
				projectName: schemaData.info.title,
				versionData,
				targetVersion,
				defaultVersion,
				basePath,
			}),
			operationGroups: stripUndefinedProperties(operationGroups),
			navItems,
			navResourceItems,
			breadcrumbLinks,
			statusIndicatorConfig,
			// new WIP stuff below
			operationProps: targetOperationProps,
			sidebarItemGroups,
		},
	}
}
