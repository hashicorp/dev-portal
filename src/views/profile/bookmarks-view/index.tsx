import { useAllBookmarks } from 'hooks/bookmarks'
import BaseNewLayout from 'layouts/base-new'
import AuthenticatedView from 'views/authenticated-view'
import { formatTutorialData } from 'lib/learn-client/api/tutorial/formatting'
import { ProductUsed } from 'lib/learn-client/types'
import { TutorialCardWithBookmark } from 'components/tutorial-card'
import { getTutorialSlug } from 'views/collection-view/helpers'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import { ApiBookmark } from 'lib/learn-client/api/api-types'
import CardsGridList from 'components/cards-grid-list'

/**
 * get all bookmarks,
 * that will have the tutorial data
 * format the tutorial data to render the cards
 */

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
	const { bookmarks, isLoading } = useAllBookmarks({ enabled: true })

	if (isLoading) {
		return null // TODO return loading skeleton
	}

	return (
		<div style={{ padding: 24 }}>
			<h2>Bookmarks</h2>
			<CardsGridList isOrdered={false}>
				{bookmarks?.map((bookmark: ApiBookmark) => {
					const {
						id,
						slug,
						description,
						readTime,
						handsOnLab,
						video,
						name,
						collectionCtx,
						productsUsed,
					} = formatTutorialData(bookmark.tutorial)
					return (
						<li key={id}>
							<TutorialCardWithBookmark
								id={id}
								heading={name}
								description={description}
								url={getTutorialSlug(slug, collectionCtx.default.slug)}
								duration={getReadableTime(readTime)}
								hasInteractiveLab={Boolean(handsOnLab)}
								hasVideo={Boolean(video)}
								productsUsed={productsUsed.map(
									(p: ProductUsed) => p.product.slug
								)}
							/>
						</li>
					)
				})}
			</CardsGridList>
		</div>
	)
}

ProfileBookmarksView.layout = BaseNewLayout
export default ProfileBookmarksView
