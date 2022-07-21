import { useSession, signIn, signOut } from 'next-auth/react'

// 1. useAuthentication hook?
// exposes pre-configured signIn method

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
			<button onClick={() => signIn('cloud-idp')}>Sign in</button>
		</>
	)
}
