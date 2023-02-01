import { ProductData } from 'types/products'
import { CollectionViewSidebarContent } from 'components/tutorials-sidebar'
import { CollectionCategorySidebarSection } from './format-sidebar-sections'

/**
 * Generate the Tutorials Collection sidebar nav data level.
 * This is used both on the Collection view,
 * and in the mobile menu on the individual Tutorials view
 */
export function generateCollectionSidebarNavData(
	product: ProductData,
	sidebarSections: CollectionCategorySidebarSection[]
) {
	return {
		levelButtonProps: {
			levelUpButtonText: `${product.name} Home`,
			levelDownButtonText: 'Previous',
		},
		backToLinkProps: {
			text: `${product.name} Home`,
			href: `/${product.slug}`,
		},
		title: 'Tutorials',
		/* We always visually hide the title, as we've added in a
			"highlight" item that would make showing the title redundant. */
		visuallyHideTitle: true,
		children: (
			<CollectionViewSidebarContent
				productSlug={product.slug}
				sections={sidebarSections}
			/>
		),
	}
}
