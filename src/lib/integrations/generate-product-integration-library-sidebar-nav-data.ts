import { MenuItem } from 'components/sidebar/types'
import { ProductData } from 'types/products'

/**
 * Generate the sidebar nav data level for product integrations landing views,
 * such as `/vault/integrations`.
 */
export function generateProductIntegrationLibrarySidebarNavData(
	product: ProductData
) {
	// Set up menuItems for the sidebar
	const menuItems: MenuItem[] = [
		{
			title: 'Library',
			href: `/${product.slug}/integrations`,
			isActive: true,
		},
	]
	// Add Config SidebarLinks if they're provided
	if (product.integrationsConfig.sidebarLinks) {
		menuItems.push({ divider: true })
		menuItems.push({ heading: 'Integration Resources' })
		product.integrationsConfig.sidebarLinks.forEach((s) => {
			menuItems.push({ ...s, isActive: false })
		})
	}

	return {
		backToLinkProps: {
			text: `${product.name} Home`,
			href: `/${product.slug}`,
		},
		levelButtonProps: {
			levelUpButtonText: `${product.name} Home`,
			levelDownButtonText: 'Previous',
		},
		menuItems,
		showFilterInput: false,
		title: `${product.name} Integrations`,
	}
}
