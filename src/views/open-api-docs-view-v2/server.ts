/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Utils
import { cachedGetProductData } from 'lib/get-product-data'
import { fetchCloudApiVersionData } from 'lib/api-docs'
import { getVersionSwitcherProps } from 'views/open-api-docs-view/utils'
import { isDeployPreview } from 'lib/env-checks'
import { parseAndValidateOpenApiSchema } from 'lib/api-docs/parse-and-validate-open-api-schema'
import { serialize } from 'lib/next-mdx-remote/serialize'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import fetchGithubFile from 'lib/fetch-github-file'
import isAbsoluteUrl from 'lib/is-absolute-url'
// Utils, local
import { findDefaultVersion } from './utils/find-default-version'
import getOperationContentProps from './components/operation-content/server'
import {
	getOperationObjects,
	OperationObject,
} from './utils/get-operation-objects'
import { groupItemsByKey } from './utils/group-items-by-key'
import { slugifyOperationId } from './utils/slugify-operation-id'
import { wordBreakCamelCase } from './utils/word-break-camel-case'
import { parseOpenApiV2UrlContext } from './utils/parse-open-api-v2-url-context'
// Types
import type { ApiDocsVersionData } from 'lib/api-docs/types'
import type { BreadcrumbLink } from '@components/breadcrumb-bar'
import type { GetStaticPaths } from 'next'
import type { GithubDir } from 'lib/fetch-github-file-tree'
import type {
	ApiDocsUrlContext,
	OpenApiDocsV2Params,
	OpenApiDocsViewV2Config,
	OpenApiDocsViewV2Props,
	SharedProps,
} from 'views/open-api-docs-view-v2/types'
import type { OpenAPIV3 } from 'openapi-types'

/**
 * Generate static paths for an OpenAPI docs view.
 */
export async function generateStaticPaths({
	schemaSource,
	schemaTransforms = [],
	transformVersionData = (versionData) => versionData,
}: {
	schemaSource: ApiDocsVersionData[] | GithubDir
	schemaTransforms?: ((schema: OpenAPIV3.Document) => OpenAPIV3.Document)[]
	transformVersionData?: (
		versionData: ApiDocsVersionData[]
	) => ApiDocsVersionData[]
}): Promise<ReturnType<GetStaticPaths<OpenApiDocsV2Params>>> {
	// If we are in a product repo deploy preview, don't pre-render any paths
	if (isDeployPreview()) {
		return { paths: [], fallback: 'blocking' }
	}
	/**
	 * If we're in production, statically render the non-versioned landing view,
	 * as well as the non-versioned operation views.
	 *
	 * We use `fallback: blocking` for versioned views. We could in theory
	 * statically render all pages across all versions, but this would increase
	 * our build times.
	 *
	 * We fetch and parse the default version of the OpenAPI schema to figure
	 * out which operation slugs to statically render. Note the "default version"
	 * is the latest stable version, or if there are no stable versions,
	 * then the latest version regardless of release stage.
	 */
	// Fetch version data
	const rawVersionData = Array.isArray(schemaSource)
		? schemaSource
		: await fetchCloudApiVersionData(schemaSource)
	const versionData = transformVersionData(rawVersionData)
	// Determine the default version
	const defaultVersion = findDefaultVersion(versionData)
	// Parse the default version
	const schemaFileString =
		typeof defaultVersion.sourceFile === 'string'
			? defaultVersion.sourceFile
			: await fetchGithubFile(defaultVersion.sourceFile)
	const schemaData = await parseAndValidateOpenApiSchema(
		schemaFileString,
		schemaTransforms
	)
	// Extract operation objects, and map to slugs
	const operationObjects = getOperationObjects(schemaData)
	const operationSlugs = operationObjects.map((operation) => {
		return slugifyOperationId(operation.operationId)
	})
	// Generate path objects for each operation slug
	const pathObjects = operationSlugs.map((operationSlug) => {
		return { params: { page: [operationSlug] } }
	})
	// Return paths
	return {
		paths: [{ params: { page: [] } }, ...pathObjects],
		fallback: 'blocking',
	}
}

