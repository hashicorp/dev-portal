import {
	TutorialProgressLabel,
	TutorialProgressPercent,
} from 'lib/learn-client/types'

/**
 * Convert from API's complete_percent to the TutorialProgressLabel enum.
 *
 * This is necessary as in the context of Dev Dot, we want the label,
 * but in the context of the Learn API, we want complete_percent.
 */
export function progressPercentToLabel(
	percent: TutorialProgressPercent
): TutorialProgressLabel {
	if (percent === '100') {
		return TutorialProgressLabel.complete
	} else if (percent === '0') {
		return TutorialProgressLabel.visited
	} else {
		return TutorialProgressLabel.in_progress
	}
}

/**
 * Convert from the TutorialProgressLabel enum to the API complete_percent
 *
 * This is necessary as in the context of Dev Dot, we want the label,
 * but in the context of the Learn API, we want complete_percent.
 */
export function progressLabelToPercent(
	progressState: TutorialProgressLabel
): TutorialProgressPercent {
	if (progressState === TutorialProgressLabel.complete) {
		return TutorialProgressPercent.OneHundred
	} else if (progressState === TutorialProgressLabel.in_progress) {
		return TutorialProgressPercent.Fifty
	} else {
		return TutorialProgressPercent.Zero
	}
}
