import { useMemo, ReactElement } from 'react'
import { useCollectionProgress } from 'hooks/progress'
import { parseCollectionProgress } from 'components/collection-progress-group'
import ProgressBar from 'components/progress-bar'
import {
	CompleteIconAndLabel,
	CountIconAndLabel,
	CountIcon,
	getStatusLabel,
	StatusSectionElements,
} from 'components/collection-progress-group/components'
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
				<CollectionCardStatusElements
					completedTutorialCount={completedTutorialCount}
					tutorialCount={tutorialCount}
					isInProgress={isInProgress}
				/>
			}
		/>
	)
}

/**
* Display collection progress status on a collection card.

* Without authentication,
* we show a collection icon, and the count of tutorials in the collection.
*
* When authenticated and one or more tutorials in the collection is "complete",
* we show a collection icon and a progress bar.
*
* When authenticated and all tutorials in the collection are "complete",
* we show a collection icon and a green check icon.
*
* Note: this is nearly the same as CollectionCardStatusSection, except:
* - it has no "surface" styling (no border) and no padding
* - in "complete" state, it displays a "collection" and "check" icon
*/
function CollectionCardStatusElements({
	completedTutorialCount,
	tutorialCount,
	isInProgress,
}: {
	completedTutorialCount: number
	tutorialCount: number
	isInProgress: boolean
}) {
	/**
	 * Completion status
	 */
	const isCompleted = completedTutorialCount == tutorialCount

	/**
	 * Status label
	 */
	const statusLabel = getStatusLabel({
		completedTutorialCount,
		tutorialCount,
		isInProgress,
		isCompleted,
	})

	/**
	 * Status elements
	 */
	let statusElements: ReactElement
	if (isCompleted) {
		statusElements = (
			<div className={s.completeIcons} aria-label={statusLabel}>
				<CountIcon />
				{/* Note: nbsp used here to ensure consistent height with
				    similar components that do include visible text. */}
				<CompleteIconAndLabel statusLabel="&nbsp;" />
			</div>
		)
	} else if (isInProgress) {
		statusElements = (
			<>
				<CountIconAndLabel statusLabel={statusLabel} />
				<ProgressBar
					percentDone={(completedTutorialCount / tutorialCount) * 100}
				/>
			</>
		)
	} else {
		statusElements = <CountIconAndLabel statusLabel={statusLabel} />
	}

	/**
	 * Render, wrapped in a flex container
	 */
	return <StatusSectionElements>{statusElements}</StatusSectionElements>
}

export default CollectionCardWithAuthElements