/**
 * Wrapper around `generateStaticProps` that handles the common production
 * use case of fetching version data from GitHub.
 */
export async function generateStaticPropsVersioned(
	pageConfig: OpenApiDocsViewV2Config,
	params: string[] | never
): Promise<{ props: OpenApiDocsViewV2Props } | { notFound: true }> {
	// Fetch version data
	const rawVersionData = Array.isArray(pageConfig.schemaSource)
		? pageConfig.schemaSource
		: await fetchCloudApiVersionData(pageConfig.schemaSource)
	const versionData =
		typeof pageConfig.transformVersionData === 'function'
			? pageConfig.transformVersionData(rawVersionData)
			: rawVersionData
	// Parse the URL context, to determine the version and operationSlug.
	const urlContext = parseOpenApiV2UrlContext(params)
	// Return static props, or may return `{ notFound: true }`.
	return await generateStaticProps({
		...pageConfig,
		versionData,
		urlContext,
	})
}

/**
 * Build static props for an OpenAPI docs view.
 *
 * There are two main views:
 * - Landing view, for the basePath, when no operationSlug is provided
 * - Operation view, for the specific operationSlug that's been provided
 *
 * This function expects `versionData`, an array of objects. This accommodates
 * both the HCP-centric use case, where we fetch `versionData` from GitHub,
 * with each `versionData` entry referencing a `GithubFile` as its `sourceFile`,
 * as well as the more general use case, where `versionData` can be an array
 * with a single object, with the entry passing the schema file string
 * directly as the `sourceFile`.
 */
