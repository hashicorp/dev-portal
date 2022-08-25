import { useState } from 'react'
import { useAllBookmarks } from 'hooks/bookmarks'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import AuthenticatedView from 'views/authenticated-view'
import { ApiBookmark } from 'lib/learn-client/api/api-types'
import CardsGridList from 'components/cards-grid-list'
import Text from 'components/text'
import Heading from 'components/heading'
import BookmarksEmptyState from './components/empty-state'
import { ProfileBookmarksSidebar } from './components/sidebar'
import renderBookmarkCard from './helpers/render-bookmark-cards'
import s from './bookmarks-view.module.css'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
} from 'components/dropdown-disclosure'

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
					{
						title: 'Bookmarks',
						url: '/profile/bookmarks',
						isCurrentPage: true,
					},
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

const SortData = {
	newest: {
		text: 'Newest',
		sort: (a: ApiBookmark, b: ApiBookmark) => {
			return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
		},
	},
	oldest: {
		text: 'Oldest',
		sort: (a: ApiBookmark, b: ApiBookmark) => {
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		},
	},
}

/**
 * The content of the ProfileView that is gated behind authentication.
 */
const ProfileBookmarksViewContent = () => {
	const { bookmarks, isLoading } = useAllBookmarks({
		enabled: true,
	})
	const [sortBy, setSortBy] = useState(SortData.newest)

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
					<DropdownDisclosure color="secondary" text={sortBy.text}>
						<DropdownDisclosureButtonItem
							onClick={() => {
								setSortBy(SortData.newest)
							}}
						>
							Newest
						</DropdownDisclosureButtonItem>
						<DropdownDisclosureButtonItem
							onClick={() => {
								setSortBy(SortData.oldest)
							}}
						>
							Oldest
						</DropdownDisclosureButtonItem>
					</DropdownDisclosure>

					<CardsGridList fixedColumns={2}>
						{bookmarks.sort(sortBy.sort).map(renderBookmarkCard)}
					</CardsGridList>
				</>
			) : (
				<BookmarksEmptyState />
			)}
		</div>
	)
}

export default ProfileBookmarksView
