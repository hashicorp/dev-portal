/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Shared
import { isDeployPreview } from 'lib/env-checks'
// View
import ApiDocsView from 'views/api-docs-view'
import {
	getApiDocsStaticProps,
	getApiDocsStaticPaths,
	ApiDocsParams,
} from 'views/api-docs-view/server'
// Components
import type { ApiDocsVersionData } from 'lib/api-docs/types'
import type { ApiDocsViewProps } from 'views/api-docs-view/types'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { buildApiDocsBreadcrumbs } from 'views/api-docs-view/server/get-api-docs-static-props/utils'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import InlineAlert from 'components/inline-alert'
import s from './api-docs.module.css'

/**
 * The product slug is used to fetch product data for the layout.
 */
const PRODUCT_SLUG = 'waypoint'

/**
 * The baseUrl is used to generate
 * breadcrumb links, sidebar nav levels, and version switcher links.
 */
const BASE_URL = '/waypoint/api-docs'

/**
 * The path to read from when running local preview in the context
 * of the `hashicorp/waypoint` repository.
 */
const TARGET_LOCAL_FILE = '../../pkg/server/gen/server.swagger.json'

/**
 * The Waypoint API docs have circular references.
 * We manually try to deal with those. This is a band-aid solution,
 * it seems to have unintended side-effects when applied to other
 * products' API docs, and almost certainly merits further investigation.
 *
 * Asana task:
 * https://app.asana.com/0/1202097197789424/1203989531295664/f
 */
const MAY_HAVE_CIRCULAR_REFERENCES = true

/**
 * Version data is hard-coded for now. In the future, we could fetch
 * version data from elsewhere, as we do for `/hcp/api-docs/packer`.
 */
function getVersionData(): ApiDocsVersionData[] {
	const sourceFile = isDeployPreview(PRODUCT_SLUG)
		? TARGET_LOCAL_FILE
		: {
				owner: 'hashicorp',
				repo: 'waypoint',
				path: 'pkg/server/gen/server.swagger.json',
				ref: 'stable-website',
		  }
	return [
		{
			/**
			 * Note this is a `versionId` placeholder. Since it isn't date-based,
			 * currently we won't render a dedicated versioned URL for it.
			 *
			 * In the future, we could support version formats other than date-based.
			 * That might better align with versioned API docs for Waypoint.
			 */
			versionId: 'latest',
			sourceFile,
		},
	]
}

/**
 * Get static paths, using `versionData` fetched from GitHub.
 */
export const getStaticPaths: GetStaticPaths<ApiDocsParams> = async () => {
	// Use the hard-coded version data
	const versionData = await getVersionData()
	return await getApiDocsStaticPaths({
		productSlug: PRODUCT_SLUG,
		versionData,
		mayHaveCircularReferences: MAY_HAVE_CIRCULAR_REFERENCES,
	})
}

/**
 * Get static props, using `versionData` fetched from GitHub.
 *
 * We need all version data for the version selector,
 * and of course we need specific data for the current version.
 */
export const getStaticProps: GetStaticProps<
	ApiDocsViewProps,
	ApiDocsParams
> = async ({ params }: { params: ApiDocsParams }) => {
	// Use the hard-coded version data
	const versionData = await getVersionData()
	// Return static props
	return await getApiDocsStaticProps({
		productSlug: PRODUCT_SLUG,
		baseUrl: BASE_URL,
		pathParts: params.page,
		versionData,
		mayHaveCircularReferences: MAY_HAVE_CIRCULAR_REFERENCES,
		buildCustomSidebarNavDataLevels: ({ productData }) => {
			return [
				generateTopLevelSidebarNavData(productData.name),
				generateProductLandingSidebarNavData(productData),
				{
					backToLinkProps: {
						text: `${productData.name} Home`,
						href: `/${productData.slug}`,
					},
					visuallyHideTitle: true,
					title: 'API',
					levelButtonProps: {
						levelUpButtonText: `${productData.name} Home`,
					},
					menuItems: [
						{
							title: 'API',
							fullPath: '/waypoint/api-docs',
							theme: productData.slug,
						},
					],
				},
			]
		},
		buildCustomBreadcrumbs: ({ productData, versionId }) => {
			return buildApiDocsBreadcrumbs({
				productData,
				apiDocs: { name: 'API', url: BASE_URL },
				/**
				 * Note: We intentionally omit `serviceData`, to avoid an extra item
				 * in the breadcrumb, as unlike `/hcp/api-docs/packer`
				 * we don't want to include a link with the service name.
				 */
				versionId,
			})
		},
	})
}

function WaypointApiDocsPage(props) {
	return (
		<ApiDocsView
			{...props}
			alertSlot={
				<InlineAlert
					title="Archive Notice"
					description="These API docs are from of a legacy version of Waypoint and are no longer actively maintained."
					color="highlight"
					className={s.alert}
					ctaSlot={
						<a
							href="https://www.hashicorp.com/blog/a-new-vision-for-hcp-waypoint"
							target="_blank"
						>
							For more information, read this blog post
						</a>
					}
				/>
			}
		/>
	)
}

export default WaypointApiDocsPage