export async function generateStaticProps({
	backToLink,
	basePath,
	breadcrumbLinksPrefix = [],
	getOperationGroupKey = (o: OperationObject) =>
		(o.tags.length && o.tags[0]) ?? 'Other',
	resourceLinks = [],
	statusIndicatorConfig,
	schemaTransforms,
	productContext,
	theme = productContext,
	versionData,
	urlContext: { isVersionedUrl, versionId, operationSlug },
}: Omit<OpenApiDocsViewV2Config, 'schemaSource'> & {
	/**
	 * Data for all versions of target OpenAPI schema, include the release
	 * stage of each version, the source file, and the version ID.
	 */
	versionData: ApiDocsVersionData[]
	/**
	 * The URL context in which we're fetching static props. This affects:
	 * - versioning, as the target versionId is determined by the URL
	 * - operation vs landing page, as an operationSlug may be present in the URL
	 */
	urlContext: ApiDocsUrlContext
}): Promise<{ props: OpenApiDocsViewV2Props } | { notFound: true }> {
	/**
	 * Parse the version to render, or 404 if a non-existent version is requested.
	 */
	const defaultVersion = findDefaultVersion(versionData)
	// Resolve the current version
	let targetVersion: ApiDocsVersionData | undefined
	if (isVersionedUrl) {
		targetVersion = versionData.find((v) => v.versionId === versionId)
	} else {
		targetVersion = defaultVersion
	}
	// If we can't resolve the current version, render a 404 page
	if (!targetVersion) {
		return { notFound: true }
	}

	/**
	 * Fetch the OpenAPI schema string for this version.
	 */
	const { sourceFile } = targetVersion
	const schemaFileString =
		typeof sourceFile === 'string'
			? sourceFile
			: await fetchGithubFile(sourceFile)

	/**
	 * Fetch, parse, and validate the OpenAPI schema for this version.
	 * Also apply any schema transforms.
	 */
	const schemaData = await parseAndValidateOpenApiSchema(
		schemaFileString,
		schemaTransforms
	)

	/**
	 * Build version selector and version alert props
	 */
	const versionSwitcherProps = getVersionSwitcherProps({
		projectName: schemaData.info.title,
		versionData,
		targetVersion,
		defaultVersion,
		basePath,
	})

	/**
	 * Grab product data for this context
	 */
	const productData = cachedGetProductData(productContext)

	/**
	 * Determine if we're on a specific operation page or not
	 */
	const operationObjects = getOperationObjects(schemaData)
	// If we're on a specific operation page, grab the target operation
	let targetOperation: OperationObject | undefined
	if (operationSlug) {
		targetOperation = operationObjects.find(
			(operation) => slugifyOperationId(operation.operationId) === operationSlug
		)
	}
	// If we have an operationSlug, but no target operation, return a 404
	if (typeof operationSlug === 'string' && !targetOperation) {
		return {
			notFound: true,
		}
	}
	const targetOperationSlug = targetOperation
		? slugifyOperationId(targetOperation.operationId)
		: null

	/**
	 * Build links for the sidebar.
	 */
	const operationGroups = groupItemsByKey(
		operationObjects,
		getOperationGroupKey
	)
	const landingUrl = isVersionedUrl ? `${basePath}/${versionId}` : basePath
	const landingLink = {
		theme,
		text: schemaData.info.title,
		href: landingUrl,
		isActive: !operationSlug,
	}
	const operationLinkGroups = operationGroups.map((group) => ({
		// Note: we word break to avoid long strings breaking the sidebar layout
		text: wordBreakCamelCase(group.key),
		items: group.items.map(({ operationId }) => {
			const operationSlug = slugifyOperationId(operationId)
			const operationUrl = isVersionedUrl
				? `${basePath}/${versionId}/${operationSlug}`
				: `${basePath}/${operationSlug}`
			return {
				text: wordBreakCamelCase(operationId),
				href: operationUrl,
				isActive: operationSlug === targetOperationSlug,
			}
		}),
	}))

	/**
	 * Build breadcrumb links
	 */
	const breadcrumbLinks: BreadcrumbLink[] = [...breadcrumbLinksPrefix]
	// Push a link for the root of these docs
	breadcrumbLinks.push({
		title: schemaData.info.title,
		url: basePath,
	})
	// If we have a versioned URL, push a link for the specific version
	if (isVersionedUrl) {
		breadcrumbLinks.push({
			title: versionId,
			url: `${basePath}/${versionId}`,
		})
	}
	// If we're on a specific operation page, add a breadcrumb link accordingly
	if (targetOperation) {
		breadcrumbLinks.push({
			title: targetOperation.operationId,
			url: [basePath, operationSlug].filter(Boolean).join('/'),
		})
	}
	// Mark the last breadcrumb link as the current page
	breadcrumbLinks[breadcrumbLinks.length - 1].isCurrentPage = true

	/**
	 * Gather props shared between the landing and individual operation views.
	 */
	const sharedProps: SharedProps = {
		basePath,
		backToLink,
		breadcrumbLinks,
		landingLink,
		operationLinkGroups,
		product: productData,
		versionMetadata: {
			isVersionedUrl,
			currentVersion: {
				versionId: targetVersion.versionId,
				releaseStage: targetVersion.releaseStage,
			},
			latestStableVersion: {
				versionId: defaultVersion.versionId,
			},
		},
		versionSwitcherProps,
		resourceLinks: resourceLinks.map((item) => {
			return { ...item, isExternal: isAbsoluteUrl(item.href) }
		}),
	}

	/**
	 * If we have an operation slug, build and return operation view props.
	 * Otherwise, assume a landing view, and build and return landing view props.
	 */
	if (targetOperation) {
		const operationContentProps = await getOperationContentProps(
			targetOperation,
			schemaData
		)
		return {
			props: stripUndefinedProperties({
				...sharedProps,
				metadata: {
					title: `${targetOperation.operationId} | ${schemaData.info.title}`,
				},
				operationContentProps,
			}),
		}
	} else {
		const landingProps = {
			heading: schemaData.info.title,
			badgeText: targetVersion.releaseStage,
			serviceProductSlug: theme,
			statusIndicatorConfig,
			descriptionMdx: await serialize(schemaData.info.description),
			schemaFileString: schemaFileString,
		}
		return {
			props: stripUndefinedProperties({
				...sharedProps,
				metadata: {
					title: schemaData.info.title,
				},
				landingProps,
			}),
		}
	}
}
