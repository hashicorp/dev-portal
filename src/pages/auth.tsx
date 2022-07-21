import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useAuthentication from 'hooks/use-authentication'
import BaseNewLayout from 'layouts/base-new'
import Button from 'components/button'

const AuthPage = () => {
	const router = useRouter()
	const { isAuthenticated, isLoading, signIn } = useAuthentication()

	// Redirect to the /profile page if the user is already authenticated
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push('/profile')
		}
	}, [isAuthenticated, isLoading, router])

	// Show loading message while data is loading
	if (isLoading) {
		return <h1>Loading...</h1>
	}

	// Show Sign In button after loading authentication data
	return (
		<div style={{ padding: 32, margin: '0 auto' }}>
			<Button onClick={() => signIn()} text="Sign In" />
		</div>
	)
}

AuthPage.layout = BaseNewLayout
export default AuthPage
