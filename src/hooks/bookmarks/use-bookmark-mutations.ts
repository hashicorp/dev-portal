import { useCallback } from 'react'
import {
	MutationOptions,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { developmentToast, ToastColor } from 'components/toast'
import { Tutorial } from 'lib/learn-client/types'
import { ApiBookmark } from 'lib/learn-client/api/api-types'
import useAuthentication from 'hooks/use-authentication'
import {
	createBookmark,
	CreateBookmarkOptions,
	deleteBookmark,
	DeleteBookmarkOptions,
} from 'lib/learn-client/api/bookmark'

interface UseBookmarkMutationsResult {
	addBookmark: (
		tutorialId: Tutorial['id'],
		options?: MutationOptions<ApiBookmark>
	) => void
	removeBookmark: (
		tutorialId: Tutorial['id'],
		options?: MutationOptions<ApiBookmark>
	) => void
}

/**
 * Handles creating the mutations methods for adding and removing bookmarks with
 * React Query. Returns one callback for each mutation.
 */
const useBookmarkMutations = (): UseBookmarkMutationsResult => {
	const queryClient = useQueryClient()
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

	/**
	 * Set up `onSuccess` callback for the create/delete mutations.
	 */
	const makeOnMutationSuccess = (mutationType: 'add' | 'remove') => {
		return (
			_,
			mutationVariables: CreateBookmarkOptions | DeleteBookmarkOptions
		) => {
			// Pull the modified bookmark's `tutorialId`
			const mutatedTutorialId = mutationVariables.tutorialId

			// Determine if the tutorial is now bookmarked
			let isNowBookmarked = false
			if (mutationType === 'add') {
				isNowBookmarked = true
			}

			// Update/create the `isBookmarked` cache entry for this tutorial id
			queryClient.setQueryData(
				['isBookmarked', mutatedTutorialId],
				isNowBookmarked
			)

			// Invalidate `bookmarks` so they're refetched in the background
			queryClient.invalidateQueries(['bookmarks'])
		}
	}

	// TODO expose an new error object in the bookmark API functions
	const makeOnError = (method: 'addBookmark' | 'removeBookmark') => {
		return (error: $TSFixMe) => {
			if (error.message === '401 Unauthorized') {
				developmentToast({
					color: ToastColor.critical,
					title: 'TODO',
					description: `Show a modal on \`${method}\` if not authenticated`,
				})
			}
		}
	}

	/**
	 * Set up `addBookmark` callback.
	 */
	const addBookmarkMutation = useMutation(createBookmark, {
		onSuccess: makeOnMutationSuccess('add'),
		onError: makeOnError('addBookmark'),
	})
	const addBookmark = useCallback(
		(tutorialId, options = {}) => {
			addBookmarkMutation.mutate({ accessToken, tutorialId }, options)
		},
		[addBookmarkMutation, accessToken]
	)

	/**
	 * Set up `removeBookmark` callback.
	 */
	const removeBookmarkMutation = useMutation(deleteBookmark, {
		onSuccess: makeOnMutationSuccess('remove'),
		onError: makeOnError('removeBookmark'),
	})
	const removeBookmark = useCallback(
		(tutorialId, options = {}) => {
			removeBookmarkMutation.mutate({ accessToken, tutorialId }, options)
		},
		[accessToken, removeBookmarkMutation]
	)

	return { addBookmark, removeBookmark }
}

export type { UseBookmarkMutationsResult }
export { useBookmarkMutations }
