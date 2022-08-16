import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import Button from 'components/button'
import Heading from 'components/heading'
import Text from 'components/text'
import useAuthentication from 'hooks/use-authentication'
import s from './sign-in-dialog.module.css'

export default function BookmarkSignInPrompt({
	onDismiss,
}: {
	onDismiss(): void
}) {
	const { signIn } = useAuthentication()
	return (
		<>
			<div className={s.header}>
				<Heading level={1} size={300} weight="medium" className={s.heading}>
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
			<Text>
				In order to add this bookmark, you must be signed in. Please sign in and
				try again.
			</Text>
			<div className={s.buttonGroup}>
				<Button text="Sign in" onClick={() => signIn()} />
				<Button text="Cancel" color="secondary" onClick={onDismiss} />
			</div>
		</>
	)
}
