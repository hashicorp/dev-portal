import { MutateOptions } from '@tanstack/react-query'
import {
	Collection,
	Tutorial,
	TutorialProgressPercent,
} from 'lib/learn-client/types'
import { ApiCollectionTutorialProgress } from 'lib/learn-client/api/api-types'
import {
	CreateTutorialProgressOptions,
	UpdateTutorialProgressOptions,
} from 'lib/learn-client/api/progress'

/**
 * The mutation variable type is used for mutations and their callbacks.
 */
export type TutorialProgressMutationVariables =
	| CreateTutorialProgressOptions
	| UpdateTutorialProgressOptions

/**
 * The arguments object accepted by either of the
 * `createTutorialProgress` & `updateTutorialProgress` mutations
 */
export interface TutorialProgressMutationArgs {
	tutorialId: Tutorial['id']
	collectionId: Collection['id']
	completePercent: TutorialProgressPercent
	options?: MutateOptions<
		ApiCollectionTutorialProgress,
		unknown,
		TutorialProgressMutationVariables
	>
}

/**
 * The functions we return as a result of calling
 * useTutorialProgressMutations().
 */
export interface UseTutorialProgressMutationsResult {
	createTutorialProgress: (args: TutorialProgressMutationArgs) => void
	updateTutorialProgress: (args: TutorialProgressMutationArgs) => void
	isReady: boolean
}
