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
import { getAllProgress, GetAllProgressResult } from './get-all-progress'

export type {
	CreateTutorialProgressOptions,
	GetAllProgressResult,
	GetTutorialProgressResult,
	UpdateTutorialProgressOptions,
}

export {
	createTutorialProgress,
	getAllProgress,
	getTutorialProgress,
	progressStatusToPercent,
	progressPercentToStatus,
	updateTutorialProgress,
}
