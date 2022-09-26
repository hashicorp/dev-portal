import { ReactNode } from 'react'
import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import { IconCheckCircleFill16 } from '@hashicorp/flight-icons/svg-react/check-circle-fill-16'
import ProgressBar from 'components/progress-bar'
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
}: {
	completedTutorialCount: number
	tutorialCount: number
	/**
	 * Optionally specify that the progress bar should be shown,
	 * even in cases where there are zero completed tutorials.
	 * Note that if all tutorials are completed, the progress
	 * bar will not be shown even if isInProgress is set to true.
	 */
	isInProgress?: boolean
}) {
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

	if (isCompleted) {
		return (
			<StatusSection>
				<CompleteIconAndLabel statusLabel={statusLabel} />
			</StatusSection>
		)
	} else if (hasProgress) {
		return (
			<StatusSection>
				<CountIconAndLabel statusLabel={statusLabel} />
				<ProgressBar
					percentDone={(completedTutorialCount / tutorialCount) * 100}
				/>
			</StatusSection>
		)
	} else {
		return (
			<StatusSection>
				<CountIconAndLabel statusLabel={statusLabel} />
			</StatusSection>
		)
	}
}

/**
 * Renders an box in which status information can be placed.
 */
function StatusSection({ children }: { children: ReactNode }) {
	return <div className={s.statusSection}>{children}</div>
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

export default CollectionProgressStatusSection
