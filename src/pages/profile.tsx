import useAuthentication from 'hooks/use-authentication'
import BaseNewLayout from 'layouts/base-new'
import ProfileView from 'views/profile-view'
import { useState, useEffect } from 'react';

const ProfilePage = () => {
	const { user, session } = useAuthentication()

	// Bookmark Stuff
	const [bookmarks, setBookmarks] = useState([])
	useEffect(() => {
		if(session?.access_token) {
			fetch('https://pidr8rzmwp.us-east-1.awsapprunner.com/bookmarks', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${session.access_token}`
				},
			})
			.then((res) => res.json())
			.then((res) => {
				console.log(res.result)
				setBookmarks(res.result)
			})
		}
	}, session)

	return <ProfileView user={user} bookmarks={bookmarks} />
}

ProfilePage.layout = BaseNewLayout
export default ProfilePage
