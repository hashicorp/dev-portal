import { useMemo } from 'react'
import ButtonLink from 'components/button-link'
import { useCollectionProgress } from 'hooks/progress'
import { Collection as ClientCollection } from 'lib/learn-client/types'
import {
	CollectionProgressStatusSection,
	parseCollectionProgress,
} from 'components/collection-progress-group'
import s from './collection-meta-progress.module.css'

/**
 * Displays collection progress status and CTA.
 *
 * Without authentication,
 * we show a "Start" CTA which links to the first tutorial in the collection.
 *
 * When authenticated and one or more tutorials in the collection is "complete",
 * we show a "Continue" CTA which links to the next not-"complete" tutorial,
 * as well as a progress bar based on the count of tutorials done.
 *
 * When authenticated and all tutorials in the collection are "complete",
 * we show a "Review" CTA which links to the first tutorial in the collection.
 */
function CollectionMetaProgress({
	collection,
}: {
	collection: ClientCollection
}) {
	const { id, slug, tutorials } = collection

	/**
	 * Get collection progress, which affects the
	 * CTA bar we display for the collection.
	 */
	const { data: progressData } = useCollectionProgress({ collectionId: id })

	/**
	 * Parse the progress-related information we need from the progress records,
	 * current collection slug, and list of tutorials in this collection.
	 */
	const { completedTutorialCount, isInProgress, tutorialCount, tutorialCta } =
		useMemo(
			() => parseCollectionProgress(progressData, tutorials, { id, slug }),
			[progressData, tutorials, id, slug]
		)

	return (
		<div className={s.root}>
			<ButtonLink
				aria-label={tutorialCta.ariaLabel}
				href={tutorialCta.href}
				text={tutorialCta.text}
			/>
			<CollectionProgressStatusSection
				completedTutorialCount={completedTutorialCount}
				tutorialCount={tutorialCount}
				isInProgress={isInProgress}
			/>
		</div>
	)
}

export default CollectionMetaProgress
