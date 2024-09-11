/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
import { navigationData, navPromo, sidePanelContent } from 'lib/products'
import s from './product-page-content.module.css'

const ProductPageHeaderContent = () => {
	const currentProduct = useCurrentProduct()
	const allProductsItems = getProductsDropdownItems()
	const productNavItems = getNavItems(currentProduct)

	return (
		<>
			<div className={s.productsDropdown}>
				<NavBarListContainer>
					<NavigationHeaderDropdownMenu
						ariaLabel="Main menu"
						buttonClassName={s.productsDropdownButton}
						dropdownClassName={s.productsDropdownPane}
						itemGroups={allProductsItems}
						leadingIcon={<IconHashicorp24 className={s.productsDropdownIcon} />}
						productPanelData={{
							navigationData,
							navPromo,
							sidePanelContent,
						}}
					/>
				</NavBarListContainer>
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
