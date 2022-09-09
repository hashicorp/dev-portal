import type { InferGetStaticPropsType } from 'next'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { OpenApiPageContents } from 'components/open-api-page'
import DevDotContent from 'components/dev-dot-content'
import CodeBlock from '@hashicorp/react-code-block'
/* Used server-side only */
import { cachedGetProductData } from 'lib/get-product-data'
import fetchGithubFile from 'lib/fetch-github-file'
import {
	getPathsFromSchema,
	getPropsForPage,
	processSchemaString,
} from 'components/open-api-page/server'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'

import { CustomPageComponent } from 'types/_app'

const productSlug = 'hcp'
const targetFile = {
	owner: 'hashicorp',
	repo: 'cloud-api',
	path: 'specs/cloud-packer-service/stable/2021-04-30/hcp.swagger.json',
}

type ApiDocsPageProps = InferGetStaticPropsType<typeof getStaticProps>
const ApiDocsPage: CustomPageComponent<ApiDocsPageProps> = ({
	apiPageProps,
}) => {
	return (
		<OpenApiPageContents
			info={apiPageProps.info}
			operationCategory={apiPageProps.operationCategory}
			// Truncate operation paths,
			// as they are otherwise very difficult to read
			massageOperationPathFn={(path) =>
				path.replace(
					'/packer/2021-04-30/organizations/{location.organization_id}/projects/{location.project_id}',
					''
				)
			}
			// Add an introductory warning text to each operation
			// to make a note that the paths have been truncated
			renderOperationIntro={function PathAside({ data }) {
				return (
					<>
						<DevDotContent>
							<div className="alert alert-info">
								<strong>Note:</strong> Operation paths have been truncated for
								clarity. The full path to this operation is:
							</div>
						</DevDotContent>
						<CodeBlock
							code={data.__path}
							theme="dark"
							options={{ showClipboard: true }}
						/>
					</>
				)
			}}
		/>
	)
}

export async function getStaticPaths() {
	let paths = []

	const swaggerFile = await fetchGithubFile(targetFile)
	const schema = await processSchemaString(swaggerFile)

	if (schema) {
		paths = getPathsFromSchema(schema)
	}

	return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
	const swaggerFile = await fetchGithubFile(targetFile)
	const schema = await processSchemaString(swaggerFile)

	// API page data
	const apiPageProps = getPropsForPage(schema, params)

	// Product data
	const productData = cachedGetProductData(productSlug)

	// Layout props
	const headings = []

	// Breadcrumbs
	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: 'HashiCorp Cloud Platform', url: `/hcp` },
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
				fullPath: `/hcp/api-docs/packer/${menuItem.path}`,
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
			backToLinkProps: { text: 'HashiCorp Cloud Platform Home', href: '/hcp' },
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
