import { useMemo } from 'react'
import { useCollectionProgress } from 'hooks/progress'
import {
	CollectionProgressStatusElements,
	parseCollectionProgress,
} from 'components/collection-progress-group'
import CollectionCard, {
	CollectionCardPropsWithId,
} from 'components/collection-card'
import s from './with-auth-elements.module.css'

/**
 * Displays a collection card, with progress elements where possible.
 *
 * Works without authentication enabled, displaying a tutorial count
 * similar to the tutorial count displayed on plain collection cards.
 *
 * With authentication enabled, for authenticated users with progress,
 * we display a progress bar or "complete" at the top of the card.
 */
function CollectionCardWithAuthElements({
	id,
	dbSlug,
	url,
	logo,
	tutorialCount,
	heading,
	description,
	productsUsed,
}: Omit<CollectionCardPropsWithId, 'eyebrowSlot'>) {
	const slug = dbSlug
	/**
	 * Get collection progress, which affects the
	 * CTA bar we display for the collection.
	 */
	const { data: progressData } = useCollectionProgress({ collectionId: id })

	/**
	 * Parse the progress-related information we need from the progress records,
	 * current collection slug, and list of tutorials in this collection.
	 */
	const { completedTutorialCount, isInProgress } = useMemo(
		() => parseCollectionProgress(progressData, tutorialCount, { id, slug }),
		[progressData, tutorialCount, id, slug]
	)

	return (
		<CollectionCard
			{...{ url, logo, tutorialCount, heading, description, productsUsed }}
			eyebrowSlot={
				<div className={s.collectionProgressContainer}>
					<CollectionProgressStatusElements
						completedTutorialCount={completedTutorialCount}
						tutorialCount={tutorialCount}
						isInProgress={isInProgress}
					/>
				</div>
			}
		/>
	)
}

export default CollectionCardWithAuthElements
