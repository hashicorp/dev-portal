import { ProductData } from 'types/products'

/**
 * Generate the sidebar nav data level for product integrations landing views,
 * such as `/vault/integrations`.
 */
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
						] as Array<$TSFixMe>
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
