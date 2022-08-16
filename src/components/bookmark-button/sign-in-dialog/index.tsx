import Button from 'components/button'
import Heading from 'components/heading'
import Text from 'components/text'
import useAuthentication from 'hooks/use-authentication'

export default function BookmarkSignInPrompt({
	onDismiss,
}: {
	onDismiss(): void
}) {
	const { signIn } = useAuthentication()
	return (
		<>
			<Heading level={1} size={300} weight="medium">
				Please sign in to bookmark this tutorial.
			</Heading>
			<Text>
				In order to add this bookmark, you must be signed in. Please sign in and
				try again.
			</Text>
			<Button text="Sign in" onClick={() => signIn()} />
			<Button text="Cancel" color="secondary" onClick={onDismiss} />
		</>
	)
}
