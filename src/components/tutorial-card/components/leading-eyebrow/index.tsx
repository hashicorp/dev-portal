import { TutorialProgressStatus } from 'lib/learn-client/types'
import s from './leading-eyebrow.module.css'

/**
 * Displays the duration of the tutorial, or instead, will
 * display progress status if it is available and meaningful.
 */
function LeadingEyebrow({
	tutorialProgressStatus,
	duration,
}: {
	tutorialProgressStatus: TutorialProgressStatus
	duration: string
}) {
	// Determine whether to display progress status
	const isProgressLoaded = typeof tutorialProgressStatus !== 'undefined'
	const hasMeaningfulProgress = ['in_progress', 'complete'].includes(
		tutorialProgressStatus
	)
	const shouldShowProgress = isProgressLoaded && hasMeaningfulProgress

	// Render either the progress icon and label, or the duration
	if (shouldShowProgress) {
		return (
			<span className={s.progressStatus}>STATUS:{tutorialProgressStatus}</span>
		)
	} else {
		return <span>{duration}</span>
	}
}

export { LeadingEyebrow }
