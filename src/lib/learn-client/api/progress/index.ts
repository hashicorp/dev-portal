// Fetch
import {
	getTutorialProgress,
	GetTutorialProgressResult,
} from './get-tutorial-progress'
// Create
import {
	createTutorialProgress,
	CreateTutorialProgressOptions,
} from './create-tutorial-progress'
// Update
import {
	updateTutorialProgress,
	UpdateTutorialProgressOptions,
} from './update-tutorial-progress'
// Formatting
import { progressStatusToPercent, progressPercentToStatus } from './formatting'

/**
 * Used in get-all-progress.
 */
export const PROGRESS_API_ROUTE = '/progress'

export type {
	CreateTutorialProgressOptions,
	GetTutorialProgressResult,
	UpdateTutorialProgressOptions,
}

export {
	createTutorialProgress,
	getTutorialProgress,
	progressStatusToPercent,
	progressPercentToStatus,
	updateTutorialProgress,
}
