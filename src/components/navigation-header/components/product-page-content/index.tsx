/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// HashiCorp Imports
import { IconHashicorp24 } from '@hashicorp/flight-icons/svg-react/hashicorp-24'

// Global imports
import { useCurrentProduct } from 'contexts'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import PLAYGROUND_CONFIG from 'data/playground.json'

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
import PlaygroundDropdown from '../playground-dropdown'
import s from './product-page-content.module.css'

const ProductPageHeaderContent = () => {
	const currentProduct = useCurrentProduct()
	const allProductsItems = getProductsDropdownItems()
	const productNavItems = getNavItems(currentProduct)

	// Check if the current product has playground support
	const supportedPlaygroundProducts = PLAYGROUND_CONFIG.products || []
	const hasPlayground =
		PLAYGROUND_CONFIG.labs?.length > 0 &&
		supportedPlaygroundProducts.includes(currentProduct.slug)

	// Get playground labs for the current product
	const labs = PLAYGROUND_CONFIG.labs || []
	const currentProductLabs = labs.filter((lab) =>
		lab.products.includes(currentProduct.slug)
	)

	return (
		<>
			<div className={s.productsDropdown}>
				<NavigationMenu.Root className={s.mobileMenuNavList}>
					<NavigationHeaderDropdownMenu
						ariaLabel="Main menu"
						buttonClassName={s.productsDropdownButton}
						itemGroups={allProductsItems}
						leadingIcon={<IconHashicorp24 className={s.productsDropdownIcon} />}
						productPanelData={{
							navigationData,
							navPromo,
							sidePanelContent,
						}}
					/>
				</NavigationMenu.Root>
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
						const isPlayground = navItem.label === 'Playground'

						if (isPlayground && hasPlayground) {
							return (
								<li key={navItem.label}>
									<div className={s.navDropdown}>
										<NavigationMenu.Root>
											<PlaygroundDropdown
												ariaLabel={ariaLabel}
												label="Playground"
											/>
										</NavigationMenu.Root>
									</div>
								</li>
							)
						}

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
