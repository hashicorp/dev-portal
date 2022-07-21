import useAuthentication from 'hooks/use-authentication'

export default function AuthPage() {
	const { isAuthenticated, signIn, signOut, user } = useAuthentication()
	if (isAuthenticated) {
		return (
			<>
				Signed in as {user.email} <br />
				<img src={user.image} alt={`${user.name} picture`} />
				<button onClick={() => signOut()}>Sign out</button>
			</>
		)
	}
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	)
}
