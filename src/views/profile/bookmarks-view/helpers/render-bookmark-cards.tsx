import { useState } from 'react'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { formatTutorialData } from 'lib/learn-client/api/tutorial/formatting'
import { ProductUsed } from 'lib/learn-client/types'
import { ApiBookmark } from 'lib/learn-client/api/api-types'
import TutorialCard from 'components/tutorial-card'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import { BookmarkButtonIconOnly } from 'components/bookmark-button'
import Dialog from 'components/dialog'

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
						<BookmarkButtonWithRemoveDialog />
					</>
				}
			/>
		</li>
	)
}

function BookmarkButtonWithRemoveDialog() {
	const [showDialog, setShowDialog] = useState(false)
	const openDialog = () => setShowDialog(true)
	const closeDialog = () => setShowDialog(false)

	return (
		<>
			<BookmarkButtonIconOnly isBookmarked={true} handleOnClick={openDialog} />
			<Dialog
				onDismiss={closeDialog}
				isOpen={showDialog}
				label="Confirm remove bookmark"
			>
				<h1>hello! do you really want to unbookmark?</h1>
			</Dialog>
		</>
	)
}
