import { ReactElement } from 'react'
import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import { IconCheckCircleFill16 } from '@hashicorp/flight-icons/svg-react/check-circle-fill-16'
import ProgressBar from 'components/progress-bar'
import { CollectionProgressStatusSectionProps } from './types'
import s from './collection-progress-status-section.module.css'

/**
 * Renders collection progress status, in a nice little box.
 */
function CollectionProgressStatusSection(
	props: CollectionProgressStatusSectionProps
) {
	return (
		<div className={s.statusSectionWithBorder}>
			<CollectionProgressStatusElements {...props} />
		</div>
	)
}

/**
 * Renders the elements within the collection progress status section.
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
function CollectionProgressStatusElements({
	completedTutorialCount,
	tutorialCount,
	isInProgress,
}: CollectionProgressStatusSectionProps) {
	/**
	 * Completion status
	 */
	const isCompleted = completedTutorialCount == tutorialCount
	const hasProgress =
		typeof isInProgress == 'undefined'
			? completedTutorialCount > 0
			: isInProgress

	/**
	 * Status label
	 */
	let statusLabel: string
	if (isCompleted) {
		statusLabel = 'Complete'
	} else if (isInProgress) {
		statusLabel = `${completedTutorialCount}/${tutorialCount}`
	} else {
		statusLabel = `${tutorialCount} tutorial${tutorialCount == 1 ? '' : 's'}`
	}

	/**
	 * Status elements
	 */
	let statusElements: ReactElement
	if (isCompleted) {
		statusElements = <CompleteIconAndLabel statusLabel={statusLabel} />
	} else if (hasProgress) {
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
	return <div className={s.statusSectionElements}>{statusElements}</div>
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

export { CollectionProgressStatusElements, CollectionProgressStatusSection }
export default CollectionProgressStatusSection
