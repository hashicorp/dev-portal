/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import Button from 'components/button'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './sign-in-dialog.module.css'

export interface BookmarkSignInPromptProps {
	onDismiss(): void
	signIn(): void
}

export default function BookmarkSignInPrompt({
	onDismiss,
	signIn,
}: BookmarkSignInPromptProps) {
	return (
		<>
			<div className={s.header}>
				<Heading level={1} size={300} weight="semibold" className={s.heading}>
					Please sign in to bookmark this tutorial.
				</Heading>
				<button
					onClick={onDismiss}
					aria-label="Cancel"
					type="button"
					className={s.exitIcon}
				>
					<IconX16 />
				</button>
			</div>
			<Text className={s.subheading}>
				In order to add this bookmark, you must be signed in. Please sign in and
				try again.
			</Text>
			<div className={s.buttonGroup}>
				<Button text="Sign in" onClick={signIn} />
				<Button text="Cancel" color="secondary" onClick={onDismiss} />
			</div>
		</>
	)
}
