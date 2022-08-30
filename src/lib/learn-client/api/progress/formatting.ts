import { ApiCollectionTutorialProgress } from 'lib/learn-client/api/api-types'
import {
	TutorialProgressLabel,
	TutorialProgressPercent,
	uuid,
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
	} else if (progressState === TutorialProgressLabel.visited) {
		return TutorialProgressPercent.Zero
	} else {
		return TutorialProgressPercent.Fifty
	}
}

/**
 * Given an array of progress records, which should correspond to
 * only a specific tutorial ID,
 *
 * Return the progress for the tutorialId in a specific collection
 * context. May be no progress, even if the tutorialId in question
 * has been progressed in some other collection context
 */
export function parseTutorialProgress(
	data: ApiCollectionTutorialProgress[],
	targetTutorialId: uuid,
	targetCollectionId: uuid
): TutorialProgressLabel | null {
	// Find the tutorial match in this specific context
	const match = data.filter(
		(r) =>
			r.tutorial_id == targetTutorialId && r.collection_id == targetCollectionId
	)
	console.log({ match })
	// If we have a match, return the progress state. If not, return lowest state.
	if (match.length) {
		const { complete_percent } = match[0]
		return progressPercentToLabel(complete_percent)
	} else {
		return null
	}
}

/**
 * Given an array of progress records,
 * Return the best progress found for that tutorialId in any collection context.
 */
export function parseCollectionProgress(
	data: ApiCollectionTutorialProgress[]
): number {
	// Filter for records associated with this collection
	const completedTutorials = data.filter(
		(record: ApiCollectionTutorialProgress) => record.complete_percent == '100'
	)
	// Return the count of completed tutorials
	return completedTutorials.length
}

/**
 * Group an array of object records by a particular key.
 */
export function groupRecordsByKey(
	data: ApiCollectionTutorialProgress[],
	groupByKey: string
) {
	return data.reduce((acc, record) => {
		const key = record[groupByKey]
		if (!acc[key]) {
			acc[key] = []
		}
		acc[key].push(record)
		return acc
	}, {})
}
