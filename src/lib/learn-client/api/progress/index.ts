import { TutorialIdCollectionId } from 'lib/learn-client/types'
import { getTutorialProgress } from './get-tutorial-progress'
import {
	parseTutorialProgress,
	progressLabelToPercent,
	progressPercentToLabel,
} from './formatting'
import {
	createTutorialProgress,
	CreateTutorialProgressOptions,
} from './create-tutorial-progress'
import {
	updateTutorialProgress,
	UpdateTutorialProgressOptions,
} from './update-tutorial-progress'
import { getAllProgress, GetAllProgressResult } from './get-all-progress'

export const PROGRESS_API_ROUTE = '/progress'
export const TUTORIAL_PROGRESS_ROUTE = ({
	collectionId,
	tutorialId,
}: TutorialIdCollectionId) =>
	`/collections/${collectionId}/tutorials/${tutorialId}/progress`

export type {
	CreateTutorialProgressOptions,
	GetAllProgressResult,
	UpdateTutorialProgressOptions,
}
export {
	createTutorialProgress,
	getAllProgress,
	getTutorialProgress,
	parseTutorialProgress,
	progressLabelToPercent,
	progressPercentToLabel,
	updateTutorialProgress,
}
