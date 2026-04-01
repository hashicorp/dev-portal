/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Global imports
import { useCurrentProduct } from 'contexts'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import SANDBOX_CONFIG from 'content/sandbox/sandbox.json'

// Local imports
import { NavBarListContainer, PrimaryNavLink, PrimaryNavSubmenu } from '..'
import { ProductIconTextLink } from './components'
import { getNavItems, getRightSideNavButtons, NavItem } from './utils'
import { PrimaryNavLinkProps } from '../primary-nav-link'
import SandboxDropdown from '../sandbox-dropdown'
import s from './product-page-content.module.css'

const ProductPageHeaderContent = () => {
	const currentProduct = useCurrentProduct()
	const productNavItems = getNavItems(currentProduct)
	const rightSideNavItems = getRightSideNavButtons(currentProduct)

	// Check if the current product has sandbox support
	const supportedSandboxProducts = SANDBOX_CONFIG.products || []
	const hasSandbox =
		SANDBOX_CONFIG.labs?.length > 0 &&
		supportedSandboxProducts.includes(currentProduct.slug)

	return (
		<>
			<div className={s.productLinkAndNav}>
				<ProductIconTextLink
					name={currentProduct.name}
					slug={currentProduct.slug}
				/>
				<NavBarListContainer>
					<div className={s.left}>
						{productNavItems.map((navItem: NavItem) => {
							const ariaLabel = `${currentProduct.name} ${navItem.label}`
							const isSubmenu = 'items' in navItem
							const isSandbox = navItem.label === 'Sandbox'

							if (isSandbox && hasSandbox) {
								return (
									<li key={navItem.label}>
										<div className={s.navDropdown}>
											<NavigationMenu.Root>
												<SandboxDropdown
													ariaLabel={ariaLabel}
													label="Sandbox"
												/>
											</NavigationMenu.Root>
										</div>
									</li>
								)
							}

							return (
								<li key={navItem.label}>
									{isSubmenu ? (
										<PrimaryNavSubmenu
											ariaLabel={ariaLabel}
											navItem={navItem}
										/>
									) : (
										<PrimaryNavLink ariaLabel={ariaLabel} navItem={navItem} />
									)}
								</li>
							)
						})}
					</div>
					<div className={s.right}>
						{rightSideNavItems.map(
							(navItem: PrimaryNavLinkProps['navItem']) => {
								const ariaLabel = `${currentProduct.name} ${navItem.label}`

								return (
									<li key={navItem.label}>
										<PrimaryNavLink ariaLabel={ariaLabel} navItem={navItem} />
									</li>
								)
							}
						)}
					</div>
				</NavBarListContainer>
			</div>
		</>
	)
}

export default ProductPageHeaderContent
