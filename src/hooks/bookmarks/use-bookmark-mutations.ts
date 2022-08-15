import { useMutation, useQueryClient } from '@tanstack/react-query'
import { developmentToast, ToastColor } from 'components/toast'
import useAuthentication from 'hooks/use-authentication'
import { ApiTutorial } from 'lib/learn-client/api/api-types'
import { createBookmark, deleteBookmark } from 'lib/learn-client/api/bookmark'
import { useCallback } from 'react'

interface UseBookmarkMutationsResult {
	addBookmark: (tutorialId: ApiTutorial['id']) => void
	removeBookmark: (tutorialId: ApiTutorial['id']) => void
}

/**
 * @TODO document
 */
const useBookmarkMutations = (): UseBookmarkMutationsResult => {
	const queryClient = useQueryClient()
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

	/**
	 * Set up `onSuccess` callback for mutations.
	 */
	const onMutationSuccess = (_, variables) => {
		queryClient.invalidateQueries({
			predicate: ({ queryKey }) => {
				if (queryKey.length === 1 && queryKey[0] === 'bookmarks') {
					return true
				}

				if (
					queryKey.length === 2 &&
					queryKey[0] === 'bookmark' &&
					queryKey[1] === variables.tutorialId
				) {
					return true
				}

				return false
			},
		})
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
		(tutorialId: ApiTutorial['id']) => {
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
		(tutorialId: ApiTutorial['id']) => {
			removeBookmarkMutation.mutate({ accessToken, tutorialId })
		},
		[accessToken, removeBookmarkMutation]
	)

	return { addBookmark, removeBookmark }
}

export type { UseBookmarkMutationsResult }
export { useBookmarkMutations }
