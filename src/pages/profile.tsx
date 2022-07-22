import useAuthentication from 'hooks/use-authentication'
import BaseNewLayout from 'layouts/base-new'
import ProfileView from 'views/profile-view'

const ProfilePage = () => {
	const { user } = useAuthentication()

	return <ProfileView user={user} />
}

ProfilePage.layout = BaseNewLayout
export default ProfilePage
