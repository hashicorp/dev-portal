import { HeadMetadataProps } from 'components/head-metadata/types'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	Integration,
	fetchAllProductIntegrations,
} from 'lib/integrations-api-client/integration'
import { GetStaticPropsResult } from 'next'
import { ProductData } from 'types/products'
import ProductIntegrationsLanding, {
	ViewProps,
} from 'views/product-integrations-landing'

export function generateProductIntegrationLibrarySidebarNavData(
	product: ProductData
) {
	return {
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
		].concat(
			// Add Config SidebarLinks if they're provided
			product.integrationsConfig.sidebarLinks
				? (
						[
							{ divider: true },
							{ heading: 'Integration Resources' },
						] as Array<any>
				  ).concat(
						product.integrationsConfig.sidebarLinks.map((s) => {
							return { ...s, isActive: false }
						})
				  )
				: []
		),
		showFilterInput: false,
		title: `${product.name} Integrations`,
	}
}

export async function getServerSideProps({
	params,
}): Promise<GetStaticPropsResult<ViewProps & { metadata: HeadMetadataProps }>> {
	// Pull out the Product Config
	const product = cachedGetProductData(params.productSlug)

	// 404 if we're not on an enabled page
	if (!product.integrationsConfig.enabled) {
		return {
			notFound: true,
		}
	}

	const integrations: Integration[] = await fetchAllProductIntegrations(
		params.productSlug
	)

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
		generateProductIntegrationLibrarySidebarNavData(product),
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
			metadata: {
				title: `Integrations | ${product.name}`,
				// description: `TODO`,
			},
			productSlug: product.slug,
			integrations,
			sidebarNavDataLevels,
			breadcrumbLinks,
		},
	}
}

export default ProductIntegrationsLanding
