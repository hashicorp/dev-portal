/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { SidebarNavMenuItem } from 'components/sidebar/components'
import Sidebar from 'components/sidebar'
import { IconSignOut16 } from '@hashicorp/flight-icons/svg-react/sign-out-16'
import { IconUser16 } from '@hashicorp/flight-icons/svg-react/user-16'
import { IconBookmark16 } from '@hashicorp/flight-icons/svg-react/bookmark-16'
import { SidebarNavMenuButton } from 'components/sidebar/components/sidebar-nav-menu-item'
import useAuthentication from 'hooks/use-authentication'
import SidebarNavList from 'components/sidebar/components/sidebar-nav-list'
import { useRouter } from 'next/router'
import ProductPanel from '@hashicorp/react-components/src/components/nav-panel/product-panel'
import { mobileNavigationData, navPromo, sidePanelContent } from 'lib/products'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'

/**
 * shared left side bar for /profile pages
 */
export function ProfileSidebar() {
	const { signOut } = useAuthentication()
	const { asPath } = useRouter()

	const isActive = (path: string) => {
		return asPath === path
	}

	return (
		<>
			<Sidebar
				title="Profile"
				showFilterInput={false}
				className="g-hide-with-mobile-menu"
			>
				<SidebarNavList>
					<>
						<SidebarNavMenuItem
							item={{
								title: 'Basic info',
								fullPath: '/profile/account',
								isActive: isActive('/profile/account'),
								trailingIcon: <IconUser16 />,
							}}
						/>
						<SidebarNavMenuItem
							item={{
								title: 'Bookmarks',
								fullPath: '/profile/bookmarks',
								isActive: isActive('/profile/bookmarks'),
								trailingIcon: <IconBookmark16 />,
							}}
						/>
						<li>
							<SidebarNavMenuButton
								item={{
									title: 'Sign Out',
									onClick: () => signOut(),
									icon: <IconSignOut16 />,
								}}
							/>
						</li>
					</>
				</SidebarNavList>
			</Sidebar>
			<NavigationMenu.Root className="g-show-with-mobile-menu">
				<ProductPanel
					productCategories={mobileNavigationData}
					promo={navPromo}
					sidePanel={sidePanelContent}
				/>
			</NavigationMenu.Root>
		</>
	)
}
