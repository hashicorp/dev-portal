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
export * from './formatting'

/**
 * Used in get-all-progress.
 */
export const PROGRESS_API_ROUTE = '/progress'
import { getProgress, GetProgressResult } from './get-progress'

export type {
	CreateTutorialProgressOptions,
	GetProgressResult,
	GetTutorialProgressResult,
	UpdateTutorialProgressOptions,
}

export {
	createTutorialProgress,
	getProgress,
	getTutorialProgress,
	updateTutorialProgress,
}
