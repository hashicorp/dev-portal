import { ApiBookmark } from 'lib/learn-client/api/api-types'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import { getTutorialSlug } from 'views/collection-view/helpers'
import CardsGridList from 'components/cards-grid-list'
import TutorialCard from 'components/tutorial-card'

interface BookmarksListProps {
	bookmarks: Array<ApiBookmark>
}

export default function BookmarksList({ bookmarks }: BookmarksListProps) {
	return (
		<CardsGridList>
			{bookmarks.map((bookmark) => {
				return (
					<li key={bookmark.id}>
						<TutorialCard
							url={getTutorialSlug(
								bookmark.tutorial.slug,
								bookmark.tutorial.default_collection.slug
							)}
							duration={getReadableTime(bookmark.tutorial.read_time)}
							heading={bookmark.tutorial.name}
							description={bookmark.tutorial.description}
							productsUsed={bookmark.tutorial.products_used.map(
								(p) => p.product.slug
							)}
							hasVideo={Boolean(bookmark.tutorial.video_id)}
							hasInteractiveLab={Boolean(bookmark.tutorial.hands_on_lab_id)}
						/>
					</li>
				)
			})}
		</CardsGridList>
	)
}
