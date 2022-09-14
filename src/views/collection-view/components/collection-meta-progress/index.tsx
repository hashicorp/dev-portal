import { useMemo } from 'react'
import ButtonLink from 'components/button-link'
import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import { IconCheckCircleFill16 } from '@hashicorp/flight-icons/svg-react/check-circle-fill-16'
import { useCollectionProgress } from 'hooks/progress'
import { Collection as ClientCollection } from 'lib/learn-client/types'
import { parseCollectionProgress } from './helpers'
import ProgressBar from 'components/progress-bar'
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
	const {
		completedTutorialCount,
		isCompleted,
		isInProgress,
		statusLabel,
		tutorialCount,
		tutorialCta,
	} = useMemo(
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
			<div className={s.statusSection}>
				{isCompleted ? (
					<CompleteIconAndLabel statusLabel={statusLabel} />
				) : (
					<CountIconAndLabel statusLabel={statusLabel} />
				)}
				{isInProgress ? (
					<ProgressBar
						percentDone={(completedTutorialCount / tutorialCount) * 100}
					/>
				) : null}
			</div>
		</div>
	)
}

/**
 * Displays a green check icon, and a "complete" label.
 * Label text is set through `statusLabel`.
 */
function CompleteIconAndLabel({ statusLabel }: { statusLabel: string }) {
	return (
		<div className={s.completeIconAndLabel}>
			<IconCheckCircleFill16 className={s.completeIcon} />
			<div className={s.statusLabel}>{statusLabel}</div>
		</div>
	)
}

/**
 * Displays a "collection" icon, and "X/Y tutorials" label.
 * Label text is set through `statusLabel`.
 */
function CountIconAndLabel({ statusLabel }: { statusLabel: string }) {
	return (
		<div className={s.countIconAndLabel}>
			<IconCollections16 className={s.countIcon} />
			<div className={s.statusLabel}>{statusLabel}</div>
		</div>
	)
}

export default CollectionMetaProgress
