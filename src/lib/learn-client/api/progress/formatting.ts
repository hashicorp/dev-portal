import {
	TutorialProgressStatus,
	TutorialProgressPercent,
} from 'lib/learn-client/types'

/**
 * Convert from API's complete_percent to the TutorialProgressStatus enum.
 *
 * This is necessary as in the context of Dev Dot, we want the label,
 * but in the context of the Learn API, we want complete_percent.
 */
export function progressPercentToStatus(
	percent: TutorialProgressPercent
): TutorialProgressStatus {
	if (percent === '100') {
		return TutorialProgressStatus.complete
	} else if (percent === '0') {
		return TutorialProgressStatus.visited
	} else {
		return TutorialProgressStatus.in_progress
	}
}

/**
 * Convert from the TutorialProgressStatus enum to the API complete_percent
 *
 * This is necessary as in the context of Dev Dot, we want the label,
 * but in the context of the Learn API, we want complete_percent.
 */
export function progressStatusToPercent(
	progressState: TutorialProgressStatus
): TutorialProgressPercent {
	if (progressState === TutorialProgressStatus.complete) {
		return TutorialProgressPercent.OneHundred
	} else if (progressState === TutorialProgressStatus.in_progress) {
		return TutorialProgressPercent.Fifty
	} else {
		return TutorialProgressPercent.Zero
	}
}

/**
 * Map TutorialProgressStatus to text for display use.
 */
const progressLabels: Record<TutorialProgressStatus, string> = {
	visited: 'Visited',
	in_progress: 'In progress',
	complete: 'Complete',
}

/**
 * Given a TutorialProgressStatus,
 * Returns text representing the status suitable for display.
 */
export function progressStatusToLabel(
	progressState: TutorialProgressStatus
): string {
	return progressLabels[progressState]
}

/**
 * Map TutorialProgressStatus to text for screen reader use.
 */
const progressAriaLabels: Record<TutorialProgressStatus, string> = {
	visited: 'Tutorial is visited.',
	in_progress: 'Tutorial is in progress.',
	complete: 'Tutorial is complete.',
}

/**
 * Given a TutorialProgressStatus,
 * Returns text representing the status suitable for screen reader use.
 */
export function progressStatusToAriaLabel(
	progressState: TutorialProgressStatus
): string {
	return progressAriaLabels[progressState]
}
