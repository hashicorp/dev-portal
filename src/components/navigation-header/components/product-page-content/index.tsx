/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Global imports
import { useCurrentProduct, useMobileSubMenu } from 'contexts'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import SANDBOX_CONFIG from 'content/sandbox/sandbox.json'

// Local imports
import { NavBarListContainer, PrimaryNavLink, PrimaryNavSubmenu } from '..'
import { ProductIconTextLink } from './components'
import { getRightSideNavItems, NavItem, getLeftSideNavItems } from './utils'
import { PrimaryNavLinkProps } from '../primary-nav-link'
import SandboxDropdown from '../sandbox-dropdown'
import { usePathname } from 'next/navigation'
import { MobileSubMenuContainer } from '@components/mobile-menu-container'
import {
	SidebarNavMenuItem,
	SidebarNavSubmenuItem,
} from '@components/sidebar/components'
import { SidebarNavMenuItemProps } from '@components/sidebar/components/sidebar-nav-menu-item/types'
import { MenuItem } from '@components/sidebar'
import s from './product-page-content.module.css'

// Icons
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import { IconChevronUp16 } from '@hashicorp/flight-icons/svg-react/chevron-up-16'

/**
 * The header content displayed to the far right of the window. This content is
 * the same for every page in the app.
 */
function MobileSubMenuButton({ className }) {
	const { mobileSubMenuIsOpen, setMobileSubMenuIsOpen } = useMobileSubMenu()
	const ariaLabel = `${mobileSubMenuIsOpen ? 'Close' : 'Open'} sub navigation menu`
	const iconSize = '12px'

	function handleMenu() {
		setMobileSubMenuIsOpen((prevState) => !prevState)
	}

	return (
		<>
			<button aria-label={ariaLabel} className={className} onClick={handleMenu}>
				Menu{' '}
				{mobileSubMenuIsOpen ? (
					<IconChevronUp16 fontSize={iconSize} />
				) : (
					<IconChevronDown16 fontSize={iconSize} />
				)}
			</button>
		</>
	)
}

function CertificationsMobileMenu({ className, navItems }) {
	// convert NavItem type into SidebarNavMenuItemProps
	const formattedNavItems: SidebarNavMenuItemProps[] = navItems.map(
		(navItem: NavItem): SidebarNavMenuItemProps => {
			// Format for submenu item
			if ('items' in navItem) {
				return {
					item: {
						title: navItem.label,
						isOpen: true,
						routes: navItem.items.map(
							(subItem): MenuItem => ({
								title: subItem.label,
								fullPath: subItem.path,
							}),
						),
					},
				}
			}

			// Format for single menu item
			return {
				item: {
					title: navItem.label,
					fullPath: navItem.url,
				},
			}
		},
	)

	// Render submenu if there are additional routes; otherwise, render a single menu item
	return (
		<MobileSubMenuContainer className={className}>
			{formattedNavItems.map(({ item }) =>
				item.routes ? (
					<SidebarNavSubmenuItem key={item.title} item={item} />
				) : (
					<SidebarNavMenuItem key={item.title} item={item} />
				),
			)}
		</MobileSubMenuContainer>
	)
}

const ProductPageHeaderContent = () => {
	const currentProduct = useCurrentProduct()
	const pathname = usePathname()
	const isCertificationsRoute = pathname.startsWith('/certifications')

	const leftSideNavItems = getLeftSideNavItems(
		currentProduct,
		isCertificationsRoute,
	)
	const rightSideNavItems = getRightSideNavItems(
		currentProduct,
		isCertificationsRoute && !pathname.includes('signin'), // this makes it so the register for exam button doesn't render on signin
	)

	// Check if the current product has sandbox support
	const supportedSandboxProducts = SANDBOX_CONFIG.products || []
	const hasSandbox =
		SANDBOX_CONFIG.labs?.length > 0 &&
		supportedSandboxProducts.includes(currentProduct?.slug)

	return (
		<>
			<div className={s.productLinkAndNav}>
				<ProductIconTextLink
					name={isCertificationsRoute ? 'Certifications' : currentProduct.name}
					slug={isCertificationsRoute ? 'certifications' : currentProduct.slug}
				/>
				<NavBarListContainer>
					<div className={s.left}>
						{leftSideNavItems.map((navItem: NavItem) => {
							const ariaLabel = `${currentProduct?.name} ${navItem.label}`
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
								const ariaLabel = `${currentProduct?.name} ${navItem.label}`

								return (
									<li key={navItem.label}>
										<PrimaryNavLink ariaLabel={ariaLabel} navItem={navItem} />
									</li>
								)
							},
						)}
					</div>
				</NavBarListContainer>
				<MobileSubMenuButton className={s.mobileSubMenuButton} />
				{isCertificationsRoute && (
					<CertificationsMobileMenu
						className={s.certsMobileMenu}
						navItems={leftSideNavItems}
					/>
				)}
			</div>
		</>
	)
}

export default ProductPageHeaderContent
