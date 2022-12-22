import { ENABLED_INTEGRATION_PRODUCTS } from 'lib/enabled-integration-products'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	fetchAllProductIntegrations,
	Integration,
} from 'lib/integrations-api-client/integration'
import ProductIntegrationsLanding from 'views/product-integrations-landing'
import {
	generateTopLevelSidebarNavData,
	generateProductLandingSidebarNavData,
} from 'components/sidebar/helpers'

export async function getServerSideProps({ params }) {
	// 404 if we're not on an enabled page
	if (!ENABLED_INTEGRATION_PRODUCTS.includes(params.productSlug)) {
		return {
			notFound: true,
		}
	}
	const product = cachedGetProductData(params.productSlug)

	const integrations: Integration[] = await fetchAllProductIntegrations(
		params.productSlug
	)

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
		{
			backToLinkProps: {
				text: `${product.name} Home`,
				href: `/${product.slug}`,
			},
			levelButtonProps: {
				levelUpButtonText: `${product.name} Home`,
				levelDownButtonText: 'Previous',
			},
			menuItems: [
				{
					title: 'Library',
					href: `/${product.slug}/integrations`,
					isActive: true,
				},
			],
			showFilterInput: false,
			title: `${product.name} Integrations`,
		},
	]

	const breadcrumbLinks = [
		{
			title: 'Developer',
			url: '/',
			isCurrentPage: false,
		},
		{
			title: product.name,
			url: `/${product.slug}`,
			isCurrentPage: false,
		},
		{
			title: 'Integrations',
			url: `/${product.slug}/integrations`,
			isCurrentPage: true,
		},
	]
	return {
		props: {
			integrations,
			sidebarNavDataLevels,
			breadcrumbLinks,
		},
	}
}

export default ProductIntegrationsLanding
