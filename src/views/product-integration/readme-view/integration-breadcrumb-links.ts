import { ProductData } from 'types/products'
import { Integration } from 'lib/integrations-api-client/integration'
import { BreadcrumbLink } from 'components/breadcrumb-bar'

export function integrationBreadcrumbLinks(
	product: ProductData,
	integration: Integration,
	finalBreadcrumbSegments: boolean
): Array<BreadcrumbLink> {
	return [
		{
			title: 'Developer',
			url: '/',
		},
		{
			title: product.name,
			url: `/${product.slug}`,
		},
		{
			title: 'Integrations',
			url: `/${product.slug}/integrations`,
		},
		{
			title: integration.name,
			url: `/${product.slug}/integrations/${integration.slug}`,
			isCurrentPage: finalBreadcrumbSegments,
		},
	]
}
