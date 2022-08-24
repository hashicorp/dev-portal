import { getTutorialSlug } from 'views/collection-view/helpers'
import { formatTutorialData } from 'lib/learn-client/api/tutorial/formatting'
import { ProductUsed } from 'lib/learn-client/types'
import { ApiBookmark } from 'lib/learn-client/api/api-types'
import TutorialCard from 'components/tutorial-card'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import { BookmarkButtonIconOnly } from 'components/bookmark-button'

/**
 * TODO: the bookmark button `handleClick` should
 * render a confirmation dialog that can update data
 */

export default function renderBookmarkCard(bookmark: ApiBookmark) {
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
	const duration = getReadableTime(readTime)
	return (
		<li key={id}>
			<TutorialCard
				heading={name}
				description={description}
				url={getTutorialSlug(slug, collectionCtx.default.slug)}
				duration={duration}
				hasInteractiveLab={Boolean(handsOnLab)}
				hasVideo={Boolean(video)}
				productsUsed={productsUsed.map((p: ProductUsed) => p.product.slug)}
				eyebrowSlot={
					<>
						<span>{duration}</span>
						<BookmarkButtonIconOnly
							isBookmarked={true}
							handleOnClick={() => console.log('Trigger confirmation dialog!')}
						/>
					</>
				}
			/>
		</li>
	)
}
