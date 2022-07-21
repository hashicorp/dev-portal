import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useAuthentication from 'hooks/use-authentication'
import BaseNewLayout from 'layouts/base-new'
import ProfileView from 'views/profile-view'

const ProfilePage = () => {
	const router = useRouter()
	const { isLoading, isAuthenticated, user } = useAuthentication()

	// Redirect to the `auth` page if not authenticated
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push('/auth')
		}
	}, [isAuthenticated, isLoading, router])

	// Show loading message while data is loading
	if (!user) {
		return <h1>Loading profile...</h1>
	}

	// Show user's profile after loading authentication data
	return <ProfileView user={user} />
}

ProfilePage.layout = BaseNewLayout
export default ProfilePage
