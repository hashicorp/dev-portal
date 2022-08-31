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

const productSlug = 'boundary'
const targetFile = {
	owner: 'hashicorp',
	repo: 'boundary',
	path: 'internal/gen/controller.swagger.json',
	ref: 'stable-website',
}
// The path to read from when running local preview in the context of the boundary repository
const targetLocalFile = '../../internal/gen/controller.swagger.json'

function ApiDocsView({ layoutProps, apiPageProps }) {
	return (
		<SidebarSidecarLayout {...layoutProps} sidecarSlot={null}>
			<OpenApiPageContents
				info={apiPageProps.info}
				operationCategory={apiPageProps.operationCategory}
				renderOperationIntro={apiPageProps.renderOperationIntro}
			/>
		</SidebarSidecarLayout>
	)
}

export async function getStaticPaths() {
	let schema
	let paths
	if (isDeployPreview(productSlug)) {
		schema = await processSchemaFile(targetLocalFile)
	} else if (isDeployPreview()) {
		// If we are in a deploy preview that isn't in the boundary repository, don't pre-render any paths
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
		{ title: 'Boundary', url: `/boundary` },
		{ title: 'API', url: `/boundary/api-docs` },
	]

	// Breadcrumbs - Render conditional category
	if ('operationCategory' in apiPageProps) {
		breadcrumbLinks.push({
			title: apiPageProps.operationCategory.name,
			url: `/boundary/api-docs/${apiPageProps.operationCategory.slug}`,
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
				fullPath: `/boundary/api-docs/${menuItem.path}`,
			}
		} else {
			return menuItem
		}
	})

	// Construct sidebar nav data levels
	const sidebarNavDataLevels = [
		{
			backToLinkProps: { text: 'Boundary Home', href: '/boundary/' },
			title: 'API',
			menuItems: [
				{
					title: 'Overview',
					fullPath: '/boundary/api-docs/',
				},
				{
					divider: true,
				},
				...apiSidebarMenuItems,
			],
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
			},
			product: productData,
		},
	}
}

export default ApiDocsView
