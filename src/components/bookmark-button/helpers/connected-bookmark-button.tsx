/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback, useState } from 'react'
import useAuthentication from 'hooks/use-authentication'
import { useBookmarkMutations, useIsBookmarked } from 'hooks/bookmarks'
import Dialog from 'components/dialog'
import { BookmarkButtonProps, ConnectedBookmarkComponentProps } from '../types'
import BookmarkSignInPrompt from '../sign-in-dialog'
import makeBookmarkToast from '../toast/make-bookmark-toast'

/**
 * This HOC serves as a 'controller'
 * for rendering the various state of bookmark
 * interaction. It accepts a UI component to render and
 * fetches the tutorial bookmark state.
 *
 * When clicked, it renders a dialog if unauthenticated,
 * and updates data when authenticated.
 */

export function Connected(BookmarkComponent: React.FC<BookmarkButtonProps>) {
	return function ConnectedBookmarkComponent({
		tutorial,
	}: ConnectedBookmarkComponentProps) {
		const { isAuthenticated, signIn } = useAuthentication()
		const { isBookmarked } = useIsBookmarked({ tutorialId: tutorial.id })
		const { addBookmark, removeBookmark } = useBookmarkMutations()
		const [showDialog, setShowDialog] = useState(false)
		const openDialog = () => setShowDialog(true)
		const closeDialog = () => setShowDialog(false)

		const handleOnClick = useCallback(() => {
			if (!isAuthenticated) {
				openDialog()
				return
			}

			if (isBookmarked) {
				removeBookmark(tutorial.id, {
					onSuccess: () => makeBookmarkToast('remove', tutorial.name),
				})
			} else {
				addBookmark(tutorial.id, {
					onSuccess: () => makeBookmarkToast('add', tutorial.name),
				})
			}
		}, [
			addBookmark,
			isAuthenticated,
			isBookmarked,
			removeBookmark,
			tutorial.id,
			tutorial.name,
		])

		return (
			<>
				<BookmarkComponent
					handleOnClick={handleOnClick}
					isBookmarked={isBookmarked}
				/>
				<Dialog
					onDismiss={closeDialog}
					isOpen={showDialog}
					label="Sign in to bookmark"
				>
					<BookmarkSignInPrompt
						onDismiss={closeDialog}
						signIn={() => signIn()}
					/>
				</Dialog>
			</>
		)
	}
}
