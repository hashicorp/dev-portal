import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { developmentToast, ToastColor } from 'components/toast'
import { Tutorial } from 'lib/learn-client/types'
import useAuthentication from 'hooks/use-authentication'
import {
	createBookmark,
	CreateBookmarkOptions,
	CreateBookmarkResult,
	deleteBookmark,
	DeleteBookmarkOptions,
	DeleteBookmarkResult,
} from 'lib/learn-client/api/bookmark'

interface UseBookmarkMutationsResult {
	addBookmark: (tutorialId: Tutorial['id']) => void
	removeBookmark: (tutorialId: Tutorial['id']) => void
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
	const onMutationSuccess = (
		mutationResult: CreateBookmarkResult | DeleteBookmarkResult,
		mutationVariables: CreateBookmarkOptions | DeleteBookmarkOptions
	) => {
		// Pull the modified bookmark's `tutorialId`
		const mutatedTutorialId = mutationVariables.tutorialId

		// `removeBookmark` returns `undefined`; we can tell which mutation occurred
		const wasRemoveMutation = mutationResult === undefined
		const isNowBookmarked = wasRemoveMutation ? false : true

		// Flip the `isBookmarked` value for this `tutorialId`
		queryClient.setQueryData(
			['isBookmarked', mutatedTutorialId],
			isNowBookmarked
		)

		// Invalidate `bookmarks` so they're refetched in the background
		queryClient.invalidateQueries(['bookmarks'])
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
		onSuccess: onMutationSuccess,
		onError: makeOnError('addBookmark'),
	})
	const addBookmark = useCallback(
		(tutorialId: Tutorial['id']) => {
			addBookmarkMutation.mutate({
				accessToken,
				tutorialId,
			})
		},
		[addBookmarkMutation, accessToken]
	)

	/**
	 * Set up `removeBookmark` callback.
	 */
	const removeBookmarkMutation = useMutation(deleteBookmark, {
		onSuccess: onMutationSuccess,
		onError: makeOnError('removeBookmark'),
	})
	const removeBookmark = useCallback(
		(tutorialId: Tutorial['id']) => {
			removeBookmarkMutation.mutate({ accessToken, tutorialId })
		},
		[accessToken, removeBookmarkMutation]
	)

	return { addBookmark, removeBookmark }
}

export type { UseBookmarkMutationsResult }
export { useBookmarkMutations }
