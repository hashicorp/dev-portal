/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback, useEffect, useRef } from 'react'
import { IconSignIn16 } from '@hashicorp/flight-icons/svg-react/sign-in-16'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import { AuthErrors } from 'types/auth'
import useAuthentication from 'hooks/use-authentication'
import Button from 'components/button'
import Dialog from 'components/dialog'
import Text from 'components/text'
import s from './authentication-error-dialog.module.css'

/**
 * A dialog that renders for `AuthErrors.RefreshAccessTokenError` errors.
 * Provides an option for users to sign in again. When dismissed, automatically
 * signs the user out.
 */
const AuthenticationErrorDialog = () => {
	const closeButtonRef = useRef<HTMLButtonElement>()
	const { session, signIn, signOut } = useAuthentication()
	const isRefreshAccessTokenError =
		session?.error === AuthErrors.RefreshAccessTokenError
	const label = 'Are you still there?'

	/**
	 * @TODO uncomment when the events have been architected
	 */
	// useEffect(() => {
	// 	if (isRefreshAccessTokenError) {
	// 		safeAnalyticsTrack('AuthenticationErrorDialog rendered', {
	// 			error,
	// 		})
	// 	}
	// }, [error, isRefreshAccessTokenError])

	/**
	 * Set up callback for when the dialog is dismissed. Tracks an analytics event
	 * and signs the user out.
	 *
	 * @NOTE The dismissEvent variable can be multiple types of events, but
	 * Reach's DialogProps only specifies MouseEvent. Probably better to replace
	 * Reach Dialog with our custom build when the HDS Modal component is stable,
	 * rather than mess with the TypeScript.
	 */
	const handleDismiss = useCallback(
		// TODO: this can be a click or keydown event
		(dismissEvent: React.MouseEvent | React.KeyboardEvent) => {
			/**
			 * @TODO uncomment when the events have been architected
			 */
			// const methodOfDismissal = guessMethodOfDismissal({
			// 	dismissEvent,
			// 	closeButtonRef,
			// })
			// safeAnalyticsTrack('AuthenticationErrorDialog dismissed', {
			// 	methodOfDismissal,
			// })
			signOut()
		},
		[signOut]
	)

	/**
	 * Set up the callback for the "Sign in" button's click. Tracks an analytics
	 * event and starts the sign in UI flow.
	 */
	const handleButtonClick = useCallback(() => {
		/**
		 * @TODO uncomment when the events have been architected
		 */
		// safeAnalyticsTrack('Click', {
		// 	category: 'AuthenticationErrorDialog sign in',
		// })
		signIn()
	}, [signIn])

	return (
		<Dialog
			isOpen={isRefreshAccessTokenError}
			label={label}
			onDismiss={handleDismiss}
			contentClassName={s.content}
		>
			<Text asElement="p" size={300} weight="semibold">
				{label}
			</Text>
			<button
				className={s.closeButton}
				onClick={handleDismiss}
				ref={closeButtonRef}
			>
				<IconX16 />
			</button>
			<Text asElement="p" className={s.body}>
				You have been signed out due to inactivity.
			</Text>
			<Button
				icon={<IconSignIn16 />}
				iconPosition="leading"
				text="Sign in"
				onClick={handleButtonClick}
			/>
		</Dialog>
	)
}

export default AuthenticationErrorDialog
