import { ReactElement, ReactNode } from 'react'
import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import { IconCheckCircleFill16 } from '@hashicorp/flight-icons/svg-react/check-circle-fill-16'
import ProgressBar from 'components/progress-bar'
import { CollectionProgressStatusSectionProps } from './types'
import s from './collection-progress-status-section.module.css'

/**
 * Renders collection progress status, in a nice little box.
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
function CollectionProgressStatusSection({
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
	 * Render, with a border and padding.
	 */
	return (
		<div className={s.statusSectionWithBorder}>
			<StatusSectionElements>{statusElements}</StatusSectionElements>
		</div>
	)
}

/**
 * Get an appropriate status label for the current collection progress
 */
function getStatusLabel({
	completedTutorialCount,
	tutorialCount,
	isInProgress,
	isCompleted,
}: CollectionProgressStatusSectionProps & { isCompleted: boolean }) {
	let statusLabel: string
	if (isCompleted) {
		statusLabel = 'Complete'
	} else if (isInProgress) {
		statusLabel = `${completedTutorialCount}/${tutorialCount}`
	} else {
		statusLabel = `${tutorialCount} tutorial${tutorialCount == 1 ? '' : 's'}`
	}
	return statusLabel
}

/**
 * Renders CollectionProgress elements, wrapped in a flex container.
 * This positions elements consistently, but does not product padding or border.
 */
function StatusSectionElements({ children }: { children: ReactNode }) {
	return <div className={s.statusSectionElements}>{children} </div>
}

/**
 * Displays a green check icon, and a "complete" label.
 * Label text is set through `statusLabel`.
 */
function CompleteIconAndLabel({ statusLabel }: { statusLabel: string }) {
	return (
		<div className={s.completeIconAndLabel}>
			<CompleteIcon />
			<div className={s.statusLabel}>{statusLabel}</div>
		</div>
	)
}

/**
 * Displays a circle check icon, styled for composition in CollectionProgress
 */
function CompleteIcon() {
	return <IconCheckCircleFill16 className={s.completeIcon} />
}

/**
 * Displays a "collection" icon, and "X/Y tutorials" label.
 * Label text is set through `statusLabel`.
 */
function CountIconAndLabel({ statusLabel }: { statusLabel: string }) {
	return (
		<div className={s.countIconAndLabel}>
			<CountIcon />
			<div className={s.statusLabel}>{statusLabel}</div>
		</div>
	)
}

/**
 * Displays a collections icon, styled for composition in CollectionProgress
 */
function CountIcon() {
	return <IconCollections16 className={s.countIcon} />
}

export {
	CollectionProgressStatusSection,
	CountIconAndLabel,
	CountIcon,
	CompleteIconAndLabel,
	getStatusLabel,
	StatusSectionElements,
}
export default CollectionProgressStatusSection
