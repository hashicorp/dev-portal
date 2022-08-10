import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiTutorial } from 'lib/learn-client/api/api-types'
import { createBookmark, deleteBookmark } from 'lib/learn-client/api/bookmark'
import useAuthentication from '../use-authentication'

const useMutateBookmark = () => {
	const queryClient = useQueryClient()
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

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

	/**
	 * Set up `addBookmark` callback.
	 */
	const addBookmarkMutation = useMutation(createBookmark, {
		onSuccess: onMutationSuccess,
	})
	const addBookmark = useCallback(
		(tutorialId: ApiTutorial['id']) => {
			addBookmarkMutation.mutate({ tutorialId, accessToken })
		},
		[addBookmarkMutation, accessToken]
	)

	/**
	 * Set up `removeBookmark` callback.
	 */
	const removeBookmarkMutation = useMutation(deleteBookmark, {
		onSuccess: onMutationSuccess,
	})
	const removeBookmark = useCallback(
		(tutorialId: ApiTutorial['id']) => {
			removeBookmarkMutation.mutate({ tutorialId, accessToken })
		},
		[removeBookmarkMutation, accessToken]
	)

	return { addBookmark, removeBookmark }
}

export { useMutateBookmark }
