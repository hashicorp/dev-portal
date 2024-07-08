/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Libraries
import { sentenceCase } from 'change-case'
// Local
import { findLatestStableVersion } from 'lib/api-docs'
import {
	buildApiDocsBreadcrumbs,
	buildSchemaProps,
	buildSidebarNavDataLevels,
	buildVersionSwitcherData,
	parseApiDocsVersionIdServiceId,
} from './utils'
// Types
import type { GetStaticPropsResult } from 'next'
import type { ApiDocsVersionData } from 'lib/api-docs/types'
import type { ApiDocsServiceData, ApiDocsViewProps } from '../../types'
import type { ProductData, ProductSlug } from 'types/products'
import type { BreadcrumbLink } from 'components/breadcrumb-bar'
import { cachedGetProductData } from 'lib/get-product-data'

/**
 * Gets static props for versioned API docs views.
 *
 * If the current version of the API docs can't be resolved,
 * this function returns `false`.
 *
 * Note: this function does _not_ handle loading OpenAPI `.json` spec files
 * from local content repo previews, as used for Boundary API docs.
 * In the future, if we're at the latest version URL and `isDeployPreview`
 * from `lib/env-checks` return `true`, we could load the schema a local
 * file instead in order to better support content repo previews.
 */
export async function getApiDocsStaticProps({
	productSlug,
	baseUrl,
	pathParts,
	versionData,
	buildCustomBreadcrumbs,
}: {
	productSlug: ProductSlug
	baseUrl: string
	pathParts: string[]
	versionData: ApiDocsVersionData[]
	/**
	 * Optional. Override the default method for building breadcrumbs.
	 * Used by HCP Packer docs, as they're located within the HCP `/api-docs`,
	 * and the HCP `/api-docs` route is not a linkable breadcrumb.
	 */
	buildCustomBreadcrumbs?: ({
		serviceData,
		productData,
		versionId,
	}: {
		serviceData: ApiDocsServiceData
		productData: ProductData
		versionId?: string
	}) => BreadcrumbLink[]
}): Promise<GetStaticPropsResult<ApiDocsViewProps>> {
	/**
	 * Parse out URL params
	 */
	const { versionId, serviceId } = parseApiDocsVersionIdServiceId(pathParts)

	/**
	 * Parse version-related concerns
	 */
	const isVersionedUrl = versionId !== undefined
	const latestStableVersion = findLatestStableVersion(versionData)
	// Resolve the current version
	let currentVersion
	if (isVersionedUrl) {
		currentVersion = versionData.find((v) => v.versionId === versionId)
	} else {
		currentVersion = latestStableVersion
	}
	// If we can't resolve the current version, render a 404 page
	if (!currentVersion) {
		return { notFound: true }
	}

	/**
	 * Get schema-related props for the page,
	 * using the current version's Swagger file.
	 */
	const schemaProps = await buildSchemaProps({
		sourceFile: currentVersion.sourceFile,
		serviceId,
	})
	// If page props were not found, render a 404 page
	if ('notFound' in schemaProps) {
		return { notFound: true }
	}
	// Page props were found, we can safely destructure them
	const { schema, serviceData, serviceIds } = schemaProps

	/**
	 * Grab the relevant product data
	 */
	const productData = cachedGetProductData(productSlug)

	/**
	 * Build breadcrumbs for the page.
	 * Optionally uses a custom function passed by the consumer.
	 */
	const breadcrumbLinks = buildCustomBreadcrumbs
		? buildCustomBreadcrumbs({ productData, serviceData, versionId })
		: buildApiDocsBreadcrumbs({
				productData,
				apiDocs: { name: 'API', url: baseUrl },
				serviceData,
				versionId,
		  })

	/**
	 * Build sidebar nav data levels
	 */
	const sidebarNavDataLevels = buildSidebarNavDataLevels({
		productData,
		serviceIds,
		versionId,
		baseUrl,
	})

	/**
	 * Build a heading for versioned pages, showing a `releaseStage` badge
	 */
	const pageHeading = {
		text: schema.info.title,
		badgeText: currentVersion.releaseStage
			? sentenceCase(currentVersion.releaseStage)
			: null,
	}

	/**
	 * Build version switcher data, specific to versioned API docs views
	 */
	const versionSwitcherData = buildVersionSwitcherData({
		baseUrl,
		apiName: pageHeading.text,
		versionData,
		currentVersionId: currentVersion.versionId,
	})

	/**
	 * Return props for the page
	 */
	return {
		props: {
			metadata: {
				title: schema.info.title,
			},
			product: productData,
			pageHeading,
			layoutProps: {
				breadcrumbLinks,
				sidebarNavDataLevels,
			},
			serviceData,
			isVersionedUrl,
			versionSwitcherData,
			versionAlert: {
				isVersionedUrl,
				currentVersion,
				latestStableVersion,
			},
		},
	}
}
