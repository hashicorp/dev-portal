import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthPage() {
	const { data: session } = useSession()
	if (session) {
		return (
			<>
				Signed in as {session.user.email} <br />
				<img src={session.user.image} alt={`${session.user.name} picture`} />
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
