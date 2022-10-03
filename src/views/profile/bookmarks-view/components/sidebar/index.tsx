import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
import { SidebarNavMenuItem } from 'components/sidebar/components'
import Sidebar from 'components/sidebar'
import { IconSignOut16 } from '@hashicorp/flight-icons/svg-react/sign-out-16'
import { IconBookmark16 } from '@hashicorp/flight-icons/svg-react/bookmark-16'
import { SidebarNavMenuButton } from 'components/sidebar/components/sidebar-nav-menu-item'
import useAuthentication from 'hooks/use-authentication'
import { useDeviceSize } from 'contexts'
import SidebarNavList from 'components/sidebar/components/sidebar-nav-list'

export function ProfileBookmarksSidebar() {
	const { signOut } = useAuthentication()
	const { isDesktop } = useDeviceSize()

	return (
		<Sidebar
			title={isDesktop ? 'Profile' : 'Main Menu'}
			showFilterInput={false}
		>
			<SidebarNavList>
				{isDesktop ? (
					<>
						<SidebarNavMenuItem
							item={{
								title: 'Bookmarks',
								fullPath: '/profile/bookmarks',
								isActive: true,
								trailingIcon: <IconBookmark16 />,
							}}
						/>
						<SidebarNavMenuItem
							item={{
								title: 'Account Settings',
								href: 'https://portal.cloud.hashicorp.com/account-settings',
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
				) : (
					generateTopLevelSubNavItems().map((item, index) => (
						<SidebarNavMenuItem item={item} key={index} />
					))
				)}
			</SidebarNavList>
		</Sidebar>
	)
}
