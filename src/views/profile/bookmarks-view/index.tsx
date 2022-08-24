import { useAllBookmarks } from 'hooks/bookmarks'
import BaseNewLayout from 'layouts/base-new'
import AuthenticatedView from 'views/authenticated-view'
import CardsGridList from 'components/cards-grid-list'
import Text from 'components/text'
import Heading from 'components/heading'
import BookmarksEmptyState from './components/empty-state'
import renderBookmarkCard from './helpers/render-bookmark-cards'
import s from './bookmarks-view.module.css'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
import { SidebarNavLinkItem } from 'components/sidebar/components'
import Sidebar from 'components/sidebar'
import { IconSignOut16 } from '@hashicorp/flight-icons/svg-react/sign-out-16'
import { SidebarNavMenuButton } from 'components/sidebar/components/sidebar-nav-menu-item'
import useAuthentication from 'hooks/use-authentication'

/**
 * The exported view component that handles wrapping the view content in
 * `AuthenticatedView`, which automatically handles rendering gated content.
 */
const ProfileBookmarksView = () => {
	return (
		<AuthenticatedView>
			<SidebarSidecarLayout
				breadcrumbLinks={[
					{ title: 'Developer', url: '/' },
					{ title: 'Bookmarks', url: '/profile/bookmarks' },
				]}
				AlternateSidebar={ProfileBookmarksSidebar}
				sidebarNavDataLevels={[]}
				sidecarSlot={null}
			>
				<ProfileBookmarksViewContent />
			</SidebarSidecarLayout>
		</AuthenticatedView>
	)
}

function ProfileBookmarksSidebar() {
	const { signOut } = useAuthentication()
	return (
		<Sidebar title="Profile" showFilterInput={false}>
			<SidebarNavLinkItem
				item={{
					title: 'Bookmarks',
					fullPath: '/profile/bookmarks',
					isActive: true,
				}}
			/>
			<SidebarNavLinkItem
				item={{
					title: 'Account Settings',
					href: 'https://portal.cloud.hashicorp.com/account-settings',
				}}
			/>
			<SidebarNavMenuButton
				item={{
					title: 'Sign Out',
					onClick: () => signOut(),
					icon: <IconSignOut16 />,
				}}
			/>
		</Sidebar>
	)
}

/**
 * The content of the ProfileView that is gated behind authentication.
 */
const ProfileBookmarksViewContent = () => {
	const { bookmarks, isLoading } = useAllBookmarks({
		enabled: true,
	})

	if (isLoading) {
		return null // TODO return loading skeleton
	}

	return (
		<div>
			<Heading level={1} weight="bold" size={500}>
				Bookmarks
			</Heading>
			<Text className={s.subheading}>
				View and manage your personal bookmarks. Select the bookmark icon in
				each card below to remove the bookmark.
			</Text>
			{bookmarks?.length > 0 ? (
				<>
					<Heading
						level={2}
						weight="semibold"
						size={300}
						className={s.cardListHeading}
					>
						Your Bookmarks
					</Heading>
					<CardsGridList>{bookmarks.map(renderBookmarkCard)}</CardsGridList>
				</>
			) : (
				<BookmarksEmptyState />
			)}
		</div>
	)
}

ProfileBookmarksView.layout = BaseNewLayout
export default ProfileBookmarksView
