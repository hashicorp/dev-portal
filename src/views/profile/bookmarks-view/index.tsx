import { useState } from 'react'
import { useAllBookmarks } from 'hooks/bookmarks'
import { ApiBookmark } from 'lib/learn-client/api/api-types'
import { formatTutorialData } from 'lib/learn-client/api/tutorial/formatting'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import AuthenticatedView from 'views/authenticated-view'
import { TutorialCardsGridList } from 'components/cards-grid-list'
import { formatTutorialCard } from 'components/tutorial-card/helpers'
import Text from 'components/text'
import Heading from 'components/heading'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
} from 'components/dropdown-disclosure'
import { BookmarkButtonWithRemoveDialog } from './components/bookmark-button-with-remove-dialog'
import BookmarksEmptyState from './components/empty-state'
import { ProfileBookmarksSidebar } from './components/sidebar'
import { SortData } from './helpers/card-sort-data'
import s from './bookmarks-view.module.css'

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
					<span className={s.cardListHeading}>
						<Heading level={2} weight="semibold" size={300}>
							Your Bookmarks
						</Heading>
						<DropdownDisclosure
							color="secondary"
							text={sortBy.text}
							aria-label={`Sort by ${sortBy.text}`}
							listPosition="right"
						>
							<DropdownDisclosureButtonItem
								onClick={() => setSortBy(SortData.newest)}
							>
								{SortData.newest.text}
							</DropdownDisclosureButtonItem>
							<DropdownDisclosureButtonItem
								onClick={() => setSortBy(SortData.oldest)}
							>
								{SortData.oldest.text}
							</DropdownDisclosureButtonItem>
						</DropdownDisclosure>
					</span>
					<TutorialCardsGridList
						fixedColumns={2}
						tutorials={bookmarks
							.sort(sortBy.sort)
							.map((bookmark: ApiBookmark) => {
								const tutorialData = formatTutorialData(bookmark.tutorial)
								const defaultContext = tutorialData.collectionCtx.default
								const tutorialLiteCompat = { ...tutorialData, defaultContext }
								const tutorialCardProps = formatTutorialCard(tutorialLiteCompat)
								return {
									...tutorialCardProps,
									BookmarkButtonComponent: BookmarkButtonWithRemoveDialog,
								}
							})}
					/>
				</>
			) : (
				<BookmarksEmptyState />
			)}
		</div>
	)
}

export default ProfileBookmarksView
