import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAuthentication from 'hooks/use-authentication'
import {
	createTutorialProgress as createTutorialProgressApi,
	updateTutorialProgress as updateTutorialProgressApi,
} from 'lib/learn-client/api/progress'
import { progressPercentToLabel } from 'lib/learn-client/api/progress/formatting'
import {
	TutorialProgressMutationVariables,
	TutorialProgressMutationArgs,
	UseTutorialProgressMutationsResult,
} from './types'
import { ApiCollectionTutorialProgress } from 'lib/learn-client/api/api-types'
import { TUTORIAL_PROGRESS_QUERY_ID } from '..'

/**
 * Mutate tutorial progress.
 *
 * Returns `createTutorialProgress` and `updateTutorialProgress`
 * mutation functions.
 *
 * Each of these functions accepts a single object argument:
 * `{ tutorialId, collectionId, completePercent }` (and, optionally, `options`)
 * and creates or updates the tutorial with the provided completePercent.
 */
const useTutorialProgressMutations = (): UseTutorialProgressMutationsResult => {
	const queryClient = useQueryClient()
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

	/**
	 * When a mutation is successful, we set the associated query data.
	 * TODO: once there are other queries, we'll likely want to invalidate those.
	 */
	const makeOnMutationSuccess = () => {
		return (
			data: ApiCollectionTutorialProgress,
			mutationVariables: TutorialProgressMutationVariables
		) => {
			// Destructure the variables we need to update related queries
			const { tutorialId, collectionId } = mutationVariables
			queryClient.setQueryData(
				[TUTORIAL_PROGRESS_QUERY_ID, tutorialId, collectionId],
				data
			)
		}
	}

	/**
	 * Mutation to create tutorial progress.
	 */
	const createTutorialProgressMutation = useMutation(
		createTutorialProgressApi,
		{ onSuccess: makeOnMutationSuccess() }
	)
	/**
	 * Function to create tutorial progress.
	 *
	 * Note: The createTutorialProgress function needs to update when the
	 * accessToken or onSuccess option of createTutorialProgressMutation changes.
	 * We wrap this in useCallback to prevent more updates than necessary.
	 */
	const createTutorialProgress = useCallback(
		(args: TutorialProgressMutationArgs) => {
			const { tutorialId, collectionId, completePercent, options } = args
			createTutorialProgressMutation.mutate(
				{ accessToken, tutorialId, collectionId, completePercent },
				options
			)
		},
		[createTutorialProgressMutation, accessToken]
	)

	/**
	 * Mutation to update tutorial progress.
	 */
	const updateTutorialProgressMutation = useMutation(
		updateTutorialProgressApi,
		{
			onSuccess: makeOnMutationSuccess(),
		}
	)
	/**
	 * Function to update tutorial progress.
	 *
	 * Note: as with createTutorialProgress,
	 * we wrap this in useCallback to prevent more updates than necessary.
	 */
	const updateTutorialProgress = useCallback(
		(args: TutorialProgressMutationArgs) => {
			const { tutorialId, collectionId, completePercent, options } = args

			updateTutorialProgressMutation.mutate(
				{ accessToken, tutorialId, collectionId, completePercent },
				options
			)
		},
		[updateTutorialProgressMutation, accessToken]
	)

	/**
	 * Consumers likely only want to perform calculations in preparation to
	 * run these mutations if status is "idle" or "success". Otherwise,
	 * attempt to run the mutation may result in a continuous loop.
	 */
	const { status: createStatus } = createTutorialProgressMutation
	const { status: updateStatus } = updateTutorialProgressMutation
	const readyStatuses = ['idle', 'success']
	const isReady =
		readyStatuses.includes(createStatus) && readyStatuses.includes(updateStatus)

	return {
		createTutorialProgress,
		updateTutorialProgress,
		isReady,
	}
}

export type { TutorialProgressMutationArgs, UseTutorialProgressMutationsResult }
export { useTutorialProgressMutations }
