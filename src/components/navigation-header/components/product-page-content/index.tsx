// HashiCorp Imports
import { IconHashicorp24 } from '@hashicorp/flight-icons/svg-react/hashicorp-24'

// Global imports
import { useCurrentProduct } from 'contexts'

// Local imports
import {
	NavBarListContainer,
	NavigationHeaderDropdownMenu,
	PrimaryNavLink,
	PrimaryNavSubmenu,
} from '..'
import { ProductIconTextLink } from './components'
import { getNavItems, getProductsDropdownItems, NavItem } from './utils'
import s from './product-page-content.module.css'
import { useABTestCta } from 'components/try-hcp-callout/components/a-b-test'

const ProductPageHeaderContent = () => {
	const currentProduct = useCurrentProduct()
	const allProductsItems = getProductsDropdownItems()
	const productNavItems = getNavItems(currentProduct)

	/**
	 * Running AB test with the 'for free language'
	 * Remove after test is finished
	 */
	const tryCloudItemIndex = productNavItems.findIndex(
		(item) => item.label === 'Try Cloud'
	)
	const tryCloudLabel = productNavItems[tryCloudItemIndex].label
	productNavItems[tryCloudItemIndex].label = useABTestCta(tryCloudLabel)

	return (
		<>
			<div className={s.productsDropdown}>
				<NavigationHeaderDropdownMenu
					ariaLabel="Main menu"
					buttonClassName={s.productsDropdownButton}
					dropdownClassName={s.productsDropdownPane}
					itemGroups={allProductsItems}
					leadingIcon={<IconHashicorp24 className={s.productsDropdownIcon} />}
				/>
			</div>
			<div className={s.productLinkAndNav}>
				<ProductIconTextLink
					name={currentProduct.name}
					slug={currentProduct.slug}
				/>
				<NavBarListContainer>
					{productNavItems.map((navItem: NavItem) => {
						const ariaLabel = `${currentProduct.name} ${navItem.label}`
						const isSubmenu = 'items' in navItem

						return (
							<li key={navItem.label}>
								{isSubmenu ? (
									<PrimaryNavSubmenu ariaLabel={ariaLabel} navItem={navItem} />
								) : (
									<PrimaryNavLink ariaLabel={ariaLabel} navItem={navItem} />
								)}
							</li>
						)
					})}
				</NavBarListContainer>
			</div>
		</>
	)
}

export default ProductPageHeaderContent
