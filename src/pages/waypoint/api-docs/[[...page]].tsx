/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { InferGetStaticPropsType } from 'next'
import { CustomPageComponent } from 'types/_app'
/* Used server-side only */
import { cachedGetProductData } from 'lib/get-product-data'
import { isDeployPreview } from 'lib/env-checks'
import fetchGithubFile from 'lib/fetch-github-file'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { OpenApiPageContents } from 'components/open-api-page'
import {
	getPathsFromSchema,
	getPropsForPage,
	processSchemaString,
	processSchemaFile,
} from 'components/open-api-page/server'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'

const productSlug = 'waypoint'
const targetFile = {
	owner: 'hashicorp',
	repo: 'waypoint',
	path: 'pkg/server/gen/server.swagger.json',
	ref: 'stable-website',
}

// The path to read from when running local preview in the context of the waypoint repository
const targetLocalFile = '../../pkg/server/gen/server.swagger.json'

type ApiDocsViewProps = InferGetStaticPropsType<typeof getStaticProps>
const ApiDocsView: CustomPageComponent<ApiDocsViewProps> = ({
	apiPageProps,
}: ApiDocsViewProps) => {
	return (
		<OpenApiPageContents
			info={apiPageProps.info}
			operationCategory={apiPageProps.operationCategory}
			renderOperationIntro={null}
		/>
	)
}

export async function getStaticPaths() {
	let schema
	let paths
	if (isDeployPreview(productSlug)) {
		schema = await processSchemaFile(targetLocalFile)
	} else if (isDeployPreview()) {
		// If we are in a deploy preview that isn't in the waypoint repository, don't pre-render any paths
		paths = []
	} else {
		const swaggerFile = await fetchGithubFile(targetFile)
		schema = await processSchemaString(swaggerFile)
	}

	if (schema) {
		const mayHaveCircularReferences = true
		paths = getPathsFromSchema(schema, mayHaveCircularReferences)
	}

	return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
	let schema
	if (isDeployPreview(productSlug)) {
		schema = await processSchemaFile(targetLocalFile)
	} else {
		const swaggerFile = await fetchGithubFile(targetFile)
		schema = await processSchemaString(swaggerFile)
	}

	// API page data
	/**
	 * Note: the Waypoint API docs have circular references.
	 * We manually try to deal with those. This is a band-aid solution,
	 * it seems to have unintended side-effects when applied to other
	 * products' API docs, and almost certainly merits further investigation.
	 *
	 * Asana task:
	 * https://app.asana.com/0/1202097197789424/1203989531295664/f
	 */
	const mayHaveCircularReferences = true
	const apiPageProps = getPropsForPage(
		schema,
		params,
		mayHaveCircularReferences
	)

	// Product data
	const productData = cachedGetProductData(productSlug)

	// Layout props
	const headings = []

	// Breadcrumbs
	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: 'Waypoint', url: `/waypoint` },
		{ title: 'API', url: `/waypoint/api-docs` },
	]
	// Remove the 'index' page '/waypoint/api-docs' from the breadcrumbs
	const shouldAddBreadcrumb = !(
		apiPageProps.operationCategory.slug === productData.slug
	)

	// Breadcrumbs - Render conditional category
	if (shouldAddBreadcrumb && 'operationCategory' in apiPageProps) {
		breadcrumbLinks.push({
			title: apiPageProps.operationCategory.name,
			url: `/waypoint/api-docs/${apiPageProps.operationCategory.slug}`,
		})
	}

	// Breadcrumbs - Make final element dark-text
	// @ts-expect-error `isCurrentPage` is an expected optional field
	breadcrumbLinks[breadcrumbLinks.length - 1].isCurrentPage = true

	// Remove the 'index' menu item, whose path is '/waypoint/api-docs'
	const filteredMenuItems = apiPageProps.navData.filter(
		(menuItem) => menuItem.path != ''
	)

	// Menu items for the sidebar, from the existing dot-io-oriented navData
	const apiSidebarMenuItems = filteredMenuItems.map((menuItem) => {
		if (menuItem.hasOwnProperty('path')) {
			// Path differs on dev-dot, so all nodes with `path` must be adjusted
			return {
				...menuItem,
				fullPath: `/waypoint/api-docs/${menuItem.path}`,
			}
		} else {
			return menuItem
		}
	})

	const menuItems = [
		{
			title: 'API',
			fullPath: '/waypoint/api-docs/',
			theme: 'waypoint',
		},
	]

	if (apiSidebarMenuItems.length > 0) {
		menuItems.push(
			...[
				{
					divider: true,
				},
				...apiSidebarMenuItems,
			]
		)
	}

	// Construct sidebar nav data levels
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(productData.name),
		generateProductLandingSidebarNavData(productData),
		{
			backToLinkProps: { text: 'Waypoint Home', href: '/waypoint/' },
			title: 'API',
			levelButtonProps: {
				levelUpButtonText: `${productData.name} Home`,
			},
			/* We always visually hide the title, as we've added in a
			"highlight" item that would make showing the title redundant. */
			visuallyHideTitle: true,
			menuItems,
		},
	]

	// Return props for the page
	return {
		props: {
			apiPageProps,
			layoutProps: {
				headings,
				breadcrumbLinks,
				sidebarNavDataLevels,
				sidecarSlot: null,
			},
			product: productData,
		},
	}
}

ApiDocsView.contentType = 'docs'
ApiDocsView.layout = SidebarSidecarLayout

export default ApiDocsView
