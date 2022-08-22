import { useAllBookmarks } from 'hooks/bookmarks'
import BaseNewLayout from 'layouts/base-new'
import AuthenticatedView from 'views/authenticated-view'
import CardsGridList from 'components/cards-grid-list'
import Text from 'components/text'
import Heading from 'components/heading'
import BookmarksEmptyState from './components/empty-state'
import renderBookmarkCard from './helpers/render-bookmark-cards'
import s from './bookmarks-view.module.css'

/**
 * The exported view component that handles wrapping the view content in
 * `AuthenticatedView`, which automatically handles rendering gated content.
 */
const ProfileBookmarksView = () => {
	return (
		<AuthenticatedView>
			<ProfileBookmarksViewContent />
		</AuthenticatedView>
	)
}

/**
 * The content of the ProfileView that is gated behind authentication.
 */
const ProfileBookmarksViewContent = () => {
	const { bookmarks, isFetching, isRefetching } = useAllBookmarks({
		enabled: true,
	})
	const isFirstLoad = isFetching && !isRefetching

	if (isFirstLoad) {
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
			<Heading
				level={2}
				weight="semibold"
				size={300}
				className={s.cardListHeading}
			>
				Your Bookmarks
			</Heading>
			<CardsGridList>
				{bookmarks?.length > 0 ? (
					bookmarks.map(renderBookmarkCard)
				) : (
					<BookmarksEmptyState />
				)}
			</CardsGridList>
		</div>
	)
}

ProfileBookmarksView.layout = BaseNewLayout
export default ProfileBookmarksView
