import type { InferGetStaticPropsType } from 'next'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { OpenApiPageContents } from 'components/open-api-page'
/* Used server-side only */
import { cachedGetProductData } from 'lib/get-product-data'
import { isDeployPreview } from 'lib/env-checks'
import fetchGithubFile from 'lib/fetch-github-file'
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

import type { PageWithLayout } from 'types/layouts'

const productSlug = 'hcp'
const targetFile = {
	owner: 'hashicorp',
	repo: 'cloud-api',
	path: 'specs/cloud-packer-service/stable/2021-04-30/hcp.swagger.json',
}

// The path to read from when running local preview in the context of the cloud.hashicorp.com repository
// - This is unused as cloud.hashicorp.com does not use the dev-portal website shell yet
const targetLocalFile = '../TODO'

type ApiDocsPageProps = InferGetStaticPropsType<typeof getStaticProps>
const ApiDocsPage: PageWithLayout<ApiDocsPageProps> = ({ apiPageProps }) => {
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
		paths = []
	} else {
		const swaggerFile = await fetchGithubFile(targetFile)
		schema = await processSchemaString(swaggerFile)
	}

	if (schema) {
		paths = getPathsFromSchema(schema)
	}

	return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
	let schema
	if (isDeployPreview(productSlug)) {
		// we wont realistically reach this branch,
		// but it's here to mirror /src/pages/boundary/api-docs/[[...page]].tsx
		schema = await processSchemaFile(targetLocalFile)
	} else {
		const swaggerFile = await fetchGithubFile(targetFile)
		schema = await processSchemaString(swaggerFile)
	}

	// API page data
	const apiPageProps = getPropsForPage(schema, params)

	// Product data
	const productData = cachedGetProductData(productSlug)

	// Layout props
	const headings = []

	// Breadcrumbs
	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: 'HashiCorp Cloud Platform', url: `/hcp/` },
		{ title: 'API', url: `/hcp/api-docs/` },
	]

	// Breadcrumbs - Render conditional category
	if ('operationCategory' in apiPageProps) {
		breadcrumbLinks.push({
			title: apiPageProps.operationCategory.name,
			url: `/hcp/api-docs/packer/`,
		})
	}

	// Breadcrumbs - Make final element dark-text
	// @ts-expect-error `isCurrentPage` is an expected optional field
	breadcrumbLinks[breadcrumbLinks.length - 1].isCurrentPage = true

	// Menu items for the sidebar, from the existing dot-io-oriented navData
	const apiSidebarMenuItems = apiPageProps.navData.map((menuItem) => {
		if (menuItem.hasOwnProperty('path')) {
			// Path differs on dev-dot, so all nodes with `path` must be adjusted
			return {
				...menuItem,
				fullPath: `/hcp/api-docs/${menuItem.path}`,
			}
		} else {
			return menuItem
		}
	})

	// Construct sidebar nav data levels
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(productData.name),
		generateProductLandingSidebarNavData(productData),
		{
			backToLinkProps: { text: 'HashiCorp Cloud Platform Home', href: '/hcp/' },
			title: 'API',
			levelButtonProps: {
				levelUpButtonText: `${productData.name} Home`,
			},
			menuItems: [...apiSidebarMenuItems],
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

ApiDocsPage.layout = SidebarSidecarLayout
export default ApiDocsPage
