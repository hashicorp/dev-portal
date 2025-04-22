/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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

/**
 * Mutation function for adding a bookmark for a given `tutorialId`. The
 * `options` object is passed directly to the underlying `mutate` function. This
 * object should be used to trigger component-specific side effects.
 *
 * Note: if a mutation callback like `onSuccess` is passed in the `options`
 * object, React Query triggers it _after_ the "global" one passed to
 * `useMutation` in `useBookmarkMutations`.
 *
 * ref: https://tanstack.com/query/v4/docs/guides/mutations
 */
type AddBookmark = (
	tutorialId: Tutorial['id'],
	options?: MutationOptions<ApiBookmark>
) => void

/**
 * Mutation function for removing a bookmark for a given `tutorialId`. The
 * `options` object is passed directly to the underlying `mutate` function. This
 * object should be used to trigger component-specific side effects.
 *
 * Note: if a mutation callback like `onSuccess` is passed in the `options`
 * object, React Query triggers it _after_ the "global" one passed to
 * `useMutation` in `useBookmarkMutations`.
 *
 * ref: https://tanstack.com/query/v4/docs/guides/mutations
 */
type RemoveBookmark = (
	tutorialId: Tutorial['id'],
	options?: MutationOptions<ApiBookmark>
) => void

interface UseBookmarkMutationsResult {
	addBookmark: AddBookmark
	removeBookmark: RemoveBookmark
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
		return (error: Error) => {
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
